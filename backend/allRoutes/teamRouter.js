const TeamController = require("../controller/teams");
const express = require('express');
const api = process.env.API_URL;
const {authenticateToken} = require("../middleware/authMiddleware")


const router = express.Router();

router.get(`${api}/allteam`, authenticateToken , TeamController.allTeam);
router.post(`${api}/addteam`, authenticateToken, TeamController.addTeam);
router.put(`${api}/updateteam`, authenticateToken, TeamController.updateTeam);
router.post(`${api}/deleteteam`, authenticateToken, TeamController.removeTeam);

module.exports =router;



