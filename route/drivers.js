const express = require("express");
const router = express.Router();
const driver = require("./../controller/driver");

router.route("/driverlog").post(driver.driverlogin);
router.route("/getDriver").post(driver.getDriver);
router.route("/updateLoc").post(driver.updateLoc);
module.exports = router;
