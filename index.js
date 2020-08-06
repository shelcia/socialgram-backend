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
  { useNewUrlParser: true, useUnifiedTopology: true },
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
    const post = await Post.findById(req.params.id).exec();
    post.set(req.body);
    const result = await post.save();
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});
app.put("/likes/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).exec();
    post.set(req.body);
    const result = await post.save();
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});
app.put("/dislikes/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).exec();
    post.set(req.body);
    const result = await post.save();
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});
app.put("/hearts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).exec();
    post.set(req.body);
    const result = await post.save();
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(PORT, () => console.log(`server up and running at  ${PORT}`));
