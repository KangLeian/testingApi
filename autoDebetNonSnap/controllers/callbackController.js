const duitku = require("duitku")

class Callback{
    static receiveNotification(req, res, next){
        console.log(req.body)
        duitku.callback(req.body)
        res.status(200).send('received')
    }
}

module.exports = Callback