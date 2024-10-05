"use strict";

var _require = require("express"),
    Router = _require.Router;

var express = require("express");

var router = express.Router();

var Admin = require("../models/Adminschema");

var _require2 = require("express-validator"),
    body = _require2.body,
    validationResult = _require2.validationResult;

var bcrypt = require("bcryptjs");

var jwt = require("jsonwebtoken");

var fetchadmin = require("../middleware/fetchadmin");

var JWT_SEACTET = "4ucsKunal"; // Route-1 : Create A User Useing: Post "/api/auth/createuser" Doesnt require ----Auth---->

router.post("/createadmin", [body("email", "Enter A Valid Email, Please").isEmail(), body("phone", "Enter A Valid Phone, Please").isLength({
  min: 10
}), body("name", "Enter A Valid name, Please").isLength({
  min: 3
}), body("password", "Enter A Strong Password (Min: 6 Char), Please").isLength({
  min: 6
})], function _callee(req, res) {
  var errors, admin, success, salt, secPass, data, authtoken;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          errors = validationResult(req); //If there are errors, return Bad request and the errors

          if (errors.isEmpty()) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            errors: errors.array()
          }));

        case 3:
          _context.prev = 3;
          _context.next = 6;
          return regeneratorRuntime.awrap(Admin.findOne({
            email: req.body.email
          }));

        case 6:
          admin = _context.sent;
          success = false;

          if (!admin) {
            _context.next = 10;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            success: success,
            error: "Sorry this User already exist"
          }));

        case 10:
          _context.next = 12;
          return regeneratorRuntime.awrap(bcrypt.genSalt(10));

        case 12:
          salt = _context.sent;
          _context.next = 15;
          return regeneratorRuntime.awrap(bcrypt.hash(req.body.password, salt));

        case 15:
          secPass = _context.sent;
          _context.next = 18;
          return regeneratorRuntime.awrap(Admin.create({
            occupation: req.body.occupation,
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: secPass
          }));

        case 18:
          admin = _context.sent;
          data = {
            admin: {
              id: admin.id
            }
          };
          authtoken = jwt.sign(data, JWT_SEACTET);
          success = ture;
          res.json({
            success: success,
            authtoken: authtoken
          });
          _context.next = 29;
          break;

        case 25:
          _context.prev = 25;
          _context.t0 = _context["catch"](3);
          console.error(_context.t0.message);
          res.status(500).send("Some Error Occurd");

        case 29:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 25]]);
}); //Route-2 : Authenticate a user useing POST "/api/auth/login" No login requored

router.post("/loginadmin", [body("email", "Enter A Valid Email, Please").isEmail(), body("password", "Enter Your Password, Please").exists()], function _callee2(req, res) {
  var errors, _req$body, email, password, admin, success, passwordComare, payload, authtoken;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          errors = validationResult(req); //If there are errors, return Bad request and the errors

          if (errors.isEmpty()) {
            _context2.next = 3;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            errors: errors.array()
          }));

        case 3:
          _req$body = req.body, email = _req$body.email, password = _req$body.password;
          _context2.prev = 4;
          _context2.next = 7;
          return regeneratorRuntime.awrap(Admin.findOne({
            email: email
          }));

        case 7:
          admin = _context2.sent;
          success = false;

          if (admin) {
            _context2.next = 11;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            success: success,
            error: "Please try to login with correct credentials"
          }));

        case 11:
          _context2.next = 13;
          return regeneratorRuntime.awrap(bcrypt.compare(password, admin.password));

        case 13:
          passwordComare = _context2.sent;

          if (passwordComare) {
            _context2.next = 16;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            success: success,
            error: "Please try to login with correct credentials"
          }));

        case 16:
          payload = {
            admin: {
              id: admin.id
            }
          };
          authtoken = jwt.sign(payload, JWT_SEACTET);
          success = true;
          res.json({
            success: success,
            authtoken: authtoken
          });
          _context2.next = 26;
          break;

        case 22:
          _context2.prev = 22;
          _context2.t0 = _context2["catch"](4);
          console.error(_context2.t0.message);
          res.status(500).send("Some Error Occurd");

        case 26:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[4, 22]]);
}); // Route-3 : Get Logedin User Deatails using POST "/api/auth/getuser"  login required

router.post("/getadmin", fetchadmin, function _callee3(req, res) {
  var admin;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          adminid = req.admin.id;
          _context3.next = 4;
          return regeneratorRuntime.awrap(Admin.findById(adminid).select("-password"));

        case 4:
          admin = _context3.sent;
          res.send(admin);
          _context3.next = 12;
          break;

        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0 + _context3.t0.message);
          res.status(500).send("Internal error");

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 8]]);
}); // Route-3 : Get Logedin User Deatails using POST "/api/auth/getuser"  login required

router.post("/getalluser", fetchadmin, function _callee4(req, res) {
  var admin;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(User.find().select("-password"));

        case 3:
          admin = _context4.sent;
          res.send(admin);
          _context4.next = 11;
          break;

        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0 + _context4.t0.message);
          res.status(500).send("Internal error");

        case 11:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
module.exports = router;