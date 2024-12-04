const router = require("express").Router();
const TaksController = require("../controller/task");
const { authenticateToken } = require("../middleware/authMiddleware");
const api = process.env.API_URL;

router.post(`${api}/addtask`,authenticateToken, TaksController.addTask);
router.get(`${api}/getalltask`,authenticateToken,  TaksController.getAllTask);
router.put(`${api}/updatetask/:id`,authenticateToken, TaksController.updatedTask);
router.get(`${api}/getsingletask/:id`,authenticateToken, TaksController.getSingleTask);
router.get(`${api}/gettaskbyuserid/:member_id`,authenticateToken, TaksController.getTaskByUserId);
router.delete(`${api}/deletetask/:id`,authenticateToken, TaksController.deleteTask);
router.get(`${api}/gettaskbyprojectid/:id`,authenticateToken, TaksController.getTaskByProjectId);

module.exports = router;
