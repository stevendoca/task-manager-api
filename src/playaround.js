// const add = (a, b) => {
//     return new Promise ((resolve, reject) => {
//         setTimeout (() => {
//             if(a < 0 || b < 0){
//                 return reject('Numbers must be non- negative')
//             }
//             resolve(a + b)
//         },2000)
//     })
// }

// const doWork = async () => {
//     const sum = await add(1, 99)
//     const sum1 = await add(sum, -50)
//     const sum2 = await add(sum1, 5)
//     return sum2
// }

// doWork().then((result) =>{
//     console.log(result)
// }).catch((error) => {
//     console.log(error)
// })

// add(3, 4).then((result) => {
//     console.log(result)
//     return add(result,2)
// }).then((result) => {
//     console.log(result)
// }).catch ((error) => {
//     console.log(result)
// })

require('./db/mongoose')
const User = require('./models/users')
const Task = require('./models/tasks')

// const updateAgeAndCount = async (id, age) => {
//     const updateAge = await User.findByIdAndUpdate(id, {age: 9})
//     const count = await User.countDocuments({age:20})
//     return count
// }

// updateAgeAndCount("5ece1b8853af463468f016f3").then((results) => {
//     console.log(results)
// }).catch((error) => {
//     console.log(error)
// })

const deleteTaskAndAccount = async (id, status) => {
    await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({completed:status})
    return count
}

deleteTaskAndAccount("5ecdff0366c4d610409e7cd8",false).then((result) => {
    console.log(result)
}).catch((error) => {
    console.log(error)
})

// // User.findByIdAndUpdate('5ece1b8853af463468f016f3',{age: 1}).then ((result) => {
// //     console.log(result)
// //     return User.countDocuments({age: 1})
// // }).then ((result) => {
// //     console.log(result)
// // }).catch((error) => {
// //     console.log(error)
// // })

// Task.findByIdAndDelete("5ece331ca875a03cd4ccbe7f").then (() => {
//     console.log('delete task')
//     return Task.count({completed: false})
// }).then ((result) => {
//     console.log(result)
// }).catch((error) => {
//     console.log(error)
// })
