const mongoose = require("mongoose");
const { Schema } = mongoose;

// Create a subdocument schema for blog sections
const studentSectionSchema = new Schema({
  idcardno: String,
  class: String,
  rollno: Number,
  img: String
});

const teacherSectionSchema = new Schema({
  department: String,
  idcardno: String
});

// Create the main blog schema
const userschema = new Schema({
  occupation: {
    type: String,
    require: true
  },
  name: {
    type: String,
    require: true
  },
  phone: {
    type: String,
    require: true
  },
  email: {
    type: String
  },
  password:{
    type:String,
    require:true
  },
  student: [studentSectionSchema],
  teacher: [teacherSectionSchema],

  hidden: Boolean,
  date: {
    type: Date,
    default: Date.now
  }
});

// // Add a virtual property for summary
// userschema.virtual("summary").get(function () {
//   // Return the first paragraph of the first section of the blog content
//   return this.blogcontent[0].content.split("\n")[0];
// });

// // Add a virtual property for rating
// userschema.virtual("rating").get(function () {
//   // Return the average of votes and favs
//   return (this.meta.votes + 1)})

module.exports = mongoose.model("User", userschema);
