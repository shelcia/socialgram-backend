const router = require("express").Router();
const Post = require("../../models/Post");

//POST RELATED API

router.get("/", async (req, res) => {
  try {
    const results = await Post.find().exec();
    res.status(200).send({ status: "200", message: results });
  } catch (error) {
    res.status(200).send({ status: "500", message: error });
  }
});

router.post("/", async (req, res) => {
  const post = new Post(req.body);
  try {
    await post.save();
    res
      .status(200)
      .send({ status: "200", message: "Successfully Created your Post" });
  } catch (error) {
    console.log(error);
    res.status(200).send({ status: "500", message: error });
  }
});

router.put("/", async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).send({ status: "200", message: "Successfull" });
  } catch (error) {
    res.status(200).send({ status: "500", message: error });
  }
});

router.delete("/", async (req, res) => {
  try {
    await Post.deleteById(req.params.id);
    res.status(200).send({ status: "200", message: "Successfull" });
  } catch (error) {
    res.status(200).send({ status: "500", message: error });
  }
});

router.put("/comments/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).exec();
    post.set(req.body);
    const result = await post.save();
    res.status(200).send({ status: "200", message: result });
  } catch (error) {
    res.status(200).send({ status: "500", message: error });
  }
});

// router.put("/likes/:id", async (req, res) => {
//   try {
//     await Post.findOneAndUpdate(
//       { id: req.params.id.toString() },
//       { likes: req.body.likes }
//     );
//     res.status(200).send({ status: "200", message: "Successfull" });
//   } catch (error) {
//     res.status(200).send({ status: "500", message: error });
//   }
// });

// router.put("/dislikes/:id", async (req, res) => {
//   try {
//     await Post.findOneAndUpdate(
//       { id: req.params.id.toString() },
//       { dislikes: req.body.dislikes }
//     );
//     res.status(200).send({ status: "200", message: "Successfull" });
//   } catch (error) {
//     res.status(200).send({ status: "500", message: error });
//   }
// });

router.put("/hearts/:id", async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, { fires: req.body.fires });
    res.status(200).send({ status: "200", message: "Successfull" });
  } catch (error) {
    res.status(200).send({ status: "500", message: error });
  }
});

router.get("/myposts/:id", async (req, res) => {
  try {
    const results = await Post.find({
      userId: req.params.id.toString(),
    }).exec();
    res.status(200).send({ status: "200", message: results });
  } catch (error) {
    res.status(200).send({ status: "500", message: error });
  }
});

module.exports = router;
