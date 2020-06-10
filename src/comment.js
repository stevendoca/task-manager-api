const express = require('express')
require('./db/mongoose')
const User = require('./models/users')
const Task = require('./models/tasks')
const app = express()
const port = process.env.PORT || 3000

app.use(express.json()) // convert JSON data into object

app.post ('/users', (req,res) => {
    const user = new User(req.body)
    user.save().then(() => { // chu y: user.save se return promise
        res.status(201).send(user)
    }).catch((e) => {
        res.status(400).send(e)
    })
})

app.post('/tasks',(req,res) =>{
    const task = new Task(req.body)
    task.save().then (() => {
        res.status(201).send(task)
    }).catch((e) => {
        res.status(400).send(e)
    })
})

app.get('/users', (req,res) => {
    User.find({}).then((users) => {
        res.status(500).send(users)
    }).catch((e) => {
        res.status(400).send(e)
    })
})

app.get('/users/:id', (req,res) => { // ":id" routing variable, whatever we put after users/ will be stored, thay vi "id" co the viet whatever you want
    const id = req.params.id        // req.params store all rounting variable, so coding nay se exact what you want
    User.findById(id).then((user) => { 
        if (!user) {
            res.status(404).send() // provide 12 digit id but it is invalid
        }
        res.send(user)
    }).catch((e) => {
        res.status(500).send(e) // provide more than 12 digits
    })
})

app.get('/tasks', (req, res) => {
    Task.find({}).then((result) => {
        if (!result) {
            res.status(404).send()
        }
        res.send(result)
    }).catch((error) => {
        res.status(500).send(error)
    })
})
app.listen (port, () => {
    console.log('server is up on ' + port)
})