const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path')
const methodOverride = require('method-override')
const listing = require('./models/listing');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync');
const expressError = require('./utils/expressError');
const {listingSchema} = require('./schema');
const MONGO_URL = 'mongodb://localhost:27017/WanderWave';

async function main() {
    await mongoose.connect(MONGO_URL);
    console.log('Database connected!');
}

main().catch(err => {
    console.log(err);
});

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate)
app.use(express.static(path.join(__dirname, '/public')))

app.get("/", (req, res) => {
    res.send("Hi, I am root");
});

const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body)
    if(error){
        let errMsg = error.details.map((el) => el.message).join(',')
        throw new expressError(400,errMsg)   
    }else{
        next()
    }
}
    
//index route
app.get("/listings", wrapAsync(async (req,res)=> {
    const allListings = await listing.find({})
    res.render("listings/index", {allListings})
}));

//new route
app.get("/listings/new", (req,res)=> {
    res.render("listings/new.ejs")
});

//show route
app.get("/listings/:id", wrapAsync(async (req,res)=> {
    const {id} = req.params
    const listing = await listing.findById(id)
    res.render("/listings/show.ejs", {listing})
}));

//Create route
app.post("/listings",validateListing, wrapAsync (async (req,res,next)=> {
    // const {title, description, price, location, country} = req.body   
    let newListing = new listing(req.body.listing)
    await newListing.save()
    res.redirect(`/listings/${newListing._id}`)
    } 
)) ;
//Edit route
app.get("/listings/:id/edit", wrapAsync (async (req,res)=> {
    const {id} = req.params
    const listing = await listing.findById(id)
    res.render("/listings/edit.ejs", {listing})
}));

//Update route
app.put("/listings/:id",validateListing,  wrapAsync (async (req,res)=> {
    let {id} = req.params
    let deletListing = await listing.findByIdAndUpdate(id);
    console.log(deletListing)
    res.redirect(`/listings/${id}`)
}));

//Delete route
app.delete("/listings/:id", wrapAsync (async (req,res)=> {
    let {id} = req.params
    await listing.findByIdAndDelete(id)
    res.redirect("/listings")
})); 
app.get("/testListing", async (req, res) => {
    let samplistings = new listing({
        title: "SampTitle",
        description: "SampDesc",
        price: 100,
        image : "",
        location: "SampLocation",
        country: "SampCountry"
    });

    await samplistings.save();  // Save the listing first
    console.log("Listing saved");

    // Send the response to the client
    res.send("Listing saved successfully!");
});

app.all("*", (req,res,next) => {    
    next(new expressError( 404, "Page Not Found!"))
})
 
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).send(message);
});


app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
