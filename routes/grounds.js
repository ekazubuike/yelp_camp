const   express = require('express'),
        router  = express.Router(),
        Camp    = require('../models/camp');


//==================
//CAMPGROUNDS ROUTES
//==================

//INDEX 
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Camp.find({}, function(err, camps){
       if(err){
           console.log(err);
       } else {
          res.render("grounds/index",{grounds: camps});
       }
    });
});

//NEW
router.get("/new", isLoggedIn, function(req, res){
    res.render("grounds/new");
});

//CREATE
router.post("/", isLoggedIn, function(req, res){
    let author = {
        id: req.user._id,
        username: req.user.username
    };
    let newCamp = {
        name: req.body.camp.name, 
        image: req.body.camp.image, 
        description: req.body.camp.description, 
        author: author
    };
    //create new camp and save to db
    Camp.create(newCamp, function(err,camp){
        if(err) {
            console.log(err);
        } else {
            res.redirect("/grounds");
        }
    });
});

//SHOW
router.get("/:id", function(req, res){
    //find the ground with provided ID
    Camp.findById(req.params.id).populate("comments").exec(function(err, camp){
        if(err) {
            console.log(err);
        } else {
            res.render("grounds/show", {camp: camp});
        }
    });
});

//EDIT
router.get("/:id/edit", checkCampOwnership, function(req, res){
    Camp.findById(req.params.id, function(err, foundCamp){
        res.render("grounds/edit", {camp: foundCamp});
    });
});

//UPDATE
router.put("/:id", checkCampOwnership, function(req, res){
    Camp.findByIdAndUpdate(req.params.id, req.body.camp, function(err, camp){
        if(err){
            console.log(err);
            res.redirect("/grounds");
        } else {
            res.redirect("/grounds/" + req.params.id);
        }
    });
});

//DESTROY
router.delete("/:id", checkCampOwnership, function(req, res){
    Camp.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/grounds");
        } else {
            res.redirect("/grounds");
        }
    });
});

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
    }
}

function checkCampOwnership(req, res, next){
    //is user logged in?
    if(req.isAuthenticated()){
        Camp.findById(req.params.id, function(err, foundCamp){
            if(err) {
                res.redirect("back");
            } else {
                //does user own campground?
                if(foundCamp.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

module.exports = router;
