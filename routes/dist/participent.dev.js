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

var Participent = require("../models/Participentschema");

var fetchadmin = require("../middleware/fetchadmin");

var fetchuser = require("../middleware/fetchuser");

router.get("/getparticipents", fetchadmin || fetchuser, function _callee(req, res) {
  var participent;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(Participent.find());

        case 3:
          participent = _context.sent;
          res.json(participent);
          _context.next = 11;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0.message);
          res.status(500).send("Internal server Error Occurd");

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
router.post("/createparticipent", fetchadmin, // [
//   body("name", "Enter A Valid name, Please").isLength({
//     min: 3
//   }),
//   body("email", "Enter A Valid Email, Please").isEmail(),
//   body("phone", "Enter A Valid Phone, Please").isLength({
//     min: 10
//   })
// ],
function _callee2(req, res) {
  var _req$body, category, teamname, teamleader, content, hidden, errors, createparticipent, participentdata;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body = req.body, category = _req$body.category, teamname = _req$body.teamname, teamleader = _req$body.teamleader, content = _req$body.content, hidden = _req$body.hidden;
          errors = validationResult(req); //If there are errors, return Bad request and the errors

          if (errors.isEmpty()) {
            _context2.next = 5;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            errors: errors.array()
          }));

        case 5:
          createparticipent = new Participent({
            admin: req.admin.id,
            category: category,
            teamname: teamname,
            teamleader: teamleader,
            content: content,
            hidden: hidden
          });
          _context2.next = 8;
          return regeneratorRuntime.awrap(createparticipent.save());

        case 8:
          participentdata = _context2.sent;
          res.json(participentdata);
          _context2.next = 15;
          break;

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](0);
          // console.error(error.message);
          res.status(500).send("Internal Server Error Occurd");

        case 15:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 12]]);
}); // Route-2 : Get update A existing Profile Using PUT "/api/Profile/updateProfile" login required

router["delete"]("/deleteparticipent", fetchadmin, //  [
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
function _callee3(req, res) {
  var _req$body2, points, comments, meta, updateparticipentdata, participent;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _req$body2 = req.body, points = _req$body2.points, comments = _req$body2.comments, meta = _req$body2.meta; // Create a New Profile Object

          updateparticipentdata = {};

          if (points) {
            updateparticipentdata.points = points;
          }

          if (comments) {
            updateparticipentdata.comments = comments;
          }

          if (meta) {
            updateparticipentdata.meta = meta;
          } // Find Profile for update


          _context3.next = 8;
          return regeneratorRuntime.awrap(Participent.findById(req.header("participentid")));

        case 8:
          participent = _context3.sent;

          if (participent) {
            _context3.next = 11;
            break;
          }

          return _context3.abrupt("return", res.status(404).send("NOt Found"));

        case 11:
          _context3.next = 13;
          return regeneratorRuntime.awrap(Participent.findByIdAndDelete(req.header("participentid")));

        case 13:
          participent = _context3.sent;
          res.json(participent);
          _context3.next = 21;
          break;

        case 17:
          _context3.prev = 17;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0.message);
          res.status(500).send("Internal Server Error Occurd");

        case 21:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 17]]);
}); //

router.put("/startpoll", fetchadmin, //  [
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
  var _req$body3, hidden, points, comments, rank, updateparticipentdata, participent;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _req$body3 = req.body, hidden = _req$body3.hidden, points = _req$body3.points, comments = _req$body3.comments, rank = _req$body3.rank;
          console.log(comments, hidden); // Create a New Profile Object

          updateparticipentdata = {};

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
          } // Find Profile for update


          _context4.next = 10;
          return regeneratorRuntime.awrap(Participent.findById(req.header("participentid")));

        case 10:
          participent = _context4.sent;

          if (participent) {
            _context4.next = 13;
            break;
          }

          return _context4.abrupt("return", res.status(404).send("NOt Found"));

        case 13:
          _context4.next = 15;
          return regeneratorRuntime.awrap(Participent.findByIdAndUpdate(req.header("participentid"), {
            $set: updateparticipentdata
          }, {
            "new": true
          }));

        case 15:
          participent = _context4.sent;
          res.json(participent);
          _context4.next = 23;
          break;

        case 19:
          _context4.prev = 19;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0.message);
          res.status(500).send("Internal Server Error Occurd");

        case 23:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 19]]);
});
module.exports = router;