const   express     = require('express'),
        router      = express.Router(),
        passport    = require('passport'),
        User        = require('../models/user'),
        Camp        = require('../models/camp');

router.get("/", function(req, res){
    res.render("landing");
});

//============
//AUTH ROUTES
//============

//SHOW register form
router.get("/register", function(req, res){
    res.render("register", {page: 'register'});
});

//handle sign-up logic
router.post("/register", function(req, res){
    let newUser = new User(
        {
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.lastName,
            avatar: req.body.avatar
        });
    if(req.body.adminCode === 'secretcode123') {
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            //console.log(err);
            req.flash("error", err.message);
            return res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Successfully registered! Welcome to YelpCamp " + user.username + "!");
                res.redirect("/grounds");
            });
        }
    });
});

//SHOW login form
router.get("/login", function(req, res){
    res.render("login", {page: 'login'});
});

//handle login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/grounds",
        failureRedirect: "/login" 
    }), function(req, res){
});

//logout 
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Successfully logged you out.");
   res.redirect("/grounds");
});

//user profiles
router.get("/users/:id", function(req, res){
    User.findById(req.params.id, function(err, user){
       if(err){
           req.flash("error", "No user found!");
           res.redirect("/grounds");
       } else {
           Camp.find().where('author.id').equals(user._id).exec(function(err, camps){
               if (err) {
                   req.flash("error", "Something went wrong!");
                   res.redirect("/");
               } else {
                   res.render("users/show", {user: user, camps: camps});
               }
           });
           
       }
    });
});

module.exports = router;