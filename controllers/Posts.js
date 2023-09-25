const asyncHandler = require("express-async-handler");
const Post = require("../model/post");
const Like = require("../model/like");

const getPosts = asyncHandler(async (req, res) => {
  const { username } = req.user;

  try {
    const posts = await Post.find({ author: username })
      .populate("likes")
      .exec();

    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: "No posts found" });
    }

    return res.status(200).json({ posts: posts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

const getSinglePost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Please provide id" });
  }

  try {
    const post = await Post.findById(id).populate("likes").exec();

    if (!post) {
      return res.status(404).json({ message: "No post found" });
    }

    return res.status(200).json({ post: post });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

const createPost = asyncHandler(async (req, res) => {
  // Validate input
  const { description } = req.body;
  if (!description) {
    return res.status(400).json({ message: "Please provide a description" });
  }

  const { username } = req.user;

  // Create the post and the like object
  const post = await Post.create({ description, author: username });
  const like = new Like({ post_id: post._id });

  // Assign the like ID to the post
  post.likes = like._id;

  // Use Promise.all to save both the post and the like object concurrently
  await Promise.all([post.save(), like.save()]);

  // Check if there were any errors
  if (post.isNew || like.isNew) {
    return res
      .status(500)
      .json({ error: "An error occurred while saving the post or like" });
  }

  // Populate the "likes" field for the post
  await post.populate("likes");

  return res.json({ post });
});

const editPost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { description } = req.body;
  if (!description) {
    return res.status(400).json({ message: "Please provide a description" });
  }
  const updatedPost = await Post.findOneAndUpdate(
    { _id: id },
    { description },
    { new: true }
  );

  if (!updatedPost) {
    return res.status(404).json({ message: "No post found" });
  }

  return res.status(200).json({ message: "Post updated successfully" });
});

const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deletedPost = await Post.findOneAndDelete({ _id: id });
  if (!deletedPost) {
    return res.status(404).json({ message: "No post found" });
  }

  return res.status(204).json({ message: "Post deleted successfully" });
});

module.exports = {
  getPosts,
  getSinglePost,
  createPost,
  deletePost,
  editPost,
};
