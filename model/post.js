const mongoose = require("mongoose");
const Like = require("./like");
const postSchema = mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, "Please Provide a Description "],
      trim: true,
      maxLength: 500,
    },

    author: {
      type: String,
      required: [true, "Please provide the author name"],
    },
    likes: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Like",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postSchema);
