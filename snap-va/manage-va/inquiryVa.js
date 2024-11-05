const axios = require("axios")
const headersSymetricGenerator = require('./headersSymetricGenerator.js')
const config = require('./config.js')

const host = "https://snapdev.duitku.com"
const url = "/merchant/va/v1.0/transfer-va/inquiry-va"
const date = new Date()
const customerNo = "1234567890" //need equal with the one that would like to update
const trxId = "Transaction-00001" //need equal with the one that would like to update
const body = {
    partnerServiceId: config.partnerServiceId,
    customerNo,
    virtualAccountNo: `${config.partnerServiceId}${customerNo}`,
    trxId,
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