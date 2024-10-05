const { Router } = require("express");
const express = require("express");
const { route } = require("express/lib/router");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Participent = require("../models/Participentschema");
const fetchadmin = require("../middleware/fetchadmin");
const fetchuser = require("../middleware/fetchuser");

router.get("/getparticipents", fetchadmin || fetchuser, async (req, res) => {
  try {
    const participent = await Participent.find();

    res.json(participent);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server Error Occurd");
  }
});

router.post(
  "/createparticipent",
  fetchadmin,
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
      const { category, teamname, teamleader, content, hidden } = req.body;
      const errors = validationResult(req); //If there are errors, return Bad request and the errors
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array()
        });
      }

      const createparticipent = new Participent({
        admin: req.admin.id,
        category,
        teamname,
        teamleader,
        content,
        hidden
      });

      const participentdata = await createparticipent.save();
      res.json(participentdata);
    } catch (error) {
      // console.error(error.message);
      res.status(500).send("Internal Server Error Occurd");
    }
  }
);

// Route-2 : Get update A existing Profile Using PUT "/api/Profile/updateProfile" login required

router.delete(
  "/deleteparticipent",
  fetchadmin,
  //  [
  //     body("name", "Enter A Valid name, Please").isLength({
  //         min: 3
  //     }),
  //     body("email", "Enter A Valid Email, Please").isEmail(),
  //     body("phone", "Enter A Valid Phone, Please").isLength({
  //         min: 10
  //     }),
  //     body("subject", "Enter Subject (Min: 3 Char), Please").isLength({
  //         min: 3
  //     }),
  //     body("details", "Enter Details (Min: 10 Char), Please").isLength({
  //         min: 10
  //     })

  // ],

  async (req, res) => {
    try {
      const { points, comments, meta } = req.body;

      // Create a New Profile Object
      let updateparticipentdata = {};

      if (points) {
        updateparticipentdata.points = points;
      }
      if (comments) {
        updateparticipentdata.comments = comments;
      }
      if (meta) {
        updateparticipentdata.meta = meta;
      }

      // Find Profile for update

      let participent = await Participent.findById(req.header("participentid"));

      if (!participent) {
        return res.status(404).send("NOt Found");
      }

      // if (Participent.user.toString() !== req.user.id) {
      //     return res.status(401).send('NOt Allowed');
      // }

      participent = await Participent.findByIdAndDelete(
        req.header("participentid")
      );
      res.json(participent);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error Occurd");
    }
  }
);

//
router.put(
  "/startpoll",
  fetchadmin,
  //  [
  //     body("name", "Enter A Valid name, Please").isLength({
  //         min: 3
  //     }),
  //     body("email", "Enter A Valid Email, Please").isEmail(),
  //     body("phone", "Enter A Valid Phone, Please").isLength({
  //         min: 10
  //     }),
  //     body("subject", "Enter Subject (Min: 3 Char), Please").isLength({
  //         min: 3
  //     }),
  //     body("details", "Enter Details (Min: 10 Char), Please").isLength({
  //         min: 10
  //     })

  // ],

  async (req, res) => {
    try {
      const { hidden, points, comments, rank } = req.body;
      console.log(comments, hidden);
      // Create a New Profile Object
      let updateparticipentdata = {};

      if (hidden) {
        updateparticipentdata.hidden = hidden;
      }
      if (points) {
        updateparticipentdata.points = points;
      }
      if (comments) {
        updateparticipentdata.comments = comments;
      }
      if (rank) {
        updateparticipentdata.rank = rank;
      }

      // Find Profile for update

      let participent = await Participent.findById(req.header("participentid"));

      if (!participent) {
        return res.status(404).send("NOt Found");
      }

      // if (Participent.user.toString() !== req.user.id) {
      //     return res.status(401).send('NOt Allowed');
      // }

      participent = await Participent.findByIdAndUpdate(
        req.header("participentid"),
        {
          $set: updateparticipentdata
        },
        {
          new: true
        }
      );
      res.json(participent);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error Occurd");
    }
  }
);

module.exports = router;
