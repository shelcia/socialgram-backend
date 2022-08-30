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
const Joi = require("joi");

const Post = require("./models/Post");
const User = require("./models/User");

dotenv.config();

//CONNECTION TO DATABASE

mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  () => console.log("connected to db")
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
  if (emailExist) {
    res.status(200).send({ status: "400", message: "Email Already Exists" });
    return;
  }

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
    if (error) {
      res.status(200).send({ status: "500", message: error });
    }
    //THE USER IS ADDED
    else {
      await user.save();
      res.status(200).send({ status: "200", message: "user created" });
    }
  } catch (error) {
    res.status(200).send({ status: "500", message: error });
  }
});

//SIGNIN USER

app.post("/signin", async (req, res) => {
  //CHECKING IF EMAIL EXISTS

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(200).send({ status: "400", message: 'Email doesn"t exist' });
    return;
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword) {
    res.status(200).send({ status: "400", message: "Incorrect Password !!!" });
    return;
  }

  try {
    const { error } = await loginSchema.validateAsync(req.body);
    if (error) {
      res.status(200).send({ status: "400", message: error });
      return;
    } else {
      //CREATE TOKEN
      const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
      res
        .status(200)
        .header("auth-token", token)
        .send({ status: "200", message: { token: token, userId: user._id } });
    }
  } catch (error) {
    res.status(200).send({ status: "500", error });
  }
});

app.get("/userdetails/:id", async (req, res) => {
  try {
    const results = await User.findOne({
      _id: req.params.id.toString(),
    }).exec();
    res.status(200).send({ status: "200", message: results });
  } catch (error) {
    res.status(200).send({ status: "500", message: error });
  }
});

app.get("/userId", async (req, res) => {
  try {
    const results = await User.find({}).select({ fname: 1, _id: 1 });
    res.status(200).send(results);
  } catch (error) {
    res.status(200).send({ status: "500", message: error });
  }
});

app.put("/userdetails/edit/:id", async (req, res) => {
  try {
    await User.findOneAndUpdate(
      { _id: req.params.id.toString() },
      { fname: req.body.fname, lname: req.body.lname }
    );
    res
      .status(200)
      .send({ status: "200", message: "successfully edited your profile" });
  } catch (error) {
    res.status(200).send({ status: "500", message: error });
  }
});

//POST RELATED API

app.get("/post", async (req, res) => {
  try {
    const results = await Post.find().exec();
    res.status(200).send(results);
  } catch (error) {
    res.status(200).send({ status: "500", message: error });
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
    res
      .status(200)
      .send({ status: "200", message: "successfully created your post" });
  } catch (error) {
    console.log(error);
    res.status(200).send({ status: "500", message: error });
  }
});
app.put("/comments/:id", async (req, res) => {
  try {
    const post = await Post.findOne({ id: req.params.id.toString() }).exec();
    post.set(req.body);
    const result = await post.save();
    res.status(200).send({ status: "200", message: result });
  } catch (error) {
    res.status(200).send({ status: "500", message: error });
  }
});
app.put("/likes/:id", async (req, res) => {
  try {
    await Post.findOneAndUpdate(
      { id: req.params.id.toString() },
      { likes: req.body.likes }
    );
    res.status(200).send({ status: "200", message: "successfull" });
  } catch (error) {
    res.status(200).send({ status: "500", message: error });
  }
});
app.put("/dislikes/:id", async (req, res) => {
  try {
    await Post.findOneAndUpdate(
      { id: req.params.id.toString() },
      { dislikes: req.body.dislikes }
    );
    res.status(200).send({ status: "200", message: "successfull" });
  } catch (error) {
    res.status(200).send({ status: "500", message: error });
  }
});
app.put("/hearts/:id", async (req, res) => {
  try {
    await Post.findOneAndUpdate(
      { id: req.params.id.toString() },
      { hearts: req.body.hearts }
    );
    res.status(200).send({ status: "200", message: "successfull" });
  } catch (error) {
    res.status(200).send({ status: "500", message: error });
  }
});
app.get("/myposts/:id", async (req, res) => {
  try {
    const results = await Post.find({
      userId: req.params.id.toString(),
    }).exec();
    res.status(200).send({ status: "200", message: results });
  } catch (error) {
    res.status(200).send({ status: "500", message: error });
  }
});

app.listen(PORT, () => console.log(`server up and running at  ${PORT}`));

// https://fb-clone-backend.herokuapp.com/
