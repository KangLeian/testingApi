const routes = require('express').Router()
const Callback = require('../controllers/callbackController.js')
const DashboardController = require('../controllers/dashboardController.js')
const LoginController = require('../controllers/loginControllers.js')

routes.get('/', LoginController.viewLoginPages)
routes.post('/login', LoginController.setLogin)
routes.get('/dashboard', DashboardController.viewDashboardPages)
routes.get('/ovo-instruction', DashboardController.viewOvoInstruction)
routes.post('/bill', DashboardController.billUser)
routes.get('/bill/return', DashboardController.returnBill)
routes.get('/logout', DashboardController.logout)
routes.post('/callback', Callback.receiveNotification)

module.exports = routes