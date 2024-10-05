"use strict";

var _require = require("express"),
    Router = _require.Router;

var express = require("express");

var _require2 = require("express/lib/router"),
    route = _require2.route;

var router = express.Router();

var _require3 = require("express-validator"),
    body = _require3.body,
    validationResult = _require3.validationResult;

var Polls = require("../models/Pollschema");

var Participent = require("../models/Participentschema");

var Users = require("../models/Userschema");

var fetchadmin = require("../middleware/fetchadmin");

var fetchuser = require("../middleware/fetchuser");

router.get("/getpolls", fetchadmin, function _callee(req, res) {
  var polls;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(Polls.find({
            participent_id: "".concat(req.header("participentid"))
          }));

        case 3:
          polls = _context.sent;
          // const polls = await Polls.find({
          //   participent_id: `653fd6090bab26d41481309c`
          // });
          console.log("".concat(req.header("participentid")));
          res.json(polls);
          _context.next = 12;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0.message);
          res.status(500).send("Internal server Error Occurd");

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
}); // No of participent polls

router.get("/getpollno", fetchadmin, function _callee2(req, res) {
  var polls;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(Polls.find({
            poller_id: "".concat(req.header("pollerid"))
          }));

        case 3:
          polls = _context2.sent;
          // const polls = await Polls.find({
          //   participent_id: `653fd6090bab26d41481309c`
          // });
          console.log(polls.length);
          res.json(polls);
          _context2.next = 12;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0.message);
          res.status(500).send("Internal server Error Occurd");

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 8]]);
});
router.post("/dopoll", fetchuser, // [
//   body("name", "Enter A Valid name, Please").isLength({
//     min: 3
//   }),
//   body("email", "Enter A Valid Email, Please").isEmail(),
//   body("phone", "Enter A Valid Phone, Please").isLength({
//     min: 10
//   })
// ],
function _callee3(req, res) {
  var _req$body, points, comments, hidden, errors, participent, user, u_id, p_id, poller, parti, success, createpolls, pollsdata;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _req$body = req.body, points = _req$body.points, comments = _req$body.comments, hidden = _req$body.hidden;
          errors = validationResult(req); //If there are errors, return Bad request and the errors

          if (errors.isEmpty()) {
            _context3.next = 5;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            errors: errors.array()
          }));

        case 5:
          _context3.next = 7;
          return regeneratorRuntime.awrap(Participent.findById("".concat(req.header("participentid"))));

        case 7:
          participent = _context3.sent;
          _context3.next = 10;
          return regeneratorRuntime.awrap(Users.findById(req.user.id));

        case 10:
          user = _context3.sent;
          // Check whethar the use with this Poll exists already
          u_id = user.id;
          p_id = participent.id;
          console.log(participent.id);
          console.log(user);
          _context3.next = 17;
          return regeneratorRuntime.awrap(Polls.find({
            poller_id: u_id
          }));

        case 17:
          poller = _context3.sent;
          poller.forEach(function (poll) {
            if (participent.id == poll.participent_id) {
              console.log(poll.participent_id);
              console.log("already Exist");
              return res.status(400).json({
                success: success,
                error: "Sorry your poll already exist"
              });
            }
          }); // if (poller) {
          //    parti = await Polls.findOne({ poller_id: poller.id });
          //   console.log(poller, "kkpoller")
          //   console.log(parti, "kkparti")
          //   console.log(participent.id)
          // }
          // let pid, paid;

          success = false; // if (poller && parti) { 
          //    pid = poller.poller_id 
          //    paid = parti.poller_id
          // }else{
          //    pid = '0'
          //    paid = '1'
          // }
          // console.log(pid)
          // console.log(paid)

          console.log("now ok");
          createpolls = new Polls({
            pollername: user.name,
            poller_id: user._id,
            participent_id: participent._id,
            participent_teamname: participent.teamname,
            points: points,
            comments: comments,
            hidden: hidden
          });
          _context3.next = 24;
          return regeneratorRuntime.awrap(createpolls.save());

        case 24:
          pollsdata = _context3.sent;
          success = true;
          res.status(200).json({
            success: true,
            pollsdata: pollsdata
          });
          _context3.next = 33;
          break;

        case 29:
          _context3.prev = 29;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0.message);
          res.status(500).send("Internal Server Error Occurd");

        case 33:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 29]]);
}); // Route-2 : Get update A existing Profile Using PUT "/api/Profile/updateProfile" login required

router.put("/updatepoll/:id", fetchuser, //  [
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
function _callee4(req, res) {
  var _req$body2, points, comments, meta, updatepollsdata, polls, success;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _req$body2 = req.body, points = _req$body2.points, comments = _req$body2.comments, meta = _req$body2.meta; // Create a New Profile Object

          updatepollsdata = {};

          if (points) {
            updatepollsdata.points = points;
          }

          if (comments) {
            updatepollsdata.comments = comments;
          }

          if (meta) {
            updatepollsdata.meta = meta;
          } // Find Profile for update


          _context4.next = 8;
          return regeneratorRuntime.awrap(Polls.findById(req.params.id));

        case 8:
          polls = _context4.sent;
          success = false;

          if (polls) {
            _context4.next = 12;
            break;
          }

          return _context4.abrupt("return", res.status(404).send(success, "NOt Found"));

        case 12:
          console.log(polls.poller_id);

          if (!(polls.poller_id.toString() !== req.user.id)) {
            _context4.next = 15;
            break;
          }

          return _context4.abrupt("return", res.status(401).send(success, "NOt Allowed"));

        case 15:
          _context4.next = 17;
          return regeneratorRuntime.awrap(Polls.findByIdAndUpdate(req.params.id, {
            $set: updatepollsdata
          }, {
            "new": true
          }));

        case 17:
          polls = _context4.sent;
          success = true;
          res.json(success, polls);
          _context4.next = 26;
          break;

        case 22:
          _context4.prev = 22;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0.message);
          res.status(500).send("Internal Server Error Occurd");

        case 26:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 22]]);
});
module.exports = router;