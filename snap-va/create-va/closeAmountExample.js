const axios = require("axios")
const CryptoJS = require('crypto-js')

const host = "https://snapdev.duitku.com"
const url = "/merchant/va/v1.0/transfer-va/create-va"
const date = new Date()
const expiredDate = new Date()
expiredDate.setDate(expiredDate.getDate() + 1)
const config = {
    partnerId: "D11109",
    partnerServiceId: "8869004",
    channelId: "Duitku",
    clientSecret: "c66485b31358c0e008c2dac30f1152a6",
    accessToken: "N2JjOTU2YWQtNjhlMy00MGI5LTgzZGItMDhkYzI2ZGE0NWNh"
}
const customerNo = "1234567890"
const virtualAccountName = "John Doe" //displayed as name on the bank side
const trxId = "Transaction-00001" //need unique in every request
const amount = 12000
const body = {
    partnerServiceId: config.partnerServiceId,
    customerNo,
    virtualAccountNo: `${config.partnerServiceId}${customerNo}`,
    virtualAccountName,
    trxId,
    totalAmount: {
        "value": `${amount}.00`,
        "currency": "IDR"
    },
    virtualAccountTrxType: "1",
    expiredDate: toIsoString(expiredDate),
    additionalInfo: {
        "minAmount": "0.00",
        "maxAmount": "0.00"
    }
}

const headers = headersSymetricGenerator(date, "POST", url, body)
console.log(headers, body)

axios.post(host + url, body, {headers: headers })
    .then(response => {
        console.log(response.data)
    })
    .catch(err => {
        console.log(err.response.data)
    })
    
//Header symmetric generate
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

//helper function for timestamp
function toIsoString(date) {
    var tzo = -date.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = function(num) {
            return (num < 10 ? '0' : '') + num;
        };
  
    return date.getFullYear() +
        '-' + pad(date.getMonth() + 1) +
        '-' + pad(date.getDate()) +
        'T' + pad(date.getHours()) +
        ':' + pad(date.getMinutes()) +
        ':' + pad(date.getSeconds()) +
        dif + pad(Math.floor(Math.abs(tzo) / 60)) +
        ':' + pad(Math.abs(tzo) % 60);
  }