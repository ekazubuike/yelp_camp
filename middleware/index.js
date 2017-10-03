const   Comment = require('../models/comment'),
        Camp    = require('../models/camp');

const middlewareObj = {};

middlewareObj.checkCampOwnership = function(req, res, next){
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
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    //is user logged in?
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err) {
                res.redirect("back");
            } else {
                //does user own comment?
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
    }
};

module.exports = middlewareObj;