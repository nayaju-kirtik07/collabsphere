const Project = require("../models/project");
const Task = require("../models/task");
const User = require("../models/user");
const mongoose = require("mongoose");

exports.addTask = async (req, res) => {
  try {
    const { name, description, member_id, status, project_id } = req.body;
    const memberId = await User.findById(req.body.member_id);
    if (!mongoose.Types.ObjectId.isValid(memberId)) {
      return res.status(400).send("Invalid user Id");
    }

    const task = await new Task({
      name: name,
      description: description,
      member_id: member_id,
      status: status,
      project_id: project_id,
    }).save();

    const project = await Project.findByIdAndUpdate(
      project_id,
      {
        $push: { task_id: task?._id },
      },
      {
        new: true,
      }
    );

    console.log(project);
    res.status(201).send(task);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getTaskByProjectId = async (req, res) => {
  const project_id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(project_id)) {
    return res.status(400).send("Invalid Project Id");
  }

  const task = await Task.find({ project_id: project_id }).exec();

  if (!task) {
    return res.status(404).send("Task Not Found");
  }
  console.log("response :", task);

  res.status(201).send(task);
};

exports.getSingleTask = async (req, res) => {
  try {
    // if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    //    return res.status(400).send("Invalid Id");
    // }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).send("Task Not Found");
    }

    res.status(201).send(task);
  } catch (err) {
    res.status(500).json({
      error: err,
      sucess: false,
    });
  }
};

exports.getTaskByUserId = async (req, res) => {
  // const { page = 1, limit = 5 } = req.params;

  try {
    const member_id = await User.findById(req.params.member_id);
    if (!mongoose.Types.ObjectId.isValid(member_id)) {
      return res.status(400).send("Invalid User Id");
    }

    // const skip = page == 1 ? 0 : page - 1 * limit;

    // const totalPage = Math.ceil(Task.count() % limit);

    // if (page > totalPage) {
    //   return res.send("Page not found");
    // }

    const task = await Task.find({ member_id: req.params.member_id })
      // .skip(skip)
      // .limit(limit)
      .populate("member_id")
      .populate("project_id");

    // const task = allTask.filter((element) =>
    //   element.member_id.some((member) => member._id == req.params.member_id)
    // );

    if (!task) {
      return res.status(404).send("Task Not Found");
    }

    res.status(201).send(task);
  } catch (err) {
    res.status(500).json({ error: err, success: false });
  }
};

exports.getAllTask = async (req, res) => {
  console.log(req.user);
  try {
    const task = await Task.find().populate("member_id").populate("project_id");

    if (!task) {
      return res.status(404).send("Task Not Found");
    }

    res.status(201).send(task);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.updatedTask = async (req, res) => {
  try {
    // const member_id = await User.findById(req.body.member_id);
    // if (!mongoose.Types.ObjectId.isValid(member_id)) {
    //   return res.status(400).send("Invalid user Id");
    // }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        member_id: req.body.member_id,
        status: req.body.status,
      },
      {
        new: true,
      }
    );

    if (!task) {
      return res.status(404).send("Task Not Found");
    }

    res.status(201).send(task);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).send("Invalid Task Id");
    }
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).send("Task Not Found");
    }

    res.status(201).send("Delete Success");
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};
