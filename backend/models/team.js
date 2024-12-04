const mongoose = require("mongoose");

const teamSchema = mongoose.Schema(
  {
    
  },
  { timestamps: true }
);

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
