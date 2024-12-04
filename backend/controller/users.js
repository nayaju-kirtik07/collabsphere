const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Session = require("../models/session");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dwdwxd0qj",
  api_key: "189498858792856",
  api_secret: "ORXExbWIg1bHJqefwtTM1SISvLM",
  secure: true,
});

const Access_token = process.env.AccessToken;
const Refresh_token = process.env.RefreshToken;

exports.getAllUsers = async (req, res) => {
  const user = await User.find().select("-hashPassword -c_hashPassword");

  if (!user) {
    return res.status(400).send("User Not Found");
  }
  console.log("users are",user)

  res.status(201).send(user);
};

exports.singUp = async (req, res) => {
  try {
    if (req.body.password !== req.body.c_password) {
      return res.status(500).send("Password and Confirm password must be same");
    }
    const user = await new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      email: req.body.email,
      hashPassword: bcrypt.hashSync(req.body.password, 10),
      c_hashPassword: bcrypt.hashSync(req.body.c_password, 10),
    }).save();

    if (!user) {
      return res.status(400).send("Invalid Inputs");
    }

    res.status(201).send(user);
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const refresh_token_expiration = "1d";
    const access_token_expiration = "30d";

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).send("User Not Found");
    }

    if (user && bcrypt.compareSync(req.body.password, user.hashPassword)) {
      const access_token = jwt.sign(
        {
          userId: user.id,
        },
        Access_token,
        {
          expiresIn: access_token_expiration,
        }
      );

      const refreshToken = jwt.sign(
        {
          user: user.id,
        },
        Refresh_token,
        {
          expiresIn: refresh_token_expiration,
        }
      );

      req.session.userId = user.id;
      req.session.username = user.username;

      await new Session({
        userId: user.id,
        email: user.email,
        Access_Token: access_token,
        Refresh_Token: refreshToken,
        ExpiresIn: refresh_token_expiration,
      }).save();

      console.log(user?.profileImage);

      res.status(201).send({
        userId: user.id,
        user: user.username,
        refresh_token: refreshToken,
        ExpiresIn: refresh_token_expiration,
        profileImage: user?.profileImage,
      });
    } else {
      res.status(500).send("Wrong Password");
    }
  } catch (err) {
    res.status(500).json({
      error: err,
      success: false,
    });
  }
};

exports.editProfile = async (req, res) => {
  const user = req.user;

  if (!req.files || !req.files.image) {
    return res.status(400).send("No image file uploaded.");
  }

  const imageFile = req.files.image;
  console.log(imageFile);

  try {
    // Upload the file buffer to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream((error, result) => {
        if (error) reject(error);
        resolve(result);
      });

      stream.end(imageFile.data);
    });

    const userData = await User.findByIdAndUpdate(
      user?.user,
      {
        profileImage: uploadResult?.url,
      },
      { new: true }
    );

    userData;

    res.json({ message: "Image uploaded successfully", userData });
  } catch (error) {
    console.error(error);
    res.status(500).send("Image upload failed.");
  }
};

exports.getMyProfile = async (req, res) => {
  const user = req?.user;

  const myProfile = await User.findOne({ _id: user?.user });

  if (!myProfile) return res.status(404).send("Profile Not Found");

  res.status(201).send(myProfile);
};

// exports.logOut = async (req, res) => {
//   try {
//     const id = req.user?.user;
//     const session = await Session.findByIdAndDelete(id);

//     if (!session) {
//       res.status(404).send("Session Not Found");
//     }

//     res.status(201).send(session);
//   } catch (err) {
//     console.error(err?.message);
//   }
// };

// exports.getConnectedUsers = async (req, res) => {
//   try {
//     const userId = req.params.userId;

//     // Assuming you have a User model with a 'connections' field
//     const user = await User.findById(userId).populate("connections");

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const connectedUsers = user.connections.map((connection) => ({
//       _id: connection._id,
//       username: connection.username,
//       profileImage: connection.profileImage,
//     }));

//     res.status(200).json(connectedUsers);
//   } catch (error) {
//     console.error("Error fetching connected users:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

exports.addConnection = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const connectionUser = await User.findById(req.body.connectionId);

    if (!user || !connectionUser) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.addConnection(connectionUser._id);
    
    res.status(200).json({ message: "Connection added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding connection", error: error.message });
  }
};

// Function to get user with populated connections
exports.getUserWithConnections = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('connections');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).select("-hashPassword -c_hashPassword");

    if (!user) {
      return res.status(404).send("User Not Found");
    }

    res.status(200).send(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { username, firstName, lastName } = req.body;
    const userId = req.user.user;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username,
        first_name: firstName,
        last_name: lastName
      },
      { new: true }
    ).select('-hashPassword -c_hashPassword');

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.user;

    const user = await User.findById(userId);
    
    if (!user || !bcrypt.compareSync(currentPassword, user.hashPassword)) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.hashPassword = bcrypt.hashSync(newPassword, 10);
    user.c_hashPassword = bcrypt.hashSync(newPassword, 10);
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
