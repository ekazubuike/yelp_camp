const   middleware  = require('../middleware'),
        express     = require('express'),
        router      = express.Router(),
        Camp        = require('../models/camp');


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
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("grounds/new");
});

//CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
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
router.get("/:id/edit", middleware.checkCampOwnership, function(req, res){
    Camp.findById(req.params.id, function(err, foundCamp){
        res.render("grounds/edit", {camp: foundCamp});
    });
});

//UPDATE
router.put("/:id", middleware.checkCampOwnership, function(req, res){
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
router.delete("/:id", middleware.checkCampOwnership, function(req, res){
    Camp.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/grounds");
        } else {
            res.redirect("/grounds");
        }
    });
});

module.exports = router;
