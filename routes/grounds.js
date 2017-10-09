const   middleware  = require('../middleware'),
        geocoder    = require('geocoder'),
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
        price: req.body.camp.price,
        image: req.body.camp.image, 
        description: req.body.camp.description, 
        author: author
    };
    geocoder.geocode(req.body.camp.location, function(err, data){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            newCamp.lat = data.results[0].geometry.location.lat;
            newCamp.lng = data.results[0].geometry.location.lng;
            newCamp.location = data.results[0].formatted_address;
            //create new camp and save to db
            Camp.create(newCamp, function(err,camp){
                if(err) {
                    req.flash("error", err.message);
                    res.redirect("back");
                } else {
                    req.flash("success", "Campground successfully created!");
                    res.redirect("/grounds");
                }
            });
        }
    });
});

//SHOW
router.get("/:id", function(req, res){
    //find the ground with provided ID
    Camp.findById(req.params.id).populate("comments").exec(function(err, camp){
        if(err || !camp) {
            req.flash("error", "No such camp found!");
            res.redirect("/grounds");
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
    geocoder.geocode(req.body.camp.location, function(err, data){
        req.body.camp.lat = data.results[0].geometry.location.lat;
        req.body.camp.lng = data.results[0].geometry.location.lng;
        req.body.camp.location = data.results[0].formatted_address;
        Camp.findByIdAndUpdate(req.params.id, req.body.camp, function(err, camp){
            if(err){
                req.flash("error", err.message);
                res.redirect("/grounds");
            } else {
                res.redirect("/grounds/" + req.params.id);
            }
        });
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
