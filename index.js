const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const PORT = process.env.PORT || 4050;

const Post = require("./models/Post");

dotenv.config();

//CONNECTION TO DATABASE

mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  () => console.log("connected to db  ")
);

//MIDDLEWARE

app.use(express.json(), cors());

app.get("/post", async (req, res) => {
  try {
    const results = await Post.find().exec();
    res.status(200).send(results);
  } catch (error) {
    console.log(error);
    res.status(404).send("Error");
  }
});

app.post("/post", async (req, res) => {
  const post = new Post({
    id: req.body.id,
    title: req.body.title,
    likes: req.body.likes,
    dislikes: req.body.dislikes,
    hearts: req.body.hearts,
    comments: req.body.comments,
  });
  try {
    await post.save();
    res.status(200).send("successfully created");
  } catch (error) {
    console.log(error);
    res.status(404).send("Error");
  }
});
app.put("/comments/:id", async (req, res) => {
  try {
    const post = await Post.findOne({ id: req.params.id.toString() }).exec();
    post.set(req.body);
    const result = await post.save();
    res.send(result);
  } catch (error) {
    res.status(500).send(post);
  }
});
app.put("/likes/:id", async (req, res) => {
  try {
    await Post.findOneAndUpdate(
      { id: req.params.id.toString() },
      { likes: req.body.likes }
    );
    res.status(200).send("successfull");
  } catch (error) {
    res.status(500).send(error);
  }
});
app.put("/dislikes/:id", async (req, res) => {
  try {
    await Post.findOneAndUpdate(
      { id: req.params.id.toString() },
      { dislikes: req.body.dislikes }
    );
    res.status(200).send("successfull");
  } catch (error) {
    res.status(500).send(error);
  }
});
app.put("/hearts/:id", async (req, res) => {
  try {
    await Post.findOneAndUpdate(
      { id: req.params.id.toString() },
      { hearts: req.body.hearts }
    );
    res.status(200).send("successfull");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(PORT, () => console.log(`server up and running at  ${PORT}`));
