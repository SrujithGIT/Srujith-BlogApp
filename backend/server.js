const exp=require('express')
const app=exp()
require('dotenv').config()

const mongoClient=require('mongodb').MongoClient;
const path=require('path')

//react bulid deployment 
app.use(exp.static(path.join(__dirname,'../client/build')))

app.use(exp.json())

mongoClient.connect(process.env.DB_URL)
.then(client=>{
    const blogdb=client.db('blogdb')

    const userscollection=blogdb.collection('usercollection')

    const articlescollection=blogdb.collection('articlecollection')
    const authorscollection=blogdb.collection('authorcollection')
    app.set('usercollection',userscollection)
    app.set('articlecollection',articlescollection)
    app.set('authorcollection',authorscollection)
    console.log('DB connection sucess')
})
.catch(err=>console.log("Error in DB connection",err))


//routes
const userApp=require('./APIs/user-api')
const adminApp=require('./APIs/admin-api')
const authorApp=require('./APIs/author-api')


app.use('/user-api',userApp)
app.use('/admin-api',adminApp)
app.use('/author-api',authorApp)

app.use((req,res,next)=>{
    res.sendFile(path.join(__dirname,'../client/build/index.html')) 
})

app.use((err,req,res,next)=>{
    res.send({message:"error",payload:message})
})


const port=process.env.PORT || 4000;
app.listen(port,()=>console.log(`Web server on port ${port}`))