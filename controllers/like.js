const asyncHandler = require("express-async-handler");
const Like = require("../model/like");
const Post = require("../model/post");

const handleLikeChange = asyncHandler(async (req, res) => {
  // Extract postId and userId from request parameters and user data
  const { postId } = req.params;
  const { id: userId } = req.user;

  // Find an existing like document for the post and user
  const existingLike = await Like.findOne({
    post_id: postId,
    likedBy: userId,
  });

  if (existingLike) {
    // User has already liked the post, remove the like
    const index = existingLike.likedBy.indexOf(userId);
    if (index !== -1) {
      existingLike.likedBy.splice(index, 1);
    }

    // Decrease the 'likes' count
    existingLike.likes--;

    // Save the updated like document
    await existingLike.save();

    return res.status(200).json({ message: "Post unliked successfully" });
  } else {
    // User hasn't liked the post, create a new like document
    const newLike = new Like({
      post_id: postId,
      likedBy: [userId],
      likes: 1,
    });

    // Save the new like document
    await newLike.save();

    return res.status(200).json({ message: "Post liked successfully" });
  }
});

module.exports = handleLikeChange;
