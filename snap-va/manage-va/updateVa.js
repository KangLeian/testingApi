const axios = require("axios")
const toIsoString = require('./toIsoString.js')
const headersSymetricGenerator = require('./headersSymetricGenerator.js')
const config = require('./config.js')

const host = "https://snapdev.duitku.com"
const url = "/merchant/va/v1.0/transfer-va/update-va"
const date = new Date()
const expiredDate = new Date()
expiredDate.setDate(expiredDate.getDate() + 1)
const customerNo = "1234567891" //need equal with the one that would like to update
const virtualAccountName = "John Doe Update" //displayed as name on the bank side
const trxId = "Transaction-00002" //need equal with the one that would like to update
const amount = 0
const minAmount = 10000
const maxAmount = 50000
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
    virtualAccountTrxType: "2",
    expiredDate: toIsoString(expiredDate),
    additionalInfo: {
        "minAmount": `${minAmount}.00`,
        "maxAmount": `${maxAmount}.00`
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