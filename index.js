const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const PORT = process.env.PORT || 4000;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verify = require("./verify");

//VALIDATION OF USER INPUTS PREREQUISITES
const Joi = require("@hapi/joi");

const Post = require("./models/Post");
const User = require("./models/User");

dotenv.config();

//CONNECTION TO DATABASE

mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  () => console.log("connected to db  ")
);

//MIDDLEWARE

app.use(express.json(), cors());

//AUTHORISATION RELATED API

const registerSchema = Joi.object({
  fname: Joi.string().min(3).required(),
  lname: Joi.string().min(3).required(),
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).required(),
});
const loginSchema = Joi.object({
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).required(),
});

app.post("/register", async (req, res) => {
  //CHECK IF MAIL ALREADY EXISTS

  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) res.send(400).send({ message: "Email Already Exists" });

  //HASHING THE PASSWORD

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    //VALIDATION OF USER INPUTS

    const { error } = await registerSchema.validateAsync(req.body);
    if (error) res.send(400).send(error);
    //THE USER IS ADDED
    else {
      await user.save();
      res.status(200).send({ message: "user created" });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

//SIGNIN USER

app.post("/signin", async (req, res) => {
  //CHECKING IF EMAIL EXISTS

  const user = await User.findOne({ email: req.body.email });
  if (!user) res.status(400).send({ message: 'Email doesn"t exist' });

  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword)
    res.status(400).send({ message: "Incorrect Password !!!" });

  try {
    const { error } = await loginSchema.validateAsync(req.body);
    if (error) return res.status(400).send({ message: error });
    else {
      //CREATE TOKEN
      const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
      res
        .status(200)
        .header("auth-token", token)
        .send({ token: token, userId: user._id });
    }
  } catch (error) {
    res.status(400).send({ message: error });
  }
});

app.get("/userdetails/:id", async (req, res) => {
  try {
    const results = await User.findOne({
      _id: req.params.id.toString(),
    }).exec();
    res.status(200).send(results);
  } catch (error) {
    res.status(404).send({ message: "Error" });
  }
});

app.put("/userdetails/edit/:id", async (req, res) => {
  try {
    await User.findOneAndUpdate(
      { _id: req.params.id.toString() },
      { fname: req.body.fname, lname: req.body.lname }
    );
    res.status(200).send({ message: "successfull" });
  } catch (error) {
    console.log(error);
  }
});

//POST RELATED API

app.get("/post", async (req, res) => {
  try {
    const results = await Post.find().exec();
    res.status(200).send(results);
  } catch (error) {
    console.log(error);
    res.status(404).send({ message: "Error" });
  }
});

app.post("/post", async (req, res) => {
  const post = new Post({
    id: req.body.id,
    userId: req.body.userId,
    title: req.body.title,
    likes: req.body.likes,
    dislikes: req.body.dislikes,
    hearts: req.body.hearts,
    comments: req.body.comments,
  });
  try {
    await post.save();
    res.status(200).send({ message: "successfully created" });
  } catch (error) {
    console.log(error);
    res.status(404).send({ message: "Error" });
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
    res.status(200).send({ message: "successfull" });
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
    res.status(200).send({ message: "successfull" });
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
    res.status(200).send({ message: "successfull" });
  } catch (error) {
    res.status(500).send(error);
  }
});
app.get("/myposts/:id", async (req, res) => {
  try {
    const results = await Post.find({
      userId: req.params.id.toString(),
    }).exec();
    res.status(200).send(results);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(PORT, () => console.log(`server up and running at  ${PORT}`));
