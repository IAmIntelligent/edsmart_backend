const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const app = express();
const multer = require("multer");
app.use("/static", express.static(path.join(__dirname, "node_modules")));
app.use('/uploads',express.static('uploads'))

const {imageGallery,navlink} = require("./models/model") 

// Set the view engine to ejs
app.set("view engine", "ejs");
// runn views folder files
app.use(express.static("views"));
// set up Json parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


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
app.get("*",(req,res)=>{
  res.status(404).send("<h1>404</h1>")
})

app.get("/api/imageGallery", async (req, res) => {
  try {
    const allData = await imageGallery.find({});

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
    const allLink = await navlink.find({});

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
    await navlink({ title, url }).save();
    console.log("saved successfully");
    res.status().redirect("/");
  } catch (error) {
    console.log("Failed to save link", error);
    res.status().redirect("/");
  }
});

// imageGallery
app.post("/api/imageGallery", upload.single("image"), async (req, res) => {
  const { description } = req.body;

  const { filename, mimetype } = req.file;
  console.log(req.file);
  console.log("description:--", description);
  try {
    await imageGallery({
      image: {
        filePath: filename,
        contentType: mimetype,
      },
      description,
    }).save();
    console.log("Image saved successfully");
    res.redirect("/");
  } catch (error) {
    console.log("Failed to save image", error);
    res.redirect("/");
  }
});

// serve the admin.html
app.get("/", (req, res) => {
  res.render("admin");
});
app.listen(3000, () => console.log("server created"));
