const jwt = require('jsonwebtoken');
const {token} = require('../config/index')

const sign = data => {
    return jwt.sign(data, token.salt)
}

const verify = tokenStr => {
    return jwt.verify(tokenStr, token.salt, (err, decoded)=>{
        if (err) {
            return false
        } else {
            return decoded
        }
    })
}

module.exports = {
    sign,
    verify
}