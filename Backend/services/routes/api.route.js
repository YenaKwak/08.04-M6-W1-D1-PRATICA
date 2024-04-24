const { Router } = require("express");
const Author = require("../models/author.model");
const parser = require("../middlewares/multer");
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

// authorRouter.patch(
//   "/:authorId/avatar",
//   upload.single("avatar"),
//   async (req, res) => {
//     try {
//       const author = await Author.findById(req.params.authorId);
//       if (author) {
//         author.avatar = req.file.path;
//         await author.save();
//         res.status(200).send(author);
//       } else {
//         res.status(404).send("Author not found");
//       }
//     } catch (error) {
//       res.status(500).send(error);
//     }
//   }
// );

// module.exports = authorRouter;

authorRouter.patch(
  "/:authorId/avatar",
  parser.single("avatar"),
  async (req, res) => {
    try {
      // 파일 업로드가 성공적으로 multer를 통해 처리되었는지 확인
      if (!req.file) return res.status(400).send("No file uploaded.");

      // Cloudinary에 이미지 업로드
      const result = await cloudinary.uploader.upload(req.file.path);

      // 작가 새 아바타 URL로 업데이트
      const updatedAuthor = await Author.findByIdAndUpdate(
        req.params.authorId,
        {
          avatar: result.secure_url,
        },
        { new: true }
      );

      res.json(updatedAuthor);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Avatar upload failed", error: error.message });
    }
  }
);

module.exports = authorRouter;
