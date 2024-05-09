import { Router } from "express";
import Author from "../models/author.model";
import { cloudinary } from "../../root/cloudinaryConfig";
import parser from "../middlewares/multer";
import multer from "multer"; // multer를 import하여 파일 업로드를 처리
import bcrypt from "bcryptjs"; // bcrypt를 import하여 비밀번호를 해시 처리

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
  //사용자등록과 함께 비밀번호 암호화로 변경
  const { name, lastName, email, password, birthday } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const newAuthor = new Author({
      name,
      lastName,
      email,
      password: hashedPassword,
      birthday,
    });
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

export default authorRouter;
