//DEPENDENCIES
const   methodOverride      = require('method-override'),
        localStrategy       = require('passport-local'),
        bodyParser          = require('body-parser'),
        passport            = require('passport'),
        mongoose            = require('mongoose'),
        express             = require('express'),
        seedDB              = require('./seeds'),
        flash               = require('connect-flash'),
        app                 = express();

//MODELS        
const   Camp            = require('./models/camp'),
        User            = require('./models/user'),
        Comment         = require('./models/comment');

//ROUTES
const   commentsRoutes  = require('./routes/comments'),
        groundsRoutes   = require('./routes/grounds'),
        authRoutes      = require('./routes/auth');



mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seed database
//seedDB();

//Make Moment.js available to all views
app.locals.moment = require('moment');

//PASSPORT CONFIG
app.use(require('express-session')({
    secret: "I leave you full of clips like the sun and the moon",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", authRoutes);
app.use("/grounds", groundsRoutes);
app.use("/grounds/:id/comments", commentsRoutes);

app.listen(process.env.PORT, process.env.IP, ()=>console.log("She's serving FACE!"));



