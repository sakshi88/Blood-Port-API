var router = require('express').Router(),
    connection=require('../connection'),
    sequelize= connection.sequelize

var donors=connection.seq.define('Donors',{
	donor_name:{
		type:sequelize.STRING,
		allowNUll:false
	},
	donor_bloodgrp:{
		type:sequelize.STRING,
		allowNUll:false
	},
	donor_status:{
		type:sequelize.STRING,
		allowNUll:false
	},
	donor_location:{
		type:sequelize.STRING,
		allowNUll:false
	}
},
{
	freezeTableName:true,
	timestamps:true
})
donors.sync();
router.post('/addData',function(req,res){
	data_body=req.body;
	donors.create({
		donor_name:data_body.donor_name,
		donor_bloodgrp:data_body.donor_bloodgrp,
		donor_status:data_body.donor_status,
		donor_location:data_body.donor_location
	}).then(()=>{
		res.send("Your details have been submitted successfully");
	})
});
router.get('/allDonors',function(req,res)
{
	data_body=req.body;
	donors.findAll()
	.then((donors)=>{
		res.send(donors);
	})
})

router.post('/sortByLocation',function(req,res){
	data_body=req.body;
	donors.findAll({
		where:{
			donor_location:data_body.donor_location,
			donor_status:data_body.donor_status
		}
	}).then((donors)=>{
		res.send(donors);
		console.log(res);
	})
})

router.post('/sortByBloodgrp',function(req,res){
	data_body=req.body;
	donors.findAll({
		where:{
			donor_bloodgrp:data_body.donor_bloodgrp,
			donor_status:data_body.donor_status
		}
	}).then((donors)=>{
		res.send(donors);
	})
})

router.post('/sortByStatus',function(req,res){
	data_body=req.body;
	donors.findAll({
		where:{
			donor_status:data_body.donor_status,

		}
	}).then((donors)=>{
		res.send(donors);
	})
})
module.exports=router;