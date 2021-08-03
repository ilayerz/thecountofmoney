const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const crypto = require('./controller/crypto');
const article = require('./controller/articles');
const feed = require('./controller/feeds');
const users = require('./controller/users');
const user = require('./services/user/user');
const testing = require('./services/testing/testing');
const { request } = require('express');

const app = express();
const PORT = process.env.NODE_ENV || 3001;

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
  });

  //TODO : Créer un tableau des routes qui demandent un token.
  function verifyJWT(req,res,next) {
    // validate request
    /*if (req.url == url) {
      res.cookie(cookie, value);
      next();
    }   */
    //console.log(req.url)
     // if not valid throw error
    //res.status(403).json({msg:'Unauthorized Access'});
    next();
  };

app.get('/healthcheck', function(request, response){
    return response.status(200).json({
        message: "Server is ok !"
    })
});

app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(limiter);

app.use('/cryptos', verifyJWT, crypto);
app.use('/articles', verifyJWT, article);
app.use('/feeds', feed);
app.use('/users', users);


app.get('/databaseCheck', testing.databaseCheck);
app.post('/users/register', user.register);
app.get('/users/profile', user.getUserProfile);
app.put('/users/profile', user.modifyUserProfile);
app.post('/users/login', user.login);
app.post('/users/logout', user.logout);

app.listen(PORT, () => console.log(`Express server currently running on port ${PORT}`));
