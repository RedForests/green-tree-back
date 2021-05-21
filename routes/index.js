const express = require("express");
const router = express.Router();
var db = require("../lib/db");
const jwt = require("../lib/jwt");
const authUtil = require('../lib/auth').checkToken;
var getLevel = require("../lib/level");
const todoList = require('../lib/todolist');
// db 설정해놨던거 가져오기
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;



/*************************       댓글 관련       ************************ */
router.get("/get_comment/:id",authUtil, (req, res) => {
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
router.post("/put_comment",authUtil, (req, res) => {
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
router.delete("/delete_comment/:id",authUtil, (req, res) => {
  
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
router.get("/get_center", async (req, res, next) => {
  try {
    db.query(`select * from tet`, (err, results, field) => {
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

router.post("/create_board",authUtil, (req, res) => {
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
router.delete("/delete_board/:id", authUtil, (req, res) => {
  try {
    var id = req.params.id;
    // var userid = req.body.userid;
    db.query(`delete from board where id=${id}`, (err, results, field) => {
      if (err) {
        console.log(err);
        res.json({ success: false });
      } else res.json({ success: true });
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});

// 조회수 증가
router.get("/view_board/:id", authUtil, (req, res) => {
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
router.delete("/view_board/:id", authUtil, (req, res) => {
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
router.get("/recommend_board/:id", authUtil, (req, res) => {
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
router.delete("/recommend_board/:id", authUtil, (req, res) => {
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
router.post("/levelup", authUtil, (req, res) => {
  try {
    console.log("api levelup");
    var userid = req.email;
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
              } else {
                res.json({
                  success: true,
                  data: results[0],
                });
              }
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
router.get("/level", authUtil, (req, res) => {
  try {
    console.log("api level");
    var userid = req.email;

    // db 의 product 테이블에 상품을 편집하기 위한 코드
    db.query(
      `select experience from user where email = '${userid}'`,
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
              } else {
                res.json({
                  success: true,
                  data: results[0],
                });
              }
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

router.get("/rank", authUtil, (req, res) => {
  try {
    var userid = req.email;
    // db 의 product 테이블에 상품을 삭제하기 위한 코드
    db.query(
      `select email, name, experience from user order by experience desc`,
      (err, results, field) => {
        if (err) {
          console.log(err);
          res.json({ success: false });
          // 등록하는 과정에 에러가 있으면 {success: false} 반환
        } else {
          res.json({
            success: true,
            data: results,
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

router.get("/todolist", authUtil, (req, res) => {
  try {
    var userid = req.email;

    // db 의 product 테이블에 상품을 삭제하기 위한 코드
    db.query(
      `select userid, todoid, done from todolist where userid = '${userid}'`,
      (err, results, field) => {
        if (err) {
          console.log(err);
          res.json({ success: false });
          // 등록하는 과정에 에러가 있으면 {success: false} 반환
        } else {
          res.json({
            success: true,
            list: results.map((item, idx) => {
              return {done:item.done, description:todoList[todoid] ,id:todoid}
            })
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

router.post("/todolist", authUtil, (req, res) => {
  try {
    var userid = req.email;
    var todoid = req.body.todoid;
    // db 의 product 테이블에 상품을 삭제하기 위한 코드
    db.query(
      `insert into todolist(userid, todoid) values('${userid}', ${todoid})`,
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
router.delete("/todolist", authUtil, (req, res) => {
  try {
    var userid = req.email;
    var todoid = req.body.todoid;
    // db 의 product 테이블에 상품을 삭제하기 위한 코드
    db.query(
      `delete from todolist where userid = '${userid}' and todoid = ${todoid} `,
      (err, results, field) => {
        if (err) {
          console.log(err);
          res.json({ success: false });
          // 등록하는 과정에 에러가 있으면 {success: false} 반환
        } else {
          res.json({
            success: true
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
router.post("/donetodo", authUtil, (req, res) => {
  try {
    var userid = req.email;
    var todoid = req.body.todoid;
    // db 의 product 테이블에 상품을 삭제하기 위한 코드
    db.query(
      `update todolist set done = true where userid='${userid}' and todoid = ${todoid} `,
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
  };
});
router.get("/gettodolist", authUtil, (req, res) => {
  try {
    var userid = req.email;
    // db 의 product 테이블에 상품을 삭제하기 위한 코드
    
    res.json({
      success: true,
      data: todoList.map((item, idx) => {
        return {id:idx, description:item}
      })
    });
          // 성공적으로 삭제하였으면 {success : true} 반환
        
  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});
router.post("/donetodo", authUtil, (req, res) => {
  try {
    var userid = req.email;
    var todoid = req.body.todoid;
    // db 의 product 테이블에 상품을 삭제하기 위한 코드
    db.query(
      `update todolist set done = true where userid = '${userid}' and todoid = ${todoid} `,
      (err, results, field) => {
        if (err) {
          console.log(err);
          res.json({
            success: false
          });
          // 등록하는 과정에 에러가 있으면 {success: false} 반환
        } else {
          db.query(
            `update user set experience = experience + 10 where userid = '${userid}'`,
            (err, results, field) => {
              if (err) {
                console.log(err);
                res.json({
                  success: false,
                });
                // 등록하는 과정에 에러가 있으면 {success: false} 반환
              } else {
                res.json({
                  success: true
                });
                // 성공적으로 삭제하였으면 {success : true} 반환
              }
            }
          );
          res.json({
            success: true
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

module.exports = router;
