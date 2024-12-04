const Member = require("../models/user");

exports.searchMember = async (req, res) => {
  try {
    const member = await Member.find({
      $or: [
        {
          username: { $regex: req.params.username },
        },
      ],
    });

    if (!member) {
      res.status(404).send("User Not Found");
    }

    res.status(201).send(member);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
