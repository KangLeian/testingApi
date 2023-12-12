const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const routes = require('./routes')

app.set('view engine', 'ejs');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(routes);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})