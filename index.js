const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3002;

const mongoDBAtlasUrl =
  "mongodb+srv://yenak26:<Mypassword..>@cluster0.p6npxtq.mongodb.net/";

mongoose
  .connect(mongoDBAtlasUrl)
  .then(() => console.log("Connected to MongoDB atlas!!!!!"))
  .catch((err) => console.error("Error connecting to MongoDB atlas:", err));

const authorSchema = new mongoose.Schema({
  nome: String,
  cognome: String,
  email: String,
  dataDiNascita: String,
  avatar: String,
});

const Author = mongoose.model("Author", authorSchema);
app.use(express.json());

const authorRouter = express.Router();

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

app.use("/authors", authorRouter);

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
