const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const app = express();
const multer = require("multer");
app.use("/static", express.static(path.join(__dirname, "node_modules")));

// Set the view engine to ejs
app.set("view engine", "ejs");
// runn views folder files
app.use(express.static("views"));
// set up Json parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// This middleware will be revolked for the all requests that contain file-upload
// app.use(uplaod());

// connect to DB
mongoose
  .connect(
    "mongodb+srv://simplefight90:Bstech123@cluster0.shioe4w.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((e) => console.log("mongodb connected"))
  .catch((err) => console.log("Mongodb not connected", err));

// multer configaration
const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
// create Schema
const LinkSchema = new mongoose.Schema({
  title: String,
  url: String,
});
const imageSchema = new mongoose.Schema({
  image: {
    filePath: String,
    contentType: String,
    // required: true
  },
  description: {
    type: String,
    // required: true
  },
});
const link = mongoose.model("Link", LinkSchema);
const ImageGallery = mongoose.model("ImageSchema", imageSchema);

app.get("/api/imageGallery", async (req, res) => {
  try {
    const allData = await ImageGallery.find({});

    // const contentType =
    //   allData.length > 0 ? allData.forEach((image) => image.contentType) : "";
    // res.set("Content-Type", contentType);

    // console.log(allData.map((image) => image.contentType));
    allData?.map((item) => console.log(item));
    res.send({
      status: "ok",
      data: allData.map((image) => ({
        url: `uploads/${image.image.filePath}`,
        description: image.description,
      })),
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Invalid Server Error");
  }
});

// get navlinks
app.get("/api/navlinks", async (req, res) => {
  try {
    const allLink = await link.find({});

    // const contentType =
    //   link > 0 ? (allLink.forEach((link) => link.contentType) ): "";
    // res.set("Content-Type", contentType);
    // console.log(allLink.map((link) => link.contentType));

    res.send({ status: "OK", data: allLink });
  } catch (err) {
    console.log(err);
  }
});

// navlinks
app.post("/api/navlinks", async (req, res) => {
  const { title, url } = req.body;
  console.log(title, url);
  try {
    await link({ title, url }).save();
    console.log("saved successfully");
    // res.redirect("/success")
    // res.status(200).json({ success: true, message: "Header link created successfully" })
    res.status().redirect("/");
  } catch (error) {
    console.log("Failed to save link", error);
    // res.redirect("/Failed")
    // res.status(400).json({ success: false, message: "Header created Not successfully" })
    res.status().redirect("/");
  }
});

// imageGallery
app.post("/api/imageGallery", upload.single("image"), async (req, res) => {
  // if (req.files) {
  const { description } = req.body;
  // const imageFile = req.files.image.data; // Assuming you have a file upload field named 'image' in your form
  // const imageName = req.files.image.name;

  // console.log("files", req.files.image);
  // console.log("body", req.body);
  const { filename, mimetype } = req.file;
  console.log(req.file);
  console.log("description:--", description);
  try {
    await ImageGallery({
      image: {
        filePath: filename,
        contentType: mimetype,
        // filename: imageName,
      },
      description,
    }).save();
    console.log("Image saved successfully");
    res.redirect("/");
  } catch (error) {
    console.log("Failed to save image", error);
    res.redirect("/");
  }
  // } else {
  // console.log("No files found");
  // }
});

// serve the admin.html
app.get("/", (req, res) => {
  res.render("admin");
});
app.listen(3000, () => console.log("server created"));
