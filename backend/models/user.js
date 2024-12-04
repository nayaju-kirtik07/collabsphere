const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    hashPassword: {
      type: String,
      required: true,
    },
    c_hashPassword: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
    },
    connections: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

userSchema.methods.addConnection = function(userId) {
  if (this.connections.indexOf(userId) === -1) {
    this.connections.push(userId);
  }
  return this.save();
};

// userSchema.virtual("slug").get(function () {
//   return this._id.toHexString();
// });

// userSchema.set("toJSON", {
//   virtuals: true,
// });

const User = mongoose.model("User", userSchema);

module.exports = User;
