const router = require("express").Router();
const Post = require("../../models/Post");
const User = require("../../models/User");

router.get("/:id", async (req, res) => {
  try {
    const results = await User.findById(req.params.id).exec();
    res.status(200).send({ status: "200", message: results });
  } catch (error) {
    res.status(200).send({ status: "500", message: error });
  }
});

router.get("/username/:id", async (req, res) => {
  try {
    const results = await User.findById(req.params.id).select({
      fname: 1,
      lname: 1,
      _id: 1,
    });
    res.status(200).send({ status: "200", message: results });
  } catch (error) {
    res.status(200).send({ status: "500", message: error });
  }
});

router.get("/userId", async (req, res) => {
  try {
    const results = await User.find({}).select({ fname: 1, _id: 1 });
    res.status(200).send({ status: "200", message: results });
  } catch (error) {
    res.status(200).send({ status: "500", message: error });
  }
});

router.put("/:id", async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, {
      ...req.body,
      avatar: req.body.avatar,
    });
    // console.log(req.body);
    res
      .status(200)
      .send({ status: "200", message: "Successfully Edited your profile" });
  } catch (error) {
    res.status(200).send({ status: "500", message: error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Post.deleteMany({
      ownerId: req.params.id,
    });
    await User.findByIdAndDelete(req.params.id);
    res.status(200).send({
      status: "200",
      message: "Your account has been successfully deleted.",
    });
  } catch (error) {
    res.status(200).send({ status: "500", message: error });
  }
});

module.exports = router;
