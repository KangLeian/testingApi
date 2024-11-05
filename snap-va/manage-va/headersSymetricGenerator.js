//Header symmetric generate
const CryptoJS = require('crypto-js')
const config = require('./config.js')
const toIsoString = require('./toIsoString.js')
function headersSymetricGenerator(date, method, endpoint, body){
    let minifyBody = JSON.stringify(body)
    let encBody = CryptoJS.SHA256(minifyBody).toString()
    let stringToSign = `${method}:${endpoint}:${config.accessToken}:${encBody.toLowerCase()}:${toIsoString(date)}`
    let signature = CryptoJS.HmacSHA512(stringToSign, config.clientSecret).toString(CryptoJS.enc.Base64)
    let headers = {
        "X-TIMESTAMP": toIsoString(date),
        "X-SIGNATURE": signature,
        "X-PARTNER-ID": config.partnerId,
        "X-EXTERNAL-ID": Math.floor(1000000000000000000 + Math.random() * 9000000000000000000).toString(),
        "channel-id": config.channelId,
        Authorization: `bearer ${config.accessToken}`
    }
    console.log("minifyBody : ", minifyBody)
    console.log("encBody : ", encBody)
    console.log("stringToSign : ", stringToSign)
    return headers
}

module.exports = headersSymetricGenerator