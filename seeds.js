const   mongoose    = require('mongoose'),
        Comment     = require('./models/comment'),
        Camp        = require('./models/camp');

const data = [
    {
        name: "Antelope Canyon",
        image: "https://images.unsplash.com/photo-1479030160180-b1860951d696?dpr=1&auto=compress,format&fit=crop&w=1050&h=&q=80&cs=tinysrgb&crop=",
        description: "Knausgaard officia man bun franzen adaptogen skateboard gluten-free cronut kitsch bitters. Keffiyeh cliche ennui woke williamsburg sartorial. Celiac squid palo santo elit intelligentsia, ramps kombucha bicycle rights single-origin coffee in pitchfork edison bulb. Humblebrag scenester heirloom cloud bread plaid butcher deep v pariatur. Tousled cillum bespoke incididunt, banh mi poke street art tumeric squid consequat velit kale chips ullamco. Bicycle rights eu franzen, subway tile knausgaard banjo schlitz. Next level shaman disrupt sint, brunch dolore beard id deserunt cardigan shabby chic. Leggings anim iceland butcher in farm-to-table, ennui 3 wolf moon four loko ramps quinoa ex poutine. Cold-pressed kinfolk pinterest mustache church-key iceland adipisicing palo santo whatever retro. Et man braid roof party, affogato +1 typewriter mumblecore tempor pork belly. Squid kitsch humblebrag, chillwave nulla chia migas bushwick adipisicing cray. Hoodie et microdosing YOLO. Mixtape pitchfork raw denim irure. Fixie sriracha nulla swag. Heirloom franzen glossier pour-over."
    },
    {
        name: "Tuolumne Meadows",
        image: "https://images.unsplash.com/photo-1482784160316-6eb046863ece?dpr=1&auto=compress,format&fit=crop&w=1050&h=&q=80&cs=tinysrgb&crop=",
        description: "Knausgaard officia man bun franzen adaptogen skateboard gluten-free cronut kitsch bitters. Keffiyeh cliche ennui woke williamsburg sartorial. Celiac squid palo santo elit intelligentsia, ramps kombucha bicycle rights single-origin coffee in pitchfork edison bulb. Humblebrag scenester heirloom cloud bread plaid butcher deep v pariatur. Tousled cillum bespoke incididunt, banh mi poke street art tumeric squid consequat velit kale chips ullamco. Bicycle rights eu franzen, subway tile knausgaard banjo schlitz. Next level shaman disrupt sint, brunch dolore beard id deserunt cardigan shabby chic. Leggings anim iceland butcher in farm-to-table, ennui 3 wolf moon four loko ramps quinoa ex poutine. Cold-pressed kinfolk pinterest mustache church-key iceland adipisicing palo santo whatever retro. Et man braid roof party, affogato +1 typewriter mumblecore tempor pork belly. Squid kitsch humblebrag, chillwave nulla chia migas bushwick adipisicing cray. Hoodie et microdosing YOLO. Mixtape pitchfork raw denim irure. Fixie sriracha nulla swag. Heirloom franzen glossier pour-over."
    },
    {
        name: "Monte Altissimo di Nago",
        image: "https://images.unsplash.com/photo-1494935362342-566c6d6e75b5?dpr=1&auto=compress,format&fit=crop&w=1050&h=&q=80&cs=tinysrgb&crop=",
        description: "Knausgaard officia man bun franzen adaptogen skateboard gluten-free cronut kitsch bitters. Keffiyeh cliche ennui woke williamsburg sartorial. Celiac squid palo santo elit intelligentsia, ramps kombucha bicycle rights single-origin coffee in pitchfork edison bulb. Humblebrag scenester heirloom cloud bread plaid butcher deep v pariatur. Tousled cillum bespoke incididunt, banh mi poke street art tumeric squid consequat velit kale chips ullamco. Bicycle rights eu franzen, subway tile knausgaard banjo schlitz. Next level shaman disrupt sint, brunch dolore beard id deserunt cardigan shabby chic. Leggings anim iceland butcher in farm-to-table, ennui 3 wolf moon four loko ramps quinoa ex poutine. Cold-pressed kinfolk pinterest mustache church-key iceland adipisicing palo santo whatever retro. Et man braid roof party, affogato +1 typewriter mumblecore tempor pork belly. Squid kitsch humblebrag, chillwave nulla chia migas bushwick adipisicing cray. Hoodie et microdosing YOLO. Mixtape pitchfork raw denim irure. Fixie sriracha nulla swag. Heirloom franzen glossier pour-over."
    },
    {
        name: "Seljalandsfoss Waterfall",
        image: "https://images.unsplash.com/photo-1476610182048-b716b8518aae?dpr=1&auto=compress,format&fit=crop&w=1127&h=&q=80&cs=tinysrgb&crop=",
        description: "Knausgaard officia man bun franzen adaptogen skateboard gluten-free cronut kitsch bitters. Keffiyeh cliche ennui woke williamsburg sartorial. Celiac squid palo santo elit intelligentsia, ramps kombucha bicycle rights single-origin coffee in pitchfork edison bulb. Humblebrag scenester heirloom cloud bread plaid butcher deep v pariatur. Tousled cillum bespoke incididunt, banh mi poke street art tumeric squid consequat velit kale chips ullamco. Bicycle rights eu franzen, subway tile knausgaard banjo schlitz. Next level shaman disrupt sint, brunch dolore beard id deserunt cardigan shabby chic. Leggings anim iceland butcher in farm-to-table, ennui 3 wolf moon four loko ramps quinoa ex poutine. Cold-pressed kinfolk pinterest mustache church-key iceland adipisicing palo santo whatever retro. Et man braid roof party, affogato +1 typewriter mumblecore tempor pork belly. Squid kitsch humblebrag, chillwave nulla chia migas bushwick adipisicing cray. Hoodie et microdosing YOLO. Mixtape pitchfork raw denim irure. Fixie sriracha nulla swag. Heirloom franzen glossier pour-over."
    },
];

function seedDB() {
    //remove all campgrounds
    Camp.remove({}, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Campgrounds removed!");
            //add a few campgrounds
            data.forEach(function(seed){
                Camp.create(seed, function(err, newCamp){
                    if(err){
                        console.log(err);
                    } else {
                        console.log("New camp created: " + newCamp.name);
                        //create a comment on each campground
                        Comment.create(
                            {
                                text: "What an idyllic locale!",
                                author: "Chimamanda"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    newCamp.comments.push(comment);
                                    newCamp.save();
                                    console.log("Created new comment: " + comment);
                                }
                            });
                    }
                });
            });
        }
    });
}
    
    
//add a few comments

module.exports = seedDB;