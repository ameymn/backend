const User = require("../models/user");
const Donor = require("../models/Donor");
const Reciever = require("../models/Reciever");
const Transplant = require("../models/Transplant");
const Driver = require("../models/Driver");

module.exports.driverlogin = async (req, res, next) => {
  const { id, password } = req.body;
  const user = await Driver.find({ id: id });
  console.log(user.length);
  if (user.length != 0) {
    if (user[0].password == password) {
      const id = user[0].id;
      const name = user[0].name;
      const city = user[0].city;
      const gender = user[0].gender;
      const contact_number = user[0].contact_number;

      res.status(200).json({
        id,
        name,
        city,
        gender,
        contact_number,
        success: true,
      });
    } else {
      res.status(200).json({
        data: "Password Incorrect",
        success: false,
      });
    }
  } else {
    res.status(404).json({
      data: "Please check your Id",
      success: false,
    });
  }
};

module.exports.getDriver = async (req, res, next) => {
  const { id } = req.body;

  const filter = {
    "ambulance_dd.contact": id,
  };

  const data = await Transplant.find(filter)
    .populate("donor_hosp")
    .populate("reciever_hosp");

  const list = [];

  console.log(data);

  for (var i = 0; i < data.length; i++) {
    const d_lat = data[i].donor_hosp.ltd;
    const d_lngt = data[i].donor_hosp.lngt;
    const r_lat = data[i].reciever_hosp.ltd;
    const r_lngt = data[i].reciever_hosp.lngt;
    const t_id = data[i].transplant_id;
    const driver = data[i].ambulance_dd.name;
    const trans_end = data[i].tran_end;

    console.log(data[i].tran_end);

    var json = {
      d_lat,
      d_lngt,
      r_lat,
      r_lngt,
      t_id,
      driver,
      trans_end,
    };

    list.push(json);
  }

  res.status(200).json({
    list,
  });
};

module.exports.updateLoc = async (req, res, next) => {
  const { id, lat, lngt } = req.body;

  const filter = { transplant_id: id };

  const update = {
    last_update: Date.now(),
    lat: lat,
    lngt: lngt,
  };

  console.log(update);

  console.log("Transplant Id :-", id);

  await Transplant.findOneAndUpdate(filter, update, {
    new: true,
  });

  res.status(200).json({
    success: true,
  });
};
