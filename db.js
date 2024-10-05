// getting-started.js
const mongoose = require("mongoose");

// connectToMongo().catch(err => console.log(err));

const mongoURI = "mongodb+srv://vkunal591:<password>@mrcoader.sp3kzac.mongodb.net/?retryWrites=true&w=majority";

async function connectToMongo() {
  await mongoose
    .connect("mongodb://127.0.0.1:27017/Pillingsystem")
    .then(console.log("Mongo Now Connected Successfully."));

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}


module.exports = connectToMongo;
