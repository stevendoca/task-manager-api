const express = require('express')
require('./db/mongoose')
const app = express()
//environment variable
const port = process.env.PORT
const userRouter = require('./routers/users')
const taskRouter = require('./routers/tasks')
const multer = require('multer')

const upload = multer ({
    dest: 'images',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        //file.originalname.endsWith('pdf')
        if (!file.originalname.match(/\.(doc|docx)$/)){
            return cb (new Error('please upload a word document'))
        }
        cb(undefined, true)
    }
})

// const errorMiddleware = (req, res, next) => {
//     console.log('testing error')
//     throw new Error (' Error from my middleware')
// }

app.post('/upload', upload.single('upload'), (req, res) => {
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

//why upload.single('upload') whatever name, but trong body-formdata, key must match with this name
// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send()
// })

// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send('GET requests are disable')
//     } else {
//         next()
//     }
// })

// app.use ((req, res, next) => {
//     if (req.method){
//         res.send('server is matained')
//     }
// })

app.use(express.json()) // convert JSON data into object
app.use(userRouter)
app.use(taskRouter)

// //loading json web token from npm
// const jwt = require('jsonwebtoken')
// const myFunction = async () =>{
//     //sign method contains 2 arguments: 1st is object, 2nd is string
//     //1st: data embended in token, authentication: unique identify user. should be id
//     //2nd:secret, sign the token make sure that it hasnt been tampered or altered in
//     const token = jwt.sign ({_id: 'abc123'}, 'thisissteven', {expiresIn: '1 day'})
//     console.log(token)
    
//     //will return an object contains:
//     //original information: "abc123"
//     //data of issue
//     //expiry
//     const data = jwt.verify(token,'thisissteven')
//     console.log(typeof data)
//     console.log(data)
    
// }
// myFunction()
const Task = require('./models/tasks')
const User = require('./models/users')
// const main = async () => {
//     // const task = await task.findById('5ed5f61b20f4615ac45fff22')
//     // await task.populate('owner').execPopulate()
//     // console.log(task.owner)
//     const user = await User.findById("5ed5f28b8eaf0147b8484f55")
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }
// main()

app.listen (port, () => {
    console.log('server is up on ' + port)
})