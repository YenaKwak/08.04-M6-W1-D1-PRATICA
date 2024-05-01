const express = require("express");
const router = express.Router();
const multer = require("multer");
const { cloudinary } = require("../../root/cloudinaryConfig");
const { storage } = require("../../root/cloudinaryConfig");
const BlogPost = require("../models/blogPost.model");
const { parser } = require("../middlewares/multer"); //blogPosts/:id/cover 엔드포인트에서만 사용하도록
const { authMiddleware } = require("../middlewares/authenticateToken");
const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
  try {
    const posts = await BlogPost.find();
    console.log("Posts found:", posts);
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).send("Server Error");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    console.log("Fetched Post:", post);
    if (post) {
      res.send(post);
    } else {
      res.status(404).send("post not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const newPost = await BlogPost({
      title,
      content,
      category,
      author: req.user._id,
    });
    await newPost.save();
    res.statusMessage(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to create post");
  }
});

router.put("/:id", async (req, res) => {
  if (!req.body.title || !req.body.content) {
    return res.status(400).send("Title and content are required for update");
  }
  try {
    const updatedPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (updatedPost) {
      res.send(updatedPost);
    } else {
      res.status(404).send("Post not found, unable to update");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedPost = await BlogPost.findByIdAndDelete(req.params.id);
    if (deletedPost) {
      res.send(deletedPost);
    } else {
      res.status(404).send("Post not found, unable to delete");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

router.patch("/:blogPostId/cover", upload.single("cover"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  try {
    // Cloudinary에 이미지 업로드
    const result = await cloudinary.uploader.upload(req.file.path);
    console.log("Cloudinary Upload Success", result.secure_url);

    // 블로그 포스트의 cover 필드를 업데이트
    const post = await BlogPost.findByIdAndUpdate(
      req.params.blogPostId,
      { cover: result.secure_url },
      { new: true }
    );

    if (!post) {
      return res.status(404).send("BlogPost not found");
    }

    // 업데이트된 포스트 반환
    res.json(post);
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    res.status(500).send("Unable to upload image");
  }
});

module.exports = router;
