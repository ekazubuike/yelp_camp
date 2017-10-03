const   express = require('express'),
        router  = express.Router({mergeParams: true}),
        Camp    = require('../models/camp'),
        Comment = require('../models/comment');

//======================
// COMMENTS ROUTES
//======================

//NEW
router.get("/new", isLoggedIn, function(req, res){
    Camp.findById(req.params.id, function(err, camp){
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {camp: camp});
        }
    });
    
});

//CREATE
router.post("/", isLoggedIn, function(req, res){
    //look up camp ID
    Camp.findById(req.params.id, function(err, camp){
        if(err) {
            console.log(err);
            res.redirect("/grounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err) {
                    console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    camp.comments.push(comment);
                    camp.save();
                    res.redirect("/grounds/" + camp._id);
                }
            });
        }
    });
});

//EDIT
router.get("/:comment_id/edit", checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {campId: req.params.id, comment: foundComment});
        }
    });
});

//UPDATE
router.put("/:comment_id", checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/grounds/" + req.params.id);
        }
    });
});

//DESTROY
router.delete("/:comment_id", checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/grounds/" + req.params.id);
        }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
    }
}

function checkCommentOwnership(req, res, next){
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
}

module.exports = router;