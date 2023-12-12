const duitku = require('duitku');
const cryptoJs = require('crypto-js');
const axios = require('axios');
var user = {};

class DashboardController{

    static viewDashboardPages(req, res, next) {
        let credentialCode = req.query.credentialCode;
        let customerUniqueId = req.query.customerUniqueId;
        let phoneNumber = req.query.phoneNumber;
        user = {
            credentialCode,
            customerUniqueId,
            phoneNumber
        }
        let status = "";
        if(req.query.paymentStatus) status = req.query.paymentStatus;
        duitku.getUserInfoAccountLink(credentialCode, "OL",  (resp, err) => {
            if(err){
                res.render("login.ejs", {err});
            }else{
                console.log(resp)
                res.render("dashboard.ejs", {
                    credentialCode,
                    customerUniqueId,
                    phoneNumber,
                    saldo: resp.balanceCash,
                    status: req.query.paymentStatus
                })
                }
            });
    }

    static viewOvoInstruction(req, res, next){
        let credentialCode = req.query.credentialCode;
        user.credentialCode = credentialCode;
        duitku.getTopUpInstructionOvo(credentialCode, "OL", (resp, err) => {
            if(err){
                res.send(err)
            }else{
                res.render("instruction.ejs", {data: resp})
            }
        })
    }

    static billUser(req, res, next){
        let timestamp = new Date;
        let milliseconds = timestamp.getTime()
        let transaction = new duitku.Transaction(parseInt(req.body.amount), "OL", `${milliseconds}`, "Test Auto Debet");
        user = {
            credentialCode: req.body.credcode,
            customerUniqueId: req.body.user,
            phoneNumber: req.body.phone
        }
        transaction.addOvoAccount(req.body.credcode);
        transaction.setMerchantUserInfo(req.body.user);
        transaction.setCustomerVaName(req.body.user);
        transaction.setEmail(req.body.user);
        transaction.setPhoneNumber(req.body.phone);
        let payload = transaction.get();
        payload.transactionType = req.body.transactionType;
        console.log(payload, "payload")
        duitku.requestTransaction(payload, (resp, err) => {
            if(err){
                res.redirect(`dashboard?customerUniqueId=${req.body.user}&phoneNumber=${req.body.phone}&credentialCode=${req.body.credcode}&paymentStatus=${JSON.stringify(err)}`)
            }else if(payload.transactionType == "A"){
                let milliseconds = timestamp.getTime()
                let stringToSignature = `${transaction.getMerchantCode()}${milliseconds}${resp.paymentUrl.replace(/^(?:\/\/|[^/]+)*/, '')}5d0c66ac31829b92a74cd52b7d78690c`;
                let signature = cryptoJs.SHA256(stringToSignature)
                
                axios({
                    method: "POST",
                    url: resp.paymentUrl, 
                    headers: {
                        'X-duitku-timestamp': milliseconds,
                        'X-duitku-signature': signature,
                        'X-duitku-merchant': `${transaction.getMerchantCode()}`
                    }
                })
                .then(response => {
                    res.redirect(`dashboard?customerUniqueId=${req.body.user}&phoneNumber=${req.body.phone}&credentialCode=${req.body.credcode}&paymentStatus=Success`)
                })
                .catch(err => {
                    res.redirect(`dashboard?customerUniqueId=${req.body.user}&phoneNumber=${req.body.phone}&credentialCode=${req.body.credcode}&paymentStatus=Failed`)
                })
            }else{
                res.redirect(resp.paymentUrl)
            }
        })
    }

    static returnBill(req, res, next){
        let resultCode = req.query.resultCode
        if(resultCode == "00"){
            res.redirect(`../dashboard?customerUniqueId=${user.customerUniqueId}&phoneNumber=${user.phoneNumber}&credentialCode=${user.credentialCode}&paymentStatus=Success`)
        }else{
            res.redirect(`../dashboard?customerUniqueId=${user.customerUniqueId}&phoneNumber=${user.phoneNumber}&credentialCode=${user.credentialCode}&paymentStatus=Failed`)
        }
    }

    static logout(req, res, next){
        duitku.userDisconnectsAccountLink(user.credentialCode, "OL", (resp, err) => {
            if(err){
                res.redirect(`dashboard?customerUniqueId=${user.customerUniqueId}&phoneNumber=${user.phoneNumber}&credentialCode=${user.credentialCode}&paymentStatus=FailedToLogout`)
            }else{
                user = {}
                res.redirect(`../`)
            }
        })
    }
}

module.exports = DashboardController