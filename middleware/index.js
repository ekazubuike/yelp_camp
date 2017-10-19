const   Comment = require('../models/comment'),
        Camp    = require('../models/camp');

const middlewareObj = {};

middlewareObj.checkCampOwnership = function(req, res, next){
    //is user logged in?
    if(req.isAuthenticated()){
        Camp.findById(req.params.id, function(err, foundCamp){
            if(err || !foundCamp) {
                req.flash("error", "Campground not found!");
                res.redirect("back");
            } else {
                //does user own campground?
                if(foundCamp.author.id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                } else {
                    req.flash("error", "You do not have permission to edit this campground.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Please login first.");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    //is user logged in?
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment) {
                req.flash("error", "Comment not found!");
                res.redirect("back");
            } else {
                //does user own comment?
                if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to modify this comment.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Please login first.");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash("error", "Please login first!");
        res.redirect("/login");
    }
};

module.exports = middlewareObj;