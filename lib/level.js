

const getTier = (exp) => {

    if (exp > 0 && exp < 100) {
        return 0;
    } else if (exp > 0 && exp < 100) {
        return 1;
    } else if (exp > 0 && exp < 100) {
        return 2;
    } else if (exp > 0 && exp < 100) {
        return 3;
    } else if (exp > 0 && exp < 100) {
        return 4;
    }
};

module.exports = getTier;

// 서버 url 설정해줍니다.
