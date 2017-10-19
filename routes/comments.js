const   middleware = require('../middleware'),
        Comment     = require('../models/comment'),
        express     = require('express'),
        router      = express.Router({mergeParams: true}),
        Camp        = require('../models/camp');

//======================
// COMMENTS ROUTES
//======================

//NEW
router.get("/new", middleware.isLoggedIn, function(req, res){
    Camp.findById(req.params.id, function(err, camp){
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {camp: camp});
        }
    });
    
});

//CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
    //look up camp ID
    Camp.findById(req.params.id, function(err, camp){
        if(err) {
            console.log(err);
            res.redirect("/grounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err) {
                    req.flash("error", "Could not create campground!");
                    console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    camp.comments.push(comment);
                    camp.save();
                    req.flash("success", "Comment successfully added!");
                    res.redirect("/grounds/" + camp._id);
                }
            });
        }
    });
});

//EDIT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Camp.findById(req.params.id, function(err, foundCamp){
        if(err || !foundCamp){
            req.flash("error", "No such campground!");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                res.render("comments/edit", {campId: req.params.id, comment: foundComment});
            }
        });
    });
    
});

//UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment updated!")
            res.redirect("/grounds/" + req.params.id);
        }
    });
});

//DESTROY
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted!");
            res.redirect("/grounds/" + req.params.id);
        }
    });
});

module.exports = router;