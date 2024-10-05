const { Router } = require("express");
const express = require("express");
const router = express.Router();
const User = require("../models/Userschema");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
const fetchadmin = require("../middleware/fetchadmin");

const JWT_SEACTET = "4ucsKunal";

// Route-1 : Create A User Useing: Post "/api/auth/createuser" Doesnt require ----Auth---->
router.post(
  "/signin",
  [
    // body("email", "Enter A Valid Email, Please").isEmail(),
    // body("phone", "Enter A Valid Phone, Please").isLength({
    //   min: 10
    // }),
    body("name", "Enter A Valid name, Please").isLength({
      min: 3
    }),
    body("password", "Enter A Strong Password (Min: 6 Char), Please").isLength({
      min: 6
    })
  ],
  async (req, res) => {
    const errors = validationResult(req); //If there are errors, return Bad request and the errors
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }
    try {
      let success = false;

      let idno = req.body.student.idcardno;

      // Check whethar the use with this email exists already
      let user = await User.findOne({ "student.idcardno": idno });

      if (user) {
        return res.status(400).json({
          success,

          error: "Sorry this User already exist"
        });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      // Create A New User
      user = await User.create({
        occupation: req.body.occupation,
        name: req.body.name,
        email: req.body.email,
        student: req.body.student,
        teacher: req.body.teacher,
        phone: req.body.phone,
        password: secPass
      });

      const data = {
        user: {
          id: user.id
        }
      };

      const authtoken = jwt.sign(data, JWT_SEACTET);

      success = true;
      res.json({
        success,

        authtoken
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some Error Occurd");
    }
  }
);

//Route-2 : Authenticate a user useing POST "/api/auth/login" No login requored

router.post(
  "/login",
  [
    //  body("email", "Enter A Valid Email, Please").isEmail()   //For Email Login
    body("idcardno", "Enter Your Id No, Please").exists(), //For ID mo login
    body("password", "Enter Your Password, Please").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req); //If there are errors, return Bad request and the errors
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const { email, idcardno, password } = req.body;

    try {
      let user = await User.findOne({
        "student.idcardno": idcardno
      });
      let success = false;
      if (!user) {
        return res.status(400).json({
          success,
          error: "Please try to login with correct credentials 1"
        });
      }

      const passwordComare = await bcrypt.compare(password, user.password);
      if (!passwordComare) {
        return res.status(400).json({
          success,
          error: "Please try to login with correct credentials"
        });
      }

      const payload = {
        user: {
          id: user.id
        }
      };

      const authtoken = jwt.sign(payload, JWT_SEACTET);
      success = true;
      res.json({
        success,
        authtoken
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some Error Occurd");
    }
  }
);

// Route-3 : Get Logedin User Deatails using POST "/api/auth/getuser"  login required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    userid = req.user.id;
    const user = await User.findById(userid).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error + error.message);
    res.status(500).send("Internal error");
  }
});


// Get All users
router.post("/getallusers", fetchadmin, async (req, res) => {
  try {
    // adminid = req.admin.id;
    const alluser = await User.find().select("-password");
    res.send(alluser);
  } catch (error) {
    console.error(error + error.message);
    res.status(500).send("Internal error");
  }
});
module.exports = router;
