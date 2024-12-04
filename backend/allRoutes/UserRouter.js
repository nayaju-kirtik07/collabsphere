const UserController = require("../controller/users");
const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const fileUpload = require("express-fileupload");

const router = express.Router();
const api = process.env.API_URL;
router.use(fileUpload());

router.post(`${api}/signup`, UserController.singUp);
router.post(`${api}/login`, UserController.login);
router.get(`${api}/users`, authenticateToken, UserController.getAllUsers);
router.post(
  `${api}/uploadImage`,
  authenticateToken,
  UserController.editProfile
);
router.get(
  `${api}/getMyProfile`,
  authenticateToken,
  UserController.getMyProfile
);
// router.get(`${api}/users/connected/:userId`, authenticateToken, UserController.getConnectedUsers);
router.get(
  `${api}/users/:userId/connections`,
  authenticateToken,
  UserController.getUserWithConnections
);
router.post(
  `${api}/users/:userId/connect`,
  authenticateToken,
  UserController.addConnection
);
// router.delete(`${api}/logOut`, authenticateToken, UserController.logOut);
router.get(`${api}/user/:userId`, authenticateToken, UserController.getUserById);
router.put(`${api}/updateProfile`, authenticateToken, UserController.updateProfile);
router.put(`${api}/updatePassword`, authenticateToken, UserController.updatePassword);

module.exports = router;
