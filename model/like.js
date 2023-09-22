const mongoose = require("mongoose");

const likeSchema = mongoose.Schema(
  {
    likes: {
      type: Number,
    },
    post_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "please provide the posts id"],
      ref: "Post",
    },
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Like", likeSchema);
