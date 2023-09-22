const express = require("express");
const validateToken = require("../middleware/validate");
const {
  getPosts,
  createPost,
  getSinglePost,
  editPost,
  deletePost,
} = require("../controllers/Posts");
const handleLikeChange = require("../controllers/like");

const router = express.Router();

router.use(validateToken);
router.route("/posts/:postId/like").patch(handleLikeChange);

router.route("/posts").get(getPosts).post(createPost);
router
  .route("/posts/:id")
  .get(getSinglePost)
  .patch(editPost)
  .delete(deletePost);

module.exports = router;
