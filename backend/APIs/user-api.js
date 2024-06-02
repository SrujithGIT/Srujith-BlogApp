
const exp=require('express');
const userApp=exp.Router();
const bcryptjs=require('bcryptjs')
const expressAsyncHandler=require("express-async-handler")
const jwt=require('jsonwebtoken')
const verifyToken=require('../Middlewares/verifyToken')
require('dotenv').config()

     let usercollection;
      let articlecollection;
     userApp.use((req,res,next)=>{
      usercollection=req.app.get('usercollection')
      articlecollection=req.app.get('articlecollection')
      next()
     })

//registration route
userApp.post('/users',expressAsyncHandler(async(req,res)=>{
   const newUser=req.body;
   const dbuser=await usercollection.findOne({username:newUser.username}) 
   if(dbuser!= null){
       res.send({message:"User Already existed"})
   }else{
       const hashedPassword=await bcryptjs.hash(newUser.password,6)    
       newUser.password=hashedPassword; 
       await usercollection.insertOne(newUser)
       res.send({message:"user created"})
   }
}))


// login
userApp.post('/login',expressAsyncHandler(async(req,res)=>{  
   const userCred=req.body;
   
   const dbuser= await usercollection.findOne({username:userCred.username})
   if(dbuser===null){
       res.send({message:"Invalid username"})
   }else{
      const status= await bcryptjs.compare(userCred.password,dbuser.password)
      if(status===false){
       res.send({message:"Invalid password"})
      }else{
       const signedToken=jwt.sign({username:dbuser.username},process.env.SECRET_KEY,{expiresIn:'1d'});
       res.send({message:"login success",token:signedToken,user:dbuser})
      }
   }
}))



userApp.get('/articles',verifyToken,expressAsyncHandler(async(req,res)=>{
   const articlecollection = req.app.get('articlecollection')
   let articlesList=await articlecollection.find({status:true}).toArray()
   //send response
   res.send({message:"articles",payload:articlesList})
}))




//post comments for an arcicle by atricle id
userApp.post(
   "/comment/:articleId",verifyToken,
   expressAsyncHandler(async (req, res) => {
     //get user comment object
     const userComment = req.body;
     const articleIdFromUrl=(+req.params.articleId);
     let result = await articlecollection.updateOne(
       { articleId: articleIdFromUrl},
       { $addToSet: { comments: userComment } }
     );
     res.send({ message: "Comment posted" });
   })
 ); 
module.exports=userApp;