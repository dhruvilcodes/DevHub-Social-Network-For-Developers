const express=require("express")
const connectDB=require("./config/db");
const path=require('path');
var cors = require('cors')

const app=express();
app.use(cors())
const PORT=process.env.PORT||5000

connectDB();



//Init middleware
app.use(express.json({extended:false}))
//Define Routes

app.use('/api/users',require("./routes/api/users"));
app.use('/api/auth',require("./routes/api/auth"));
app.use('/api/profile',require("./routes/api/profile"));
app.use('/api/posts',require("./routes/api/posts"));
app.use('/api/groups',require("./routes/api/groups"))

//Serve static assets in production
if(process.env.NODE_ENV==='production')
{
    //Set static folder
    app.use(express.static('client/build'))

    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'));
    })
}


app.listen(PORT,()=>{
    console.log(`Server started on port ${PORT}`)
});