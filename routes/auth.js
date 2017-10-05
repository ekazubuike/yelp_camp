const   express     = require('express'),
        router      = express.Router(),
        passport    = require('passport'),
        User        = require('../models/user');

router.get("/", function(req, res){
    res.render("home");
});

//============
//AUTH ROUTES
//============

//register form
router.get("/register", function(req, res){
    res.render("register");
});

//handle sign-up logic
router.post("/register", function(req, res){
    let newUser = new User({username: req.body.username});
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

//show login form
router.get("/login", function(req, res){
    res.render("login");
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
   req.flash("success", "Successfully logged you out.")
   res.redirect("/grounds");
});

module.exports = router;