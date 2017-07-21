var express= require('express')
var bodyparser= require('body-parser')
var app=express()

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})

app.use(bodyparser.json())

app.use(bodyparser.urlencoded({
    extended: true
}))
app.get('/',(req,res)=>
{
	res.send("Response OK");
});
app.use('/register',require('./models/patient.js'));

/* api for dashboard*/
app.use('/dashboard',require('./models/dasboard.js'));
/*api for finding donor*/
app.use('/donor',require('./models/findDonor.js'));
app.use('/camps',require('./models/donationCamp.js'))

app.listen(8080,function(){
    console.log("server listening at port 8080");
})
