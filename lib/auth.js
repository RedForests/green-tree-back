const jwt = require("./jwt");
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

const authUtil = {
  checkToken: async (req, res, next) => {
    var token = req.headers.token;
    // 토큰 없음
    if (!token) return res.json({ success: false });
    // decode
    const user = await jwt.verify(token);
    // 유효기간 만료
    if (user === TOKEN_EXPIRED)
      return res.json({ success: false });
    // 유효하지 않는 토큰
    if (user === TOKEN_INVALID)
      return res.json({success : false});
    if (user.idx === undefined)
      return res.json({ success: false });
    req.email = user.email;
    next();
  },
};

module.exports = authUtil;
