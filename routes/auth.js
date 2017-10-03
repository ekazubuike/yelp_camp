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
            console.log(err);
            return res.render("register");
        } else {
            passport.authenticate("local")(req, res, function(){
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
   res.redirect("/grounds");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
    }
}

module.exports = router;