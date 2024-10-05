"use strict";

var mongoose = require("mongoose");

var Schema = mongoose.Schema; // Create a subdocument schema for comments

var commentSchema = new Schema({
  body: String,
  date: Date
});
var pointsSchema = new Schema({
  body: Number,
  user: String
}); // Create the main blog schema

var participentSchema = new Schema({
  admin: {
    type: String,
    required: true // Use validation to make this field mandatory

  },
  category: {
    type: String,
    required: true // Use validation to make this field mandatory

  },
  teamname: {
    type: String,
    required: true // Use validation to make this field mandatory

  },
  teamleader: {
    type: String
  },
  content: {
    type: String
  },
  points: {
    type: Number
  },
  // Use an array of subdocuments
  comments: {
    type: Number
  },
  // Use an array of subdocuments
  rank: {
    type: Number
  },
  hidden: {
    type: Boolean,
    "default": false
  },
  meta: {
    votes: Number,
    favs: Number
  },
  date: {
    type: Date,
    "default": Date.now
  }
}); // // Add a virtual property for summary
// pollschema.virtual("summary").get(function () {
//   // Return the first paragraph of the first section of the blog content
//   return this.blogcontent[0].content.split("\n")[0];
// });  
// // Add a virtual property for rating
// pollschema.virtual("rating").get(function () {
//   // Return the average of votes and favs
//   return (this.meta.votes + 1)})

module.exports = mongoose.model("Participent", participentSchema);