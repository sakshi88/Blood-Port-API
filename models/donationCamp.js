var router = require('express').Router(),
    connection=require('../connection'),
    sequelize= connection.sequelize

var camps=connection.seq.define('camps',{
	dateOfDonation:{
		type:sequelize.DATEONLY,
		allowNull:false
	},
	campOrganizer:{
		type:sequelize.STRING,
		allowNull:false
	},
	organizerName:{
		type:sequelize.STRING,
		allowNull:false
	},
	bloodBank:{
		type:sequelize.STRING,
		allowNull:false
	},
	cantactOrganizer:{
		type:sequelize.STRING,
		allowNull:false
	},
	camplocation:{
		type:sequelize.STRING,
		allowNull:false
	},
	timing:{
		type:sequelize.TIME,
		allowNull:false
	}
},
{
	freezeTableName:true,
	timestamps:true
})

camps.sync();

router.post('/addCamps',function(req,res){
	data_body=req.body;
	camps.create({
		campOrganizer:data_body.campOrganizer,
		organizerName:data_body.organizerName,
		bloodBank:data_body.bloodBank,
		cantactOrganizer:data_body.cantactOrganizer,
		camplocation:data_body.camplocation,
		dateOfDonation:data_body.dateOfDonation,
		timing:data_body.timing
	}).then(()=>{
		res.send("data has been saved");
	})
})


router.get('/allCamps',function(req,res){
	camps.findAll().then((camps)=>{
		res.send(camps);
	})
})
router.post('/campbyLocation',function(req,res){
	data_body=req.body
	camps.findAll({
		where:{
			camplocation:data_body.camplocation
		}
	}).then((camps)=>{
		res.send(camps);
		console.log(camps);
	})
})

router.post('/campByDate',function(req,res){
	data_body=req.body;
	camps.findAll({
		where:{
			dateOfDonation:data_body.dateOfDonation
		}
	}).then((camps)=>{
		res.send(camps);
	})
})

router.post('/campByOrganizer',function(req,res){
	data_body=req.body;
	console.log(data_body);
	camps.findAll({
		where:{
			campOrganizer:data_body.campOrganizer
		}
	}).then((camps)=>{
		res.send(camps);
	})
})

router.post('/campByBloodBank',function(req,res){
	data_body=req.body;
	console.log(data_body);
	camps.findAll({
		where:{
			bloodBank:data_body.bloodBank
		}
	}).then((camps)=>{
		res.send(camps);
	})
})


module.exports=router;