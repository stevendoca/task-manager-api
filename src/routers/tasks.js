const express = require('express')
const Task = require('../models/tasks')
const auth = require ('../middleware/auth')
const router = new express.Router()

router.post('/tasks', auth, async (req,res) =>{
    try {
        const task = new Task ({
            ...req.body,
            owner: req.user._id
        })
        await task.save()
        res.send(task)

    }catch(e){
        res.status(400).send(e)
    }
})

router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}
    if (req.query.completed){
        // de convert 'string' thanh 'boolean'
        match.completed = req.query.completed === 'true'
    }
    if (req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try {
      //  const tasks = await Task.find({owner:req.user._id})
      await req.user.populate({
          path: 'tasks',
        //   match: {
        //       completed: false
        //   }
          match,
          options:{
            limit: parseInt(req.query.limit),
            skip: parseInt(req.query.skip),
            sort,
            
          }
      }).execPopulate()
        res.send(req.user.tasks)
    }catch(e){
        res.status(500).send(e)
    }
})

router.get('/tasks/:id', auth, async(req, res) => {
    try {
        const _id = req.params.id
        const task = await Task.findOne ({_id, owner: req.user._id})

        if (!task){
            res.status(404).send()
        }
        res.send(task)
    } catch(e) {
        res.status(404).send(e)
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowed = ['description', 'completed']
    const isOk = updates.every((update) => {
        return allowed.includes(update)
    })
    if (!isOk){
        return res.status(400).send({'hha':'hii'})
    }
    
   // const tasks = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true})
    try {
       // const task = await Task.findById(req.params.id)
       const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
        if (!task){
            return res.status(404).send({'no id': 'no id'})
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    }catch(e) {
        res.status(500).send()
    }
})



router.delete("/tasks/:id", auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id:req.params.id, owner: req.user._id})
        if(!task) {
        return    res.status(400).send()
        }
        res.send(task)

    }catch(e){
        res.status(404).send()
    }
})

module.exports = router