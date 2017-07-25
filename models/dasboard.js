var router = require('express').Router(),
    connection=require('../connection'),
    sequelize= connection.sequelize

var patient=connection.seq.define('patient',{
    patient_name:{
        type:sequelize.STRING,
        allowNull:false
    },
    blood_grp:{
        type: sequelize.STRING,
        allowNull:false
    },

    doctor_name:{
        type:sequelize.STRING,
        allowNull: false
    },

    hospital: {
        type: sequelize.STRING,
        allowNull: false
    },

    unit_of_blood: {
        type: sequelize.INTEGER,
        allowNull: false
    },

    city:{
        type: sequelize.STRING,
        allowNull: false
    },
    
    /*prescription:{
        //allowNull: false,
        type: sequelize.BLOB('long')
    },
    */
    cost:{
        type: sequelize.FLOAT,
        allowNull: false
    },
    mobile_no:{
    	type: sequelize.STRING,
    	allowNull: false
    }   
},{
    freezeTableName: true,
    timestamps: true
})

patient.sync();

router.post('/submit_patient_detail',function(req,res){
    databody= req.body;
    console.log(databody);
    patient.create({
        patient_name: databody.patient_name,
        blood_grp: databody.blood_grp,
        doctor_name: databody.doctor_name,
        hospital: databody.hospital,
        unit_of_blood: databody.unit_of_blood,
        city: databody.city,
        //prescription: databody.prescription,
        cost: databody.cost,
        mobile_no: databody.mobile_no,
    }).then(function(){
        res.send("Your request has been successfully saved!!!");
    });
});

router.post('/get_patient_data',function(req,res){
	databody=req.body;
	patient.findAll({
		where:{
			mobile_no: databody.mobile_no
		}
	}).then(function(patient){
		res.send(patient);
		console.log(patient);
	})
});

module.exports=router;