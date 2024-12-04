const mongoose = require("mongoose");

const projectSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    task_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    member_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dueDate: {
      type: Date,
      // required: true,
    },
    admin: {
      type: Boolean,
    },
  },

  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
