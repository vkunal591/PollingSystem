const express = require('express')
const app = express()
const port = 3000
const connectToMongo = require('./db')
const cors = require('cors');



connectToMongo();


app.use(cors());
app.use(express.json());
const bodyParser = require("body-parser");
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies



// Available Routes
app.use('/api/admin', require('./routes/admin'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/poll', require('./routes/polls'));
app.use('/api/participent', require('./routes/participent'));







// // serve up production assets
// app.use(express.static('client/build'));
// // let the react app to handle any unknown routes 
// // serve up the index.html if express does'nt recognize the route
// const path = require('path');
// app.get('*', (req, res) => {
// res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
// });








app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})