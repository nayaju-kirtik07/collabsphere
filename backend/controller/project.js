const Project = require("../models/project");
const Task = require("../models/task");
const User = require("../models/user");
const mongoose = require("mongoose");

exports.addProject = async (req, res) => {
  try {
    const project = await new Project({
      name: req.body.name,
      description: req.body.description,
      task_id: req.body.task_id,
      member_id: req.body.member_id,
      dueDate: req.body.dueDate,
      admin: req.body.admin,
    }).save();

    if (!project) {
      return res.status(404).send("Invalid Inputs");
    }

    res.status(201).send(project);
  } catch (err) {
    res.status(500).json({ error: err, success: false });
  }
};

exports.getAllProject = async (req, res) => {
  try {
    const project = await Project.find()
      .populate("member_id")
      .populate("task_id");

    if (!project) {
      return res.status(404).send("Project Not Found");
    }

    res.status(201).send(project);
  } catch (err) {
    res.status(500).json({ error: err, success: false });
  }
};

exports.getSingleProject = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).send("Invalid Id");
    }
    const project = await Project.findById(id)
      .populate("member_id")
      .populate("task_id");

    if (!project) {
      return res.status(404).send("Project Not Found");
    }

    res.status(201).send(project);
  } catch (err) {
    res.status(500).json({ error: err, success: false });
  }
};

exports.getProjectByUserId = async (req, res) => {
  try {
    const user_id = await User.findById(req.params.id);
    // if (!mongoose.Types.ObjectId.isValid(user_id)) {
    //   return res.status(400).send("Invalid User");
    // }

    const projects = await Project.find({ member_id: { $in: [req.params.id] } })
      .populate("task_id")
      .populate("member_id");

    if (!projects) {
      return res.status(404).send("Project Not Found");
    }

    res.status(201).send(projects);
  } catch (err) {
    return res.status(500).json({ error: err, success: false });
  }
};

exports.getProjectByTask = async (req, res) => {
  try {
    const task_id = await Task.findById(req.params.id);

    if (!mongoose.Types.ObjectId.isValid(task_id)) {
      return res.status(400).send("Invalid Task Id");
    }

    const allProject = await Project.find();

    const project = allProject
      .filter((element) =>
        element.task_id.some((task) => task.id == req.params.id)
      )
      .populate("task_id")
      .populate("member_id");

    if (!project) {
      return res.status(404).send("Project Not Found");
    }
  } catch (err) {}
};

exports.updateProject = async (req, res) => {
  try {
    const { name, description, task_id, member_id, dueDate, admin } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid Project ID");
    }

    // Create update object based on what's provided
    const updateObj = {};
    if (name !== undefined) updateObj.name = name;
    if (description !== undefined) updateObj.description = description;
    if (dueDate !== undefined) updateObj.dueDate = dueDate;
    if (admin !== undefined) updateObj.admin = admin;

    // Only handle arrays if they're provided
    if (Array.isArray(task_id)) {
      updateObj.task_id = task_id;
    }
    if (Array.isArray(member_id)) {
      updateObj.member_id = member_id;
    }

    const project = await Project.findByIdAndUpdate(req.params.id, updateObj, {
      new: true,
    })
      .populate("member_id")
      .populate("task_id");

    if (!project) {
      return res.status(404).send("Project Not Found");
    }

    res.status(200).send(project);
  } catch (err) {
    res.status(500).json({ error: err.message, success: false });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).send("Project Not Found");
    }

    const deletedProject = await Project.findByIdAndDelete(req.params.id);

    const deletedTask = await Task.deleteMany({ project_id: req.params.id });

    res.status(201).send(deletedProject);
  } catch (err) {}
};

exports.removeMemberFromProject = async (req, res) => {
  try {
    const { member_id } = req.body;
    const projectId = req.params.projectId;

    if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(member_id)) {
      return res.status(400).send("Invalid Project ID or Member ID");
    }

    const project = await Project.findByIdAndUpdate(
      projectId,
      { $pull: { member_id: member_id } }, // Use $pull to remove the member ID from the array
      { new: true }
    ).populate("member_id").populate("task_id");

    if (!project) {
      return res.status(404).send("Project Not Found");
    }

    res.status(200).send(project);
  } catch (err) {
    res.status(500).json({ error: err.message, success: false });
  }
};

exports.addMemberToProject = async (req, res) => {
  try {
    const { userId } = req.body;
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send("Invalid Project ID or User ID");
    }

    const project = await Project.findByIdAndUpdate(
      projectId,
      { $addToSet: { member_id: userId } }, // Use $addToSet to avoid duplicates
      { new: true }
    ).populate("member_id");

    if (!project) {
      return res.status(404).send("Project Not Found");
    }

    res.status(200).send(project);
  } catch (err) {
    res.status(500).json({ error: err.message, success: false });
  }
};
