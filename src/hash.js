const crypto = require("crypto")

const { secret } = process.env;

module.exports = function hash(value){
    return crypto
        .createHmac("sha256", secret)
        .update(value)
        .digest("hex");
};