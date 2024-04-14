if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const session = require("express-session");
const cors = require("cors");
const MongoStore = require("connect-mongo");
const User = require("./models/user");
const userRoutes = require("./route/user");
const path = require("path");
const adminRoutes = require("./route/admin");
const doctorRoutes = require("./route/doctor");
const livingRoutes = require("./route/living");
const driverRoutes = require("./route/drivers");
const viewPath = path.resolve(__dirname, "./templates/views/");
const engine = require("ejs-mate");

app.engine("ejs", engine);
app.set("views", path.join(__dirname, "views"));
app.use(cors());
app.use(express.static(__dirname + "/public"));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

app.get('/',(req,res)=>{
  res.send("welcome");
});
app.post('/api/location', (req, res) => {
  const { latitude, longitude } = req.body;
  console.log('Received location:', { latitude, longitude });
  // Here you can process the received location data as needed
  res.status(200).json({ message: 'Location received successfully' });
});

const dbUrl = "mongodb+srv://Shreyas1702:Shreyas1702@cluster0.srr2fxy.mongodb.net/test";
const secret = process.env.SECRET || "thisshouldbeabettersecret";

const store = new MongoStore({
  mongoUrl: dbUrl,
  secret,
  touchAfter: 24 * 60 * 60,
});

const sessionConfig = {
  store,
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  //   res.locals.error = req.flash("error");
  //   res.locals.success = req.flash("success");

  next();
});

app.use("/", userRoutes);

app.use("/admin", adminRoutes);

app.use("/doctor", doctorRoutes);

app.use("/living", livingRoutes);

app.use("/driver", driverRoutes);

module.exports = app;
