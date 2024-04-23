const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// const url = 'mongodb+srv://rakeshrath008:Rakesh1234@cluster0.na5h8.mongodb.net/attendance';
const url = 'mongodb://localhost:27017/create_U_P_DB' ;
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('DB Connected'))
.catch(err => console.error(err));


app.use('/auth', require('./src/routes/authRoutes'));
app.use('/leave', require('./src/routes/leaveRoutes'));
app.use('/users', require('./src/routes/userRoutes'));
app.use('/time', require('./src/routes/timeRoutes'));

app.listen(5000, () => {
  console.log('Server started on port 5000');
});
