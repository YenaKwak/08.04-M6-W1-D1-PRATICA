const { Router } = require("express");
const Author = require("../models/author.model");
const { cloudinary } = require("../../root/cloudinaryConfig");
const parser = require("../middlewares/multer");
const multer = require("multer");
const authorRouter = Router();

authorRouter.get("/", async (req, res) => {
  try {
    const authors = await Author.find();
    res.send(authors);
  } catch (error) {
    res.status(500).send(error);
  }
});

authorRouter.get("/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (author) {
      res.send(author);
    } else {
      res.status(404).send("Author not found");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

authorRouter.post("/", async (req, res) => {
  try {
    const newAuthor = new Author(req.body);
    const savedAuthor = await newAuthor.save();
    res.status(201).send(savedAuthor);
  } catch (error) {
    res.status(500).send(error);
  }
});

authorRouter.put("/:id", async (req, res) => {
  try {
    const updatedAuthor = await Author.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (updatedAuthor) {
      res.send(updatedAuthor);
    } else {
      res.status(404).send("Author not found");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

authorRouter.delete("/:id", async (req, res) => {
  try {
    const deletedAuthor = await Author.findByIdAndDelete(req.params.id);
    if (deletedAuthor) {
      res.status(200).send("Author deleted");
    } else {
      res.status(404).send("Author not found");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

authorRouter.patch(
  "/:authorId/avatar",
  parser.single("avatar"),
  async (req, res) => {
    const { authorId } = req.params;
    const author = await Author.findById(authorId);
    if (!author) {
      return status(404).send("Author not found");
    }

    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    try {
      // Cloudinary에 이미지를 업로드합니다.
      const result = await cloudinary.uploader.upload(req.file.path); // multer가 이미지를 임시 경로에 저장하고, 그 경로를 사용하여 업로드합니다.

      // 데이터베이스에서 해당 작가의 정보를 업데이트합니다.
      const updatedAuthor = await Author.findByIdAndUpdate(
        req.params.authorId,
        { avatar: result.secure_url },
        { new: true }
      );

      if (!updatedAuthor) {
        return res.status(404).send("Author not found");
      }

      res.json(updatedAuthor);
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      res.status(500).send("Avatar upload failed");
    }
  }
);

module.exports = authorRouter;
