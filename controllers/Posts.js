const asyncHandler = require("express-async-handler");
const Post = require("../model/post");
const Like = require("../model/like");

const getPosts = asyncHandler(async (req, res) => {
  const { username } = req.user;

  try {
    const posts = await Post.find({ author: username }).exec();

    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: "No posts found" });
    }

    const populatedPosts = await Promise.all(
      posts.map(async (post) => {
        const likes = await Like.find({ post_id: post._id }).exec();
        return { ...post.toObject(), likes };
      })
    );

    return res.status(200).json({ posts: populatedPosts });
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
    const post = await Post.findById(id).exec();

    if (!post) {
      return res.status(404).json({ message: "No post found" });
    }

    const likes = await Like.find({ post_id: post._id }).exec();
    const populatedPost = { ...post.toObject(), likes };

    return res.status(200).json({ post: populatedPost });
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

  const post = await Post.create({ description, author: username });

  // Return the created post
  return res.status(201).json({ post });
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

  return res.status(200).json({ updatedPost });
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
