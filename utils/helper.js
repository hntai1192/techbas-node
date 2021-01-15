
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { isEmpty } = require("lodash")

exports.getHashedPassword = (password) => {
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)

    return hash;
}

exports.comparePassword = (passHash, pass2) => {
    return bcrypt.compareSync(pass2, passHash)
}

exports.generateToken = ({ _id, user_fullname, user_role, department_id, }) => {
    accessToken = jwt.sign({ _id, user_fullname, user_role, department_id, }, process.env.SECRET_KEY);
    // console.log(accessToken);
    return accessToken
}

exports.cleanObject = (object) => {
    function replaceUndefinedOrNull(key, value) {
        if (value === null || value === undefined || value === "") {
            return undefined;
        }
        if (typeof value === "object") {
            if (isEmpty(value)) return undefined;
        }
        if (typeof value === "array") {
            if (value.length) return undefined;
        }

        return value;
    }
    object = JSON.stringify(object, replaceUndefinedOrNull);
    return object = JSON.parse(object);
}
