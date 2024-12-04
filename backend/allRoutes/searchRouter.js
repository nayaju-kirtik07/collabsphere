const router = require("express").Router();
const api = process.env.API_URL;
const searchController = require("../controller/search");
const { authenticateToken } = require("../middleware/authMiddleware");


router.get(`${api}/searchuser/:username`,authenticateToken, searchController.searchMember);

module.exports = router;