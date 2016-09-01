var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var Project = require('../models/project');
var Requirement = require('../models/requirement');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { user : req.user, title : "Titus..." });
});

router.get('/register', function(req, res) {
    if (req.user) res.redirect('/');
    res.render('register', { });
});

router.post('/register', function(req, res, next) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
          return res.render('register', { error : err.message });
        }

        passport.authenticate('local')(req, res, function () {
            req.session.save(function (err) {
                if (err) {
                    return next(err);
                }
                res.redirect('/');
            });
        });
    });
});

router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});


router.get('/projects/new', function (req, res) {
  if (!req.user) {
    res.redirect('/projects');
  } else {
    res.render('projects/new');
  }
});

router.post('/projects', function(req, res) {
  var project = new Project({
    title : req.body.title,
    description: req.body.description,
    startingDate: req.body.startingDate,
    endDate: req.body.endDate
  });
  project.save(function(err, project) {
    if(err){
      res.send('Error saving project')
    } else {
      res.redirect('/projects');
    }
  });
});

router.get('/projects', function(req, res) {
  Project.find({}, function(err, projects) {
    res.render('projects/projects', {projects: projects});
  });
});

router.get('/projects/:projectId/requirements', function(req, res){
  Requirement.find({projectId: req.params.projectId}, function(err, requirements) {
    if (err) {
      res.send('Error getting requirements from the database');
    } else {
      res.render('requirements/index', { requirements: requirements });
    }
  });
});

router.get('/projects/:projectId/requirements/new', function(req, res) {
  if (!req.user) {
    res.redirect('/projects');
  } else {
    res.render('requirements/new', {projectId: req.params.projectId});
  }
});

router.post('/projects/:projectId/requirements', function(req, res) {
  var requirement = new Requirement({
    projectId: req.params.projectId,
    title: req.body.title,
    description: req.body.description,
    capacity: req.body.capacity,
    startingDate: req.body.startingDate,
    endDate: req.body.endDate
  });
  requirement.save(function(err, requirement){
    if (err) {
      res.send('Error creating a requirement');
    } else {
      res.redirect('/projects/' + req.params.projectId + '/requirements')
    }
  });
});


module.exports = router;
