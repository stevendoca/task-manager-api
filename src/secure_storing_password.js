const express = require('express')
require('./db/mongoose')
const app = express()
const port = process.env.PORT || 3000
const userRouter = require('./routers/users')
const taskRouter = require('./routers/tasks')

app.use(express.json()) // convert JSON data into object

app.use(userRouter)
app.use(taskRouter)

const bcrypt = require('bcrypt')
const myFunction = async () =>{
    const password = 'Red12345'
    //convert plain password to hashed password.
    // hashed password can't convert back to original
    const hashedPassword = await bcrypt.hash(password, 8)
    //compare the plain password user enter and hashsed password in the database
    const isMatch = await bcrypt.compare('Red12345', hashedPassword)
    console.log(password)
    console.log(hashedPassword)
    //return true 
    console.log(isMatch)
}
myFunction()

app.listen (port, () => {
    console.log('server is up on ' + port)
})