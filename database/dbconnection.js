const mongoose = require("mongoose");

const main = async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/populaize');
}
main().then(()=>{
console.log('Database Connected.')
}).catch(()=>{
console.log('Database is not Connected.')
})

module.exports = mongoose;