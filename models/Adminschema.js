const mongoose = require("mongoose");
const { Schema } = mongoose;


// Create the main blog schema
const adminschema = new Schema({
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
  admin: Boolean,
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

module.exports = mongoose.model("Admin", adminschema);
