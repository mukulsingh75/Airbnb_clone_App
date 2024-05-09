const Listing = require("./models/listing.js");
const listingSchema = require("./SchemaValidation/listingVal.js");
const reviewSchema = require("./SchemaValidation/reviewVal.js");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js");


module.exports.isLoggedIn = (req,res,next) => {
    console.log("logged-in1");

  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in");
    return res.redirect("/login");
  }
  console.log("logged-in2");
  next();
};

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
      req.flash("error","You are not owner of this listings");
      return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing  = (req,res,next)=>{
    console.log(req.body);
    let {error} = listingSchema.validate(req.body);
    if(error){
      let errMsg = error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errMsg)
    }else{
      next();
    }
  };

module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
      let errMsg = error.details.map((e)=>e.message).join(",");
      throw new ExpressError(400,errMsg);
    }else{
      next();
    }
  };

module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id,reviewId} = req.params;
    console.log("reviewauthor");
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}  
  


