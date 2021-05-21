const { get } = require("request");

const host = "http://localhost:3001";
const destrib_host = "http://joopi.cf";

const bgetHost = () => {
  return destrib_host;
};

module.exports = bgetHost;

// 서버 url 설정해줍니다.
