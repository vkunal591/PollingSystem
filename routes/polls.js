const { Router } = require("express");
const express = require("express");
const { route } = require("express/lib/router");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Polls = require("../models/Pollschema");
const Participent = require("../models/Participentschema");
const Users = require("../models/Userschema");
const fetchadmin = require("../middleware/fetchadmin");
const fetchuser = require("../middleware/fetchuser");

router.get("/getpolls", fetchadmin, async (req, res) => {
  try {
    const polls = await Polls.find({
      participent_id: `${req.header("participentid")}`
    });
    // const polls = await Polls.find({
    //   participent_id: `653fd6090bab26d41481309c`
    // });
    console.log(`${req.header("participentid")}`)
    res.json(polls);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server Error Occurd");
  }
});

// No of participent polls
router.get("/getpollno", fetchadmin, async (req, res) => {
  try {
    const polls = await Polls.find({
      poller_id: `${req.header("pollerid")}`
    });
    // const polls = await Polls.find({
    //   participent_id: `653fd6090bab26d41481309c`
    // });
    console.log(polls.length)
    res.json(polls);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server Error Occurd");
  }
});

router.post(
  "/dopoll",
  fetchuser,
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
      const { points, comments, hidden } = req.body;
      const errors = validationResult(req); //If there are errors, return Bad request and the errors
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array()
        });
      }
      let participent = await Participent.findById(`${req.header("participentid")}`);
      let user = await Users.findById(req.user.id);
      // Check whethar the use with this Poll exists already
      const u_id = user.id;
      const p_id = participent.id;
      console.log(participent.id)
      console.log(user)
      let poller = await Polls.find({ poller_id: u_id });
      let parti;
      poller.forEach(poll => {
         if ( participent.id == poll.participent_id ) {
          console.log(poll.participent_id)
          console.log("already Exist")
          return res.status(400).json({
            success,
            error: "Sorry your poll already exist"
          });
        }   
      });
      // if (poller) {
        
      //    parti = await Polls.findOne({ poller_id: poller.id });
      //   console.log(poller, "kkpoller")
      //   console.log(parti, "kkparti")
      //   console.log(participent.id)
        
        
      // }
      // let pid, paid;
      let success = false;
      // if (poller && parti) { 
        
      //    pid = poller.poller_id 
      //    paid = parti.poller_id
      // }else{
      //    pid = '0'
      //    paid = '1'
      // }
      // console.log(pid)
      // console.log(paid)

      console.log("now ok");

      const createpolls = new Polls({
        pollername: user.name,
        poller_id: user._id,
        participent_id: participent._id,
        participent_teamname: participent.teamname,
        points,
        comments,
        hidden
      });
      const pollsdata = await createpolls.save();
      success = true;
      res.status(200).json({ success: true, pollsdata });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error Occurd");
    }
  }
);

// Route-2 : Get update A existing Profile Using PUT "/api/Profile/updateProfile" login required

router.put(
  "/updatepoll/:id",
  fetchuser,
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
      let updatepollsdata = {};

      if (points) {
        updatepollsdata.points = points;
      }
      if (comments) {
        updatepollsdata.comments = comments;
      }
      if (meta) {
        updatepollsdata.meta = meta;
      }

      // Find Profile for update

      let polls = await Polls.findById(req.params.id);
      let success = false;
      if (!polls) {
        return res.status(404).send(success, "NOt Found");
      }
      console.log(polls.poller_id);
      if (polls.poller_id.toString() !== req.user.id) {
        return res.status(401).send(success, "NOt Allowed");
      }

      polls = await Polls.findByIdAndUpdate(
        req.params.id,
        {
          $set: updatepollsdata
        },
        {
          new: true
        }
      );
      success = true;
      res.json(success, polls);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error Occurd");
    }
  }
);

module.exports = router;
