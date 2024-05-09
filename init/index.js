const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

let Mongo_url = 'mongodb://127.0.0.1:27017/wanderlust';

main()
  .then((res) => {
    console.log("connection establish !");
  })
  .catch((err) => {
    console.log(err);
  });

  

async function main(){
    await mongoose.connect(Mongo_url);
}

const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"6638c7a8f43a23e321351b0d"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();
