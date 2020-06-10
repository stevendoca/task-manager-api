const express = require('express')
const router = new express.Router()
const User = require('../models/users')
const jwt = require('jsonwebtoken')
const auth = require("../middleware/auth")
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail, cancelEmail } = require('../email/account')



router.post ('/users', async (req,res) => {
    const user = new User(req.body)
    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try{
        //Note: findByCredentail is not a built in function
        //we will define it in models/users.js
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        //we have annonymous object
        res.send({user, token})
    }catch(e){
        res.status(400).send(e)
    }
})

router.post ('/users/logout', auth, async (req, res) => {
    try {
        // let tokens = [{token: '54654646546546'}, {token: '46478789789778'}]
        // console.log(tokens[0].token) //in ra 54654646546546
        req.user.tokens = req.user.tokens.filter ((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        const message = req.message
    }catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logOutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req,res) => {
    res.send(req.user)
})

// router.get('/users/:id', async(req,res) => {
//     try {
//         const id = req.params.id
//         const user = await User.findById(id)
//         if (!user) {
//             res.status(404).send()
//         }
//         res.send(user)

//     }catch(e) {
//         res.status(404).send(e)
//     }
// })

router.delete('/users/me', auth, async (req, res) => {
    try{
    //    const users = await User.findByIdAndDelete(req.user.id)
    //     if (!users){
    //         return res.status(400).send()
    //     }

    //why req.user
        await req.user.remove()
        cancelEmail(req.user.email, req.user.name)
        //why only user
        res.send(req.user)
    }catch(e) {
        res.status(404).send()
    }
    
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body) // convert object to array
    const allowUpdates = ['name','age','password', 'email']
    const isValid = updates.every((update) => allowUpdates.includes(update))
    console.log(isValid)
    if (!isValid) {
        return res.status(400).send({'error': 'error'})
    }
    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
       // const user = await User.findByIdAndUpdate(req.params.id, req.body, {new:true})
        res.send(req.user)
    }catch (e) {
        res.status(400).send(e)
    }
})

const post = multer({
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb){
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb (new Error('please upload a jpeg'))
        }
        cb(undefined, true)
    }
})
router.post('/users/me/avatar', auth, post.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
},(error, req, res, next) =>{
    res.status(400).send({error:error.message})
} )

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async (req, res) => {
    try{
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar){
             throw new Error()
        }
        res.set('Content-type', 'image/png')
        res.send(user.avatar)
    }catch(e){
        res.status(404).send(e)
    }
})

module.exports = router