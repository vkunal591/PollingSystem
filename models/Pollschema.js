const mongoose = require("mongoose");
const { Schema } = mongoose;



// Create a subdocument schema for comments
const commentSchema = new Schema({
    body: String,
    date: Date
  });

// Create the main blog schema
const pollschema = new Schema({
  pollername: {
    type: String,
    required: true // Use validation to make this field mandatory
  },
  poller_id: {
    type: String,
    required: true // Use validation to make this field mandatory
  },
  participent_id: {
    type: String
  },
  participent_teamname: {
    type: String
  },
  points:{
    type:Number
  },
  comments: [commentSchema], // Use an array of subdocuments
  hidden: Boolean,
  date: {
    type: Date,
    default: Date.now
  }
});

// // Add a virtual property for summary
// pollschema.virtual("summary").get(function () {
//   // Return the first paragraph of the first section of the blog content
//   return this.blogcontent[0].content.split("\n")[0];
// });  

// // Add a virtual property for rating
// pollschema.virtual("rating").get(function () {
//   // Return the average of votes and favs
//   return (this.meta.votes + 1)})

  module.exports = mongoose.model("Poll", pollschema);
