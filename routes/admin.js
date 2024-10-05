const { Router } = require("express");
const express = require("express");
const router = express.Router();
const Admin = require("../models/Adminschema");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchadmin = require("../middleware/fetchadmin");

const JWT_SEACTET = "4ucsKunal";

// Route-1 : Create A User Useing: Post "/api/auth/createuser" Doesnt require ----Auth---->
router.post(
  "/createadmin",
  [
    body("email", "Enter A Valid Email, Please").isEmail(),
    body("phone", "Enter A Valid Phone, Please").isLength({
      min: 10
    }),
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
      // Check whethar the use with this email exists already
      let admin = await Admin.findOne({
        email: req.body.email
      });
      let success = false;
      if (admin) {
        return res.status(400).json({
          success,
          error: "Sorry this User already exist"
        });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      // Create A New User
      admin = await Admin.create({
        occupation: req.body.occupation,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: secPass
      });

      const data = {
        admin: {
          id: admin.id
        }
      };

      const authtoken = jwt.sign(data, JWT_SEACTET);

      success = ture;
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
  "/loginadmin",
  [
    body("email", "Enter A Valid Email, Please").isEmail(),
    body("password", "Enter Your Password, Please").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req); //If there are errors, return Bad request and the errors
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    try {
      let admin = await Admin.findOne({
        email
      });
      let success = false;
      if (!admin) {
        return res.status(400).json({
          success,
          error: "Please try to login with correct credentials"
        });
      }

      const passwordComare = await bcrypt.compare(password, admin.password);
      if (!passwordComare) {
        return res.status(400).json({
          success,
          error: "Please try to login with correct credentials"
        });
      }

      const payload = {
        admin: {
          id: admin.id
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
router.post("/getadmin", fetchadmin, async (req, res) => {
  try {
    adminid = req.admin.id;
    const admin = await Admin.findById(adminid).select("-password");
    res.send(admin);
  } catch (error) {
    console.error(error + error.message);
    res.status(500).send("Internal error");
  }
});

// Route-3 : Get Logedin User Deatails using POST "/api/auth/getuser"  login required
router.post("/getalluser", fetchadmin, async (req, res) => {
  try {
    // adminid = req.admin.id;
    const admin = await User.find().select("-password");
    res.send(admin);
  } catch (error) {
    console.error(error + error.message);
    res.status(500).send("Internal error");
  }
});

module.exports = router;
