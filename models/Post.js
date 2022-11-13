const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  //DATE IS THE ID
  id: {
    type: String,
    required: true,
  },
  user: {
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
  },
  owner: {
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
  },
  title: {
    type: String,
    required: true,
  },
  fire: {
    type: Number,
    required: true,
  },
  comments: {
    type: Array,
  },
  reshare: {
    type: Boolean,
    default: false,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Post", postSchema);
