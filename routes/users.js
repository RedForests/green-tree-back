const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const path = require("path");
const compression = require("compression");
const db = require("../lib/db");
const randToken = require("rand-token");
const jwt = require("jsonwebtoken");
const secretKey = require("../config/secretKey").secretKey;
const options = require("../config/secretKey").options;
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

router.use(compression());
router.use(bodyParser.urlencoded({ extended: false }));

router.get("/session", (req, res) => {
  console.log("get auth", req.session.passport);
  if (req.sessiion.passport == undefined) {
    res.send({ success: false });
  } else {
    res.send({ success: true, data: req.session.passport.user });
  }
});

router.post("/signin", async (req, res) => { // 로그인
  console.log("signin!!", req.body);
  var id = req.body.email;
  var password = req.body.password;

  db.query(
    `select name, id from user where email='${id}' and password='${password}'`,
    async (err, results, field) => {
      if (results.length == 0) {
        res.send({ success: false });
      } else {
        const jwtToken = await jwt.sign(id);
        res.send({ success: true, token: jwtToken });
      }
    }
  );
});


router.post("/signup", (req, res) => { // 회원가입
  console.log("get signup", req.body);
  var email = req.body.email;
  var password = req.body.password;
  var name = req.body.name;
  db.query(`select * from user where email='${email}'`, (err, results, field) => {
    console.log(results);
    if (results.length != 0) {
      res.send({ success: false, message: "이미 존재하는 아이디입니다." });
    } else {
      db.query(
        `insert into user(email, password, name) values ('${email}', '${password}', '${name}');`,
        (err, results, field) => {
          res.send({ success: true });
        }
      );
    }
  });
});

router.post("/update", (req, res) => { // 비밀번호 변경
  try {
    console.log("get signup", req.body);
    var email = req.body.email;
    var new_password = req.body.new_password;
    var password = req.body.password;

    db.query(
      `select * from user where email='${email}' and password='${password}'`,
      (err, results, field) => {
        if (results.length == 0) {
          res.send({ success: false });
        } else {
          db.query(
            `update user set password='${new_password}' where email='${email}'`,
            (err, results, field) => {
              if (err) res.send({ success: false });
              res.send({ success: true });
            }
          );
        }
      }
    );
  } catch (err) {
    res.send({ success: false });
  }
});

module.exports = router;
