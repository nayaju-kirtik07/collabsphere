const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    member_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      required: true,
    },
    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      // required: true,
    },
  },
  { timestamps: true }
);

// taskSchema.virtual("slug").get(function () {
//   return this._id.toHexString();
// });

// taskSchema.set("toJSON", {
//   virtuals: true,
// });

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
