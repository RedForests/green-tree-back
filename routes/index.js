const express = require("express");
const router = express.Router();
var db = require("../lib/db");
var getLevel = require("../lib/level");
// db 설정해놨던거 가져오기

/*************************       댓글 관련       ************************ */
router.get("/get_comment/:id", (req, res) => {
  try {
    var id = req.params.id;
    console.log(id);
    if (id === undefined) res.json({ success: false });
    else {
      // db 의 comment 에서 id, description, userid, createdate 를 가져오기 위한 코드
      db.query(
        `select * from comment where boardid=${id};`,
        (err, results, field) => {
          if (err || results === undefined || results.length === 0) {
            // 중간에 에러가 있거나, 댓글이 없으면! {success: false} 반환
            console.log(err);
            res.json({ success: false });
          } else {
            // 상품을 정상적으로 찾았으면 {list: results} 형태로 반환
            res.json({ success: true, list: results });
          }
        }
      );
    }
  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});
router.post("/put_comment", (req, res) => {
  try {
    var boardid = req.body.boardid;
    var description = req.body.description;
    var userid = req.body.userid;
    console.log("get comment");
    db.query(
      `insert into comment(boardid, description, userid) values(${boardid}, '${description}', '${userid}')`,
      (err, results, field) => {
        if (err) res.json({ success: false });
        else res.json({ success: true });
      }
    );
  } catch (err) {
    res.json({ success: false });
  }
});
router.delete("/delete_comment/:id", (req, res) => {
  try {
    var id = req.params.id;
    db.query(
      `delete from comment where id = '${id}'`,
      (err, results, filed) => {
        if (err) res.json({ success: false });
        else res.json({ success: true });
      }
    );
  } catch (err) {
    res.json({ success: false });
  }
});

/********************************      센터 정보 관리    ******************************** */
router.get("/get_center", (req, res) => {
  try {
    db.query(`select * from center`, (err, results, field) => {
      if (err) {
        console.log(err);
        res.json({ success: false });
      } else res.json({ success: true, list: results });
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});

/*****************************       게시판 정보 관리     ***************************** */

router.post("/create_board", (req, res) => {
  try {
    var description = req.body.description;
    var userid = req.body.userid;
    // var userid = req.body.userid;
    db.query(
      `insert into board(userid, description) values('${userid}', '${description}')`,
      (err, results, field) => {
        if (err) {
          console.log(err);
          res.json({ success: false });
        } else res.json({ success: true });
      }
    );
  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});

// 조회수 증가
router.get("/view_board/:id", (req, res) => {
  try {
    var boardid = req.params.id;
    // db 의 product 테이블에 상품을 등록하기 위한 코드
    db.query(
      `update board set view = view + 1 where id = ${boardid}`,
      (err, results, field) => {
        if (err) {
          res.json({ success: false });
          // 증가하는 과정에 에러가 있으면 {success: false} 반환
        } else {
          res.json({ success: true });
          // 성공적으로 증가하였으면 {success : true} 반환
        }
      }
    );
  } catch (err) {
    res.json({ success: false });
  }
});

// 조회수 감소
router.delete("/view_board/:id", (req, res) => {
  try {
    var boardid = req.params.id;
    // db 의 product 테이블에 상품을 등록하기 위한 코드
    db.query(
      `update board set view = view - 1 where id = ${boardid}`,
      (err, results, field) => {
        if (err) {
          res.json({ success: false });
          // 감소하는 과정에 에러가 있으면 {success: false} 반환
        } else {
          res.json({ success: true });
          // 성공적으로 감소하였으면 {success : true} 반환
        }
      }
    );
  } catch (err) {
    res.json({ success: false });
  }
});

// 게시판 추천 추가
router.get("/recommend_board/:id", (req, res) => {
  try {
    var boardid = req.params.id;

    // db 의 product 테이블에 상품을 삭제하기 위한 코드
    db.query(
      `update board set recommend = recommend + 1 where id = ${boardid}`,
      (err, results, field) => {
        if (err) {
          console.log(err);
          res.json({ success: false });
          // 추천 증가하는 과정에 에러가 있으면 {success: false} 반환
        } else {
          res.json({
            success: true,
          });
          // 성공적으로 증가하였으면 {success : true} 반환
        }
      }
    );
  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});

// 게시판 추천 취소
router.delete("/recommend_board/:id", (req, res) => {
  try {
    var boardid = req.params.id;

    // db 의 product 테이블에 상품을 삭제하기 위한 코드
    db.query(
      `update board set recommend = recommend - 1 where id = ${boardid}`,
      (err, results, field) => {
        if (err) {
          console.log(err);
          res.json({ success: false });
          // 등록하는 과정에 에러가 있으면 {success: false} 반환
        } else {
          res.json({
            success: true,
          });
          // 성공적으로 삭제하였으면 {success : true} 반환
        }
      }
    );
  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});

/*************************************  유저 레벨업  **************************************** */
router.post("/levelup", (req, res) => {
  try {
    console.log("api create_product");
    var userid = req.body.id;
    var experience = req.body.experience;

    // db 의 product 테이블에 상품을 편집하기 위한 코드
    db.query(
      `update user set experience = experience + ${experience} where email = '${userid}'`,
      (err, results, field) => {
        if (err) {
          console.log(err);
          res.json({ success: false });
          // 등록하는 과정에 에러가 있으면 {success: false} 반환
        } else {
          db.query(
            `select experience from user where email = '${userid}'`,
            (err, results, field) => {
              if (err) {
                console.log(err);
                res.json({
                  success: false,
                });
              } else
                var level = getLevel(results[0].experience);
                res.json({
                  success: true,
                  data: {
                    tier: level,
                  },
                });
            }
          );
          // 성공적으로 편집하였으면 {success : true} 반환
        }
      }
    );
  } catch (err) {
    res.json({ success: false });
  }
});

router.post("/modify_count", (req, res) => {
  try {
    var barcode = req.body.barcode;
    var type = req.body.type;
    var userid = req.body.userid;

    db.query(
      `select count, product_id from barcode where userid='${userid}' and barcode_value='${barcode}'`,
      (err, results, field) => {
        if (err) {
          console.log(err);
          res.json({ success: false });
        } else {
          let count = results[0].count;
          let pid = results[0].product_id;
          type = type === "1" ? "+" : "-";
          db.query(
            `update product set product_left = product_left ${type} ${count} where pid=${pid}`,
            (err, results, field) => {
              if (err) {
                console.log(err);
                res.json({ success: false });
              } else {
                db.query(
                  `insert into log(userid, pid, type, count) values('${userid}', '${pid}', '${type}' , '${count}')`,
                  (err, results, field) => {
                    if (err) {
                      console.log(err);
                      res.json({ success: false });
                    } else {
                      res.json({ success: true });
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});

router.get("/get_log/:userid", (req, res) => {
  try {
    var userid = req.parmas.userid;
    db.query(
      `select * from log where userid = '${userid}'`,
      (err, results, field) => {
        if (err) {
          console.log(err);
          res.json({ success: false });
        } else res.json({ success: true, list: results });
      }
    );
  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});

module.exports = router;
