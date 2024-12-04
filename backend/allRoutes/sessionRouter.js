const router = require("express").Router();
const Session = require("../models/session");
const api = process.env.API_URL;


router.get(`${api}/getsession`, async (req, res) => {
  try {
    const session = await Session.find();

    if (!session) {
      return res.status(404).send("Session Not Found");
    }

    res.status(201).send(session);
  } catch (err) {
    res.json({
      errror: err,
      success: false,
    });
  }
});

module.exports = router;
