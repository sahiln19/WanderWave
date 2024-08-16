const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing');

const  url = 'mongodb://localhost:27017/sahil';

main()
.then(() =>
     console.log('Database connected!'))
.catch(err =>
     console.log(err));


async function main() {
    await mongoose.connect(url);
    console.log('Database connected!');
}
app.listen(5000, () => {
    console.log('Server is running on port 5000');
})

app.get ('/', (req, res) => {
    res.send('Hello, i am sahil');
});

app.get ("/testlisting", async (req, res) => {
    let sampleListing = new Listing({
        title: "Sample Listing",
        description: "This is a sample listing",
        image: "",
        price: 100,
        location: "Sample location",
        country: "Sample country",
    });
    await sampleListing.save()
    console.log("sample was saved")
    res.send ("successfully saved")
})