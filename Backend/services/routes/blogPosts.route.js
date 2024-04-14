const express = require("express");
const router = express.Router();
const BlogPost = require("../models/blogPost.model");

router.get("/", async (req, res) => {
  try {
    const posts = await BlogPost.find();
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
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

router.post("/", async (req, res) => {
  if (!req.body.title || !req.body.content) {
    return res.status(400).send("Title and content are required");
  }
  const post = new BlogPost(req.body);
  try {
    const newPost = await post.save();
    res.status(201).send(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
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

module.exports = router;
