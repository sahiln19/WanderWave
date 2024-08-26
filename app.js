const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path')
const methodOverride = require('method-override')
const listing = require('./models/listing');
const ejsMate = require('ejs-mate');

const MONGO_URL = 'mongodb://localhost:27017/wanderwave';

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

//index route
app.get("/listings", async (req,res)=> {
    const allListings = await Listing.find({})
    res.render("/listings/index.ejs", {allListings})
});

//new route
app.get("/listings/new", (req,res)=> {
    res.render("/listings/new.ejs")
});

//show route
app.get("/listings/:id", async (req,res)=> {
    const {id} = req.params
    const listing = await Listing.findById(id)
    res.render("/listings/show.ejs", {listing})
});

//Create route
app.post("/listings", async (req,res)=> {
    // const {title, description, price, location, country} = req.body
    let newListing = new Listing(req.body.listing)
    await newListing.save()
    res.redirect(`/listings/${newListing._id}`)
});
//Edit route
app.get("/listings/:id/edit", async (req,res)=> {
    const {id} = req.params
    const listing = await Listing.findById(id)
    res.render("/listings/edit.ejs", {listing})
});

//Update route
app.put("/listings/:id", async (req,res)=> {
    let {id} = req.params
    let deletListing = await Listing.findByIdAndUpdate(id);
    console.log(deletListing)
    res.redirect(`/listings/${id}`)
});

//Delete route
app.delete("/listings/:id", async (req,res)=> {
    let {id} = req.params
    await Listing.findByIdAndDelete(id)
    res.redirect("/listings")
});
app.get("/testListing", async (req, res) => {
    let samplistings = new Listing({
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

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
