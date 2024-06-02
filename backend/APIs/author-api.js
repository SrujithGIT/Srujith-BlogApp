const exp=require('express');
const authorApp=exp.Router();  
const expressAsyncHandler=require("express-async-handler")
const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken')
const verifyToken=require('../Middlewares/verifyToken')
require('dotenv').config()
     let authorcollection;
     let articlecollection;
     authorApp.use((req,res,next)=>{
      authorcollection=req.app.get('authorcollection')
      articlecollection=req.app.get('articlecollection')
      next()
     })
//Register
authorApp.post('/authors',expressAsyncHandler(async(req,res)=>{
   const newAuthor=req.body;
   const dbauthor=await authorcollection.findOne({username:newAuthor.username})
   if(dbauthor!= null){
       res.send({message:"Author Already existed"})
   }else{ 
       const hashedPassword=await bcryptjs.hash(newAuthor.password,6)   
       newAuthor.password=hashedPassword; 
       await authorcollection.insertOne(newAuthor)
       res.send({message:"Author Created Successfully"})
   }
}));

// login
authorApp.post('/login',expressAsyncHandler(async(req,res)=>{
   const authorCred=req.body;
   const dbauthor= await authorcollection.findOne({username:authorCred.username})
   if(dbauthor===null){
       res.send({message:"Invalid username"})
   }else{
       
      const status= await bcryptjs.compare(authorCred.password,dbauthor.password)
      if(status===false){
       res.send({message:"Invalid password"})
      }else{
   
       const signedToken=jwt.sign({username:dbauthor.authorname},process.env.SECRET_KEY,{expiresIn:'1d'})
   
       res.send({message:"login success",token:signedToken,user:dbauthor})
      }
   }
}))


//ADD Articles
authorApp.post('/article',verifyToken,expressAsyncHandler(async(req,res)=>{
   const newArticle=req.body;
   await articlecollection.insertOne(newArticle)
   //send response
   res.send({message:"New article created"})
}))


//Update artcile 
authorApp.put('/article',verifyToken,expressAsyncHandler(async(req,res)=>{
   const modifiedArticle=req.body;
  let result= await articlecollection.updateOne({articleId:modifiedArticle.articleId},{$set:{...modifiedArticle}})
  let latestArticle=await articlecollection.findOne({articleId:modifiedArticle.articleId})
   res.send({message:"Article modified",article:latestArticle})
}))

//delete an article by article ID
authorApp.put('/article/:articleId',verifyToken,expressAsyncHandler(async(req,res)=>{
   //get articleId from ur
   const artileIdFromUrl=(+req.params.articleId);
    //get article 
    const articleToDelete=req.body;
    if(articleToDelete.status===true){
       let modifiedArt= await articlecollection.findOneAndUpdate({articleId:artileIdFromUrl},{$set:{...articleToDelete,status:false}},{returnDocument:"after"})
       res.send({message:"Article deleted",payload:modifiedArt.status})
    }
    if(articleToDelete.status===false){
        let modifiedArt= await articlecollection.findOneAndUpdate({articleId:artileIdFromUrl},{$set:{...articleToDelete,status:true}},{returnDocument:"after"})
        res.send({message
         :"Article restored",payload:modifiedArt.status})
    }
}))


//read articles of author
authorApp.get('/articles/:username',verifyToken,expressAsyncHandler(async(req,res)=>{
   const username=req.params.username;
   const artclesList=await articlecollection.find({username:username}).toArray()
   res.send({message:"List of atricles",payload:artclesList})

}));



module.exports=authorApp;