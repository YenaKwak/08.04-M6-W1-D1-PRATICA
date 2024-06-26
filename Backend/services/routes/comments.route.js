import express from "express";
import Comment from "../models/comments.model.js";
import BlogPost from "../models/blogPost.model.js";
import { authMiddleware } from "../middlewares/authenticateToken.js";

const commentRouter = express.Router();

// 특정 포스트의 모든 댓글 가져오기
commentRouter.get("/blogPosts/:id/comments", async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.id });
    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).send("Server Error");
  }
});

// 특정 포스트의 특정 댓글 가져오기
commentRouter.get(
  "/blogPosts/:postId/comments/:commentId",
  async (req, res) => {
    try {
      const comment = await Comment.findOne({
        _id: req.params.commentId,
        postId: req.params.postId,
      });
      if (!comment) {
        return res.status(404).send("Comment not found");
      }
      res.json(comment);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).send("server error");
    }
  }
);

//특정 포스트에 댓글 추가
commentRouter.post(
  "/blogPosts/:id/comment",
  authMiddleware,
  async (req, res) => {
    try {
      const { comment } = req.body;
      const post = await BlogPost.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      // 댓글 추가 로직 구현
      post.comments.push({ text: comment, createdBy: req.user._id });
      await post.save();
      res.status(201).json(post);
    } catch (error) {
      res.status(500).send("failed to add comment");
    }
  }
);

//특정 포스트의 특정 댓글 수정
commentRouter.put(
  "/blogPosts/:postId/comments/:commentId",
  async (req, res) => {
    try {
      const comment = await Comment.findOneAndUpdate(
        { _id: req.params.commentId, postId: req.params.postId },
        { text: req.body.text },
        { new: true }
      );
      if (!comment) {
        return res.status(404).send("Comment not found");
      }
      res.json(comment);
    } catch (error) {
      console.error("Error updating comment", error);
      res.status(500).send("Server error");
    }
  }
);

//특정 포스트의 특정 댓글 삭제
commentRouter.delete(
  "/blogPosts/:postId/comments/:commentId",
  async (req, res) => {
    try {
      const result = await Comment.findOneAndDelete({
        _id: req.params.commentId,
        postId: req.params.postId,
      });
      if (!result) {
        return res.status(404).send("Comment not found");
      }
      res.status(204).send("Comment deleted"); //삭제성공시 204응답
    } catch (error) {
      console.error("Error deleting comment", error);
      res.status(500).send("Server error");
    }
  }
);

export default commentRouter;
