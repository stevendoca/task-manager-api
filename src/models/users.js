const mongoose = require ('mongoose')
const validator = require ('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Task = require ('./tasks')


//create schema to seperate schema and models
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        minlength: 7,
        required: true,
        validate(value) {
            if (value.includes('password')){
                throw new Error ('password cant contain password')
            }
        }
    },
    email : {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error ('Please provide correct email format')
            }
        }
    },
    age : {
        type: Number,
        default: 0,
        validate (value) {
            if (value < 19) {
                throw new Error ('You are underage')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar:{
        type: Buffer
    }
}, {
    timestamps: true
})

userSchema.virtual ('tasks', {
    ref: 'Tasks',
    localField: '_id',
    foreignField: 'owner',

})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({_id:user._id.toString()}, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token: token})
    await user.save()
    return token
}

// watch video to understand reason why we do that (model method/function)
userSchema.statics.findByCredentials = async (email, password) => {
    //short hand syntax const user = await User.findOne ({email})
    const user = await User.findOne({email: email})
    if (!user){
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch){
        throw new Error('Unable to login')
    }
    return user
}
//the order is important these codes must go before const User = mongoose.model....
// khi viet code nhu the thi phai chinh code trong router/user
userSchema.pre('save', async function (next) {
    //do sth with current individual user
    const user = this
    if (user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next() 
})

userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({owner: user._id})
    next()
})

const User = mongoose.model ('User', userSchema )

// pre means: do sth before save action
//'save' argument means: what action we should do
//use normal function to bind this

module.exports = User