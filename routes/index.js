const express = require("express");
const router = express.Router();
var db = require("../lib/db");
// db 설정해놨던거 가져오기

/*************************       댓글 관련       ************************ */
router.get("/get_comment/:id", (req, res) => {
  try {
    var id = req.params.boardid;
    if (id === undefined) res.json({ success: false });
    else {
      // db 의 product 에서 category, name, left 를 가져오기 위한 코드
      db.query(
        `select id, product_category, product_name, product_left from product where product_visible='true' and userid='${id}';`,
        (err, results, field) => {
          if (err || results === undefined || results.length === 0) {
            // 중간에 에러가 있거나, 상품이 없으면! {success: false} 반환
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
    console.log("get barcode");
    db.query(`select * from barcode`, (err, results, field) => {
      if (err) res.json({ success: false });
      else res.json({ success: true, list: results });
    });
  } catch (err) {
    res.json({ success: false });
  }
});
router.post("/delete_comment", (req, res) => {
  try {
    var id = req.body.commentid;
    db.query(
      `delete from barcode where barcode_value = '${barcode}' and userid='${id}'`,
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
    db.query(
      `select B.barcode_value, B.product_id from (select id from product where userid='${id}') A join barcode B on A.id = B.product_id`,
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



/*****************************       게시판 정보 관리     ***************************** */

router.post("/create_board", (req, res) => {
  try {
    var description = req.body.description;
    var pid = req.body.boardid;
    var count = req.body.userid;
    // var userid = req.body.userid;
    db.query(
      `insert into barcode(barcode_value, product_id, count, userid) values('${barcode}', '${pid}','${count}','${userid}')`,
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
      `insert into product(product_category, product_name, product_left, product_visible, userid) values('${category}', '${name}', '${left}', '${visible}', '${userid}')`,
      (err, results, field) => {
        if (err) {
          res.json({ success: false });
          // 등록하는 과정에 에러가 있으면 {success: false} 반환
        } else {
          res.json({ success: true });
          // 성공적으로 등록하였으면 {success : true} 반환
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
      `insert into product(product_category, product_name, product_left, product_visible, userid) values('${category}', '${name}', '${left}', '${visible}', '${userid}')`,
      (err, results, field) => {
        if (err) {
          res.json({ success: false });
          // 등록하는 과정에 에러가 있으면 {success: false} 반환
        } else {
          res.json({ success: true });
          // 성공적으로 등록하였으면 {success : true} 반환
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
      `delete from product where id='${p_id}' and userid='${userid}'`,
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

// 게시판 추천 취소
router.delete("/recommend_board/:id", (req, res) => {
  try {
    var boardid = req.params.id;

    // db 의 product 테이블에 상품을 삭제하기 위한 코드
    db.query(
      `delete from product where id='${p_id}' and userid='${userid}'`,
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
      `update product set product_name='${name}', product_category='${categoryu}', product_left='${left}', product_visible='${visible}', userid='${userid}')`,
      (err, results, field) => {
        if (err) {
          res.json({ success: false });
          // 등록하는 과정에 에러가 있으면 {success: false} 반환
        } else {
          db.query(
            `update barcode set barcode_value='${barcode}' where product_id='${name}'`,
            (err, results, field) => {
              if (err) res.json({ success: false });
              else res.json({ success: true });
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
