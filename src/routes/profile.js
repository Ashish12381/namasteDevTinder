const express = require("express");
const profileRouter = express.Router();
const { validateProfileEdit, validatePassword } = require("../utils/validate");
const bcrypt = require("bcrypt");
const upload = require("../middleware/upload");
const uploadToS3 = require("../utils/uploadToS3");

const { userAuth } = require("../middleware/auth");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Not able to authenticate" + err.message);
  }
});
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    validateProfileEdit(req.body);
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName} your prfile has edited successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});
profileRouter.patch(
  "/profile/photo",
  userAuth,
  upload.single("photo"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "Please upload an image.",
        });
      }

      const imageUrl = await uploadToS3(req.file);

      req.user.photoUrl = imageUrl;
      await req.user.save();

      res.status(200).json({
        message: "Profile photo updated successfully.",
        data: req.user,
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        message: "Failed to upload image.",
        error: err.message,
      });
    }
  },
);

// Change password endpoint
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  console.log(req.body);
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .send("currentPassword and newPassword are required");
    }
    const user = req.user;
    const isCurrentValid = await user.ValidatePassword(currentPassword);
    if (!isCurrentValid) {
      return res.status(400).send("Current password is incorrect");
    }
    // validate new password strength
    validatePassword(newPassword);
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();
    res.send("Password changed successfully");
  } catch (err) {
    res.status(400).send("Error changing password: " + err.message);
  }
});
module.exports = profileRouter;
