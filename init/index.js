const mongoose = require('mongoose');
const initData = require('./data');
const Listing = require('../models/Listing');
const MONGO_URL = 'mongodb://localhost:27017/sahil';

main()
.then(() =>
     console.log('Database connected!'))
.catch(err =>
     console.log(err));

async function main() {
await mongoose.connect(MONGO_URL);
 console.log('Database connected!');
}

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log('Data was initialized!');
}
initDB();