const path = require('path');
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('69085d82e2f50558642f4306')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);
mongoose
  .connect(
    `${process.env.MONGODB_URI}`,
    {
  useNewUrlParser: true,
  useUnifiedTopology: true
}
  )
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'yamini',
          email: 'yamini@gmail.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    });
    const port=process.env.PORT
    app.listen(`${port}`,()=>{
      console.log(`running ${port}`)
    });
  })
  .catch(err => {
    console.log(err);
  });
