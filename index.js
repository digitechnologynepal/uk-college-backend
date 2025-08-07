const express = require("express");
const path = require("path");
const cors = require("cors");
const moment = require("moment-timezone");
const dotenv = require("dotenv");
const connectDB = require("./database/db");
const morgan = require("morgan");

moment.tz.setDefault("Asia/Kathmandu");

const app = express();
app.use(morgan("dev"));

dotenv.config();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const corsPolicy = {
  origin: true,
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsPolicy));

app.use("/uploads", (req, res, next) => {
  express.static(path.resolve(__dirname, "uploads"))(req, res, next);
});

connectDB();

const port = process.env.PORT;
app.use('/images', express.static('public/images'));

// authentication
app.use("/api/auth", require("./routes/admin/authenticationRoutes"));

// admin routes for banner 
app.use("/api/admin/banner", require("./routes/admin/bannerRoutes"));

// admin route for our team
app.use("/api/admin/team", require("./routes/admin/teamRoutes"));

// admin routes for institution profile
app.use("/api/admin/institutionprofile", require("./routes/admin/institutionProfileRoutes"));

// admin routes for about us
app.use("/api/admin/aboutus", require("./routes/admin/aboutUsRoutes"));

// admin routes for motto
app.use("/api/admin/motto", require("./routes/admin/mottoRoutes"));

// contact route
app.use("/api/contact", require("./routes/admin/contactRoutes"));

// admin routes for course
app.use("/api/admin/course", require("./routes/admin/courseRoutes"));

// admin routes for why choose us
app.use("/api/admin/whychooseus", require("./routes/admin/whyChooseUsRoutes"));

// admin routes for clients
app.use("/api/admin/clients", require("./routes/admin/clientRoutes"));

// admin route for gallery content 
app.use("/api/admin/galleryContent", require("./routes/admin/galleryContentRoutes"));

// admin routes for news
app.use("/api/admin/news", require("./routes/admin/newsRoutes"))

// admin routes for group
app.use("/api/admin/group", require("./routes/admin/groupRoutes"))

// upload image route
app.use("/api/upload", require("./routes/uploadRoutes"));

app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});

module.exports = app;

