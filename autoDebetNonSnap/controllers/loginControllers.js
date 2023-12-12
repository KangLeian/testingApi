const duitku = require('duitku');

class LoginController{
    static viewLoginPages(req, res, next) {
        res.render("login.ejs", {err: ""});
    }

    static setLogin(req, res, next){
        duitku.userConnectsAccountLink(req.body.phone, req.body.email, "OL", (resp, err) => {
            if(err){
                res.render("login.ejs", {err});
            }else{
                res.redirect(resp.webviewUrl)
                }
        })
    }
}

module.exports = LoginController