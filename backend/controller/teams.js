const express = require("express");
const Team = require("../models/team");

exports.allTeam = async (req, res) => {
  try {
    const team = await Team.find();

    if (!team) {
      return res.status(404).send("Team Not Found");
    }

    res.status(201).send(team);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.addTeam = async (req, res) => {
  try {
    const team = await Team({
      name: req.body.name,
      description: req.body.description,
      created_at: req.body.created_at,
      updated_at: req.body.updated_at,
    }).save();

    if (!team) {
      return res.status(404).send("Team Not Found");
    }

    res.status(201).send("Team Added Success");
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.updateTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        created_at: req.body.created_at,
        updated_at: req.body.updated_at,
      },
      {
        new: true,
      }
    );

    if (!team) {
      return res.status(404).send("No Team Found");
    }

    res.status(201).send(team);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.removeTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);

    if (!team) {
      return res.status(404).send("No Team Found");
    }
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};
