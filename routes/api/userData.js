var router = require('express').Router();
var mongoose = require('mongoose');
var UserData = mongoose.model('UserData');
var User = mongoose.model('User');
var auth = require('../auth');
var {
  model,
  fitData,
  predictByData,
} = require('../../ml');

router.get('/', auth.optional, function (req, res, next) {
  var query = {};
  var limit = 20;
  var offset = 0;

  if (typeof req.query.limit !== 'undefined') {
    limit = req.query.limit;
  }

  if (typeof req.query.offset !== 'undefined') {
    offset = req.query.offset;
  }

  return Promise.all([
    UserData.find(query)
      .limit(Number(limit))
      .skip(Number(offset))
      .sort({ createdAt: 'desc' })
      .populate('author')
      .exec(),
    UserData.count(query).exec(),
    req.payload ? User.findById(req.payload.id) : null,
  ]).then(function (results) {
    var userData = results[0];
    var userDataCount = results[1];
    var user = results[2];

    return res.json({
      userData: userData.map(function (userData) {
        return userData.toJSONFor(user);
      }),
      userDataCount: userDataCount
    });
  });
});


router.post('/', auth.optional, function (req, res, next) {
  User.findById(req.payload.id).then(function (user) {
    if (!user) { return res.sendStatus(401); }

    var userData = new UserData(req.body.userData);

    fitData(userData, model);

    return userData.save().then(function () {
      return res.json({ userData: userData.toJSONFor(user) });
    });
  }).catch(next);
});

router.get('/predict', auth.optional, function (req, res, next) {
  User.findById(req.payload.id).then(function (user) {
    if (!user) { return res.sendStatus(401); }

    return Promise.all([
      UserData.find(query)
        .limit(Number(limit))
        .skip(Number(offset))
        .sort({ createdAt: 'desc' })
        .populate('author')
        .exec(),
      UserData.count(query).exec(),
      req.payload ? User.findById(req.payload.id) : null,
    ]).then(function (results) {
      var userData = results[0];
      var userDataCount = results[1];
      var user = results[2];

      return res.json({
        userData: predictByData(userData, model).map(function (userData) {
          return userData.toJSONFor(user);
        }),
        userDataCount: userDataCount
      });
    });
  }).catch(next);
});

module.exports = router;
