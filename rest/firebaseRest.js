(function(m){
  var FirebaseClient = require('firebase-client'),
  firebase = new FirebaseClient({ url: "https://luminous-inferno-708.firebaseio.com/accounts" });

  m.exports = {
    build: function(app){
      declareAuthUser(app);
      declareAuthStraight(app);
      declareAddTask(app);
      declareRemoveTask(app);
      declareToggleTaskDone(app);
      declareRefreshTasks(app);
    }
  };

  return m.exports;

  function declareAuthUser(app) {
    app.post('/api/auth', function (req, res){
      console.log(req.body);
      if (!req.body.hasOwnProperty('userName')) {
        res.status(500);
        res.json({ error: true, message: "Ops! I think you've forgotten the user name!" });
      } else if (!req.body.hasOwnProperty('password')) {
        res.status(500);
        res.json({ error: true, message: "Ops! I think you've forgotten the password!" });
      } else {
        firebase.get(req.body.userName)
        .then(function(body){
          console.log(body);
          if (body.password != req.body.password) {
            res.status(500);
            res.json({ error: true, message: "The password doesn't match for the user \"" + req.body.userName + "\"!" });
          } else {
            req.session.userName = req.body.userName;
            if (!!body.tasks) {
              Object.keys(body.tasks).forEach(function(key){
                if (!!body.tasks[key]){
                  body.tasks[key].id = key;
                }
              });
            }
            console.log(body);
            res.json(body);
          }
        })
        .fail(function(err){
          console.log(err);
          res.status(500);
          res.json({ error: true, message: "There is no user with user name \"" + req.body.userName + "\"!" });
        });
      }
    });
  }

  function declareAuthStraight(app) {
    app.post('/api/auth-straight', function (req, res){
      if (!req.body.hasOwnProperty('userName')) {
        res.status(500);
        res.json({ error: true, message: "Ops! I think you've forgotten the user name!" });
      } else {
        firebase.get(req.body.userName)
        .then(function(body){
          req.session.userName = req.body.userName;
          if (!!body.tasks) {
            Object.keys(body.tasks).forEach(function(key){
              if (!!body.tasks[key]){
                body.tasks[key].id = key;
              }
            });
          }
          console.log(body);
          res.json(body);
        })
        .fail(function(err){
          console.log(err);
          res.status(500);
          res.json({ error: true, message: "There is no user with user name \"" + req.body.userName + "\"!" });
        });
      }
    });
  }

  function declareAddTask(app) {
    app.post('/api/add-task', function (req, res){
      if (!req.session.userName) {
        res.status(500);
        res.json({ error: true, message: "Ops! You need to authenticate before interact!" });
      } else if (!req.body.text) {
        res.status(500);
        res.json({ error: true, message: "I think you might have forgotten the task description!" });
      } else {
        firebase.push(req.session.userName + '/tasks', req.body)
        .then(function(body){
          console.log(body);
          res.json({ success: true, message: "Great! You have added a new task!" });
        })
        .fail(function(err){
          console.log(err);
          res.status(500);
          res.json({ error: true, message: "What a shame, sorry! We couldn't add your task!" });
        });
      }
    });
  }

  function declareRemoveTask(app) {
    app.post('/api/remove-task/:id', function (req, res){
      if (!req.session.userName) {
        res.status(500);
        res.json({ error: true, message: "Ops! You need to authenticate before interact!" });
      } else if (!req.params.id) {
        res.status(500);
        res.json({ error: true, message: "I think you might have forgotten the task id!" });
      } else {
        firebase.delete(req.session.userName + '/tasks/' + req.params.id)
        .then(function(){
          console.log();
          res.json({ success: true, message: "Great! You have removed a task!" });
        })
        .fail(function(err){
          console.log(err);
          res.status(500);
          res.json({ error: true, message: "Uhhhh! Something is wrong for sure!" });
        });
      }
    });
  }

  function declareToggleTaskDone(app) {
    app.post('/api/toggle-task/:id', function (req, res){
      if (!req.session.userName) {
        res.status(500);
        res.json({ error: true, message: "Ops! You need to authenticate before interact!" });
      } else if (!req.params.id) {
        res.status(500);
        res.json({ error: true, message: "I think you might have forgotten the task id!" });
      } else {
        firebase.get(req.session.userName + '/tasks/' + req.params.id)
        .then(function(data){
          data.done = !data.done;
          firebase.update(req.session.userName + '/tasks/' + req.params.id, data)
          .then(function(body){
            console.log(body);
            res.json({ success: true, message: "Great! You have " + (data.done ? "checked" : "unchecked") + " a task!" });
          })
          .fail(function(err){
            console.log(err);
            res.status(500);
            res.json({ error: true, message: "Uhhhh! Something is wrong for sure!" });
          });
        })
        .fail(function(err){
          console.log(err);
          res.status(500);
          res.json({ error: true, message: "Uhhhh! Something is wrong for sure!" });
        });
      }
    });
  }

  function declareRefreshTasks(app) {
    app.post('/api/tasks', function (req, res){
      if (!req.session.userName) {
        res.status(500);
        res.json({ error: true, message: "Ops! You need to authenticate before interact!" });
      } else {
        firebase.get(req.session.userName + '/tasks')
        .then(function(body){
          if (!!body) {
            Object.keys(body).forEach(function(key){
              if (!!body[key]){
                body[key].id = key;
              }
            });
          }
          console.log(body);
          res.json(body == null ? [] : body);
        })
        .fail(function(err){
          console.log(err);
          res.status(500);
          res.json({ error: true, message: "Jesus! Pray a little bit cause you don't have any task!" });
        });
      }
    });
  }
})(module || {});
