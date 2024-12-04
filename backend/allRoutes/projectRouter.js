const router = require("express").Router();
const ProjectController = require("../controller/project");
const { authenticateToken } = require("../middleware/authMiddleware");

const api = process.env.API_URL;

router.post(`${api}/addproject`,authenticateToken, ProjectController.addProject);
router.get(`${api}/getallproject`,authenticateToken, ProjectController.getAllProject);
router.get(`${api}/getsingleproject/:id`,authenticateToken, ProjectController.getSingleProject);
router.get(`${api}/getprojectbyuserid/:id`,authenticateToken,ProjectController.getProjectByUserId);
router.get(`${api}/getprojectbytask/:id`,authenticateToken, ProjectController.getProjectByTask);
router.put(`${api}/updateproject/:id`,authenticateToken, ProjectController.updateProject);
router.delete(`${api}/deleteproject/:id`,authenticateToken, ProjectController.deleteProject);
router.post(`${api}/addmember/:projectId`, authenticateToken, ProjectController.addMemberToProject);
router.put(`${api}/removemember/:projectId`, authenticateToken, ProjectController.removeMemberFromProject);

module.exports = router;
