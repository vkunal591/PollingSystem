const { Router } = require("express");
const express = require("express");
const { route } = require("express/lib/router");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const User = require("../models/Userschema");


router.get("/", async (req, res) => {
  try {
    const user = await User.find();

    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server Error Occurd");
  }
});

router.post(
  "/createuser",
  // [
  //   body("name", "Enter A Valid name, Please").isLength({
  //     min: 3
  //   }),
  //   body("email", "Enter A Valid Email, Please").isEmail(),
  //   body("phone", "Enter A Valid Phone, Please").isLength({
  //     min: 10
  //   })

  // ],
  async (req, res) => { 
    try {
      const {
        occupation,
        name,
        email,
        phone,
        student,
        teacher,
        hidden
      } = req.body;
      const errors = validationResult(req); //If there are errors, return Bad request and the errors
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array()
        });
      }

      const createuser = new User({
        occupation,
        name,
        email,
        phone,
        student,
        teacher,
        hidden
      });

      const userdata = await createuser.save();
      res.json(userdata);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error Occurd");
    }
  }
);

module.exports = router;
