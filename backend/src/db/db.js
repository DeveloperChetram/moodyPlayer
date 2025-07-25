
const mongoose = require('mongoose');
const connectToDB = ()=>{
    mongoose.connect(process.env.MONGO_URL)
    .then(()=>{
        console.log("Connected to MongoDB");
    })
    .catch((err)=>{
    console.error("Error connecting to MongoDB:", err);
});
}

module.exports = connectToDB;
