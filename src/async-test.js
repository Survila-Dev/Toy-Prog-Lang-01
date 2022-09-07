// Three approaches for using asynchronuous JS

// Recreate using setTimeout in all different approaches

// Callback-hell
// setTimeout(() => {
//     console.log("First timeout reached after 1000 ms")

//     setTimeout(() => {
//         console.log("Second timeout reached after 1000 ms")

//         setTimeout(() => {
//             console.log("Third timeout reached after 1000 ms")
            
//         }, 1000)
//     }, 1000)
// }, 1000)

// Promises

// the function inside .then should return Promise in order to have async chaining
// function returnAPromise(label) {

//     const outputPromise = new Promise((resolve, reject) => {
//         setTimeout(() => {
//             console.log(label)
//             resolve();
//         }, 1000)
//     })
// }

// const firstPromise = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         console.log("first promise firers after 1000 ms")
//         resolve();
//     }, 1000)

// }).then(function() {
    
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             console.log("second promise fires after 1000 ms")
//             resolve();
//         }, 1000)})

// }).then(function() {

//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             console.log("third promise fires after 1000 ms")
//         }, 1000)
//     })
// })

// Async function

const returnPromise = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("First await fires after 1000 ms")
            resolve("output");
        }, 1000)
        
    })
}

const asyncFunction = async() => {
    try {
        console.log("Nothing went wrong");
        await returnPromise();
        await returnPromise();
        await returnPromise();
        await returnPromise();
        console.log("Fire only after promise")

    } catch (err) {
        console.error("Something went wrong")
    }
} 

asyncFunction()