var myemail;
var router = require('express').Router(),
    nodemailer=require('nodemailer')
    connection= require('../connection'),
    wellknown = require('nodemailer-wellknown'),
    sequelize=connection.sequelize,


signUp=connection.seq.define('signUp',{
    blood_id:{
        type: sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
	user_name:{
		type:sequelize.STRING,
		allowNull:true
	},
	user_email:{
		type:sequelize.STRING,
		allowNull:true
	},
    user_mobile_no:{
        type:sequelize.STRING,
        allowNull:false
    },
    user_blood_grp:{
        type: sequelize.STRING,
        allowNull: true
    },
    user_dob:{
        type:sequelize.DATEONLY,
        allowNull:true
    },
    user_gender:{
        type:sequelize.STRING,
        allowNull:true
    },
    user_password:{
        type:sequelize.STRING,
        allowNull:true
    },
    user_confirm_password:{
        type:sequelize.STRING,
        allowNull:true,
    }
},
{
	freezeTableName:true,
	timestamps:true,

})


signUp.sync();

//for Checking whether email exists in db 
router.post('/check',function(req,res){
    data_body=req.body;
    signUp.find({
        where:{
          user_mobile_no: data_body.user_mobile_no 
        }
    }).then((signUp)=>{
        if(signUp)
        {
            res.send("true");
        }
        else
        {
            res.send("false");
        }
    })
})


//for submitting details
router.post('/signup',(req,res)=>{
    data_body=req.body;
    console.log(data_body);
    signUp.create({
    user_name:data_body.user_name,
    user_email:data_body.user_email,
    user_mobile_no:data_body.user_mobile_no,
    user_blood_grp: data_body.user_blood_grp,
    user_dob: data_body.user_dob,
    user_gender: data_body.user_gender,
    user_password:data_body.user_password,
    user_confirm_password:data_body.user_confirm_password

    }).then(function(signUp){
        var transporter=nodemailer.createTransport({
            service:'Gmail',
            auth:{
                user:'Bloodporttech@gmail.com',
                pass:'Rohan@123'
            }
        });

         var mailOptions={
            from:'Bloodporttech@gmail.com',
            to:data_body.user_email,
            subject:'Mail from Bloodport for successful signup',
            html:'Hello '+data_body.user_name+", " +"You have been successfully registered with BloodPORT."
            };
                
        transporter.sendMail(mailOptions,function(error,info){
            if(error)
                {
                    console.log(error);
                }
                else
                {
                    console.log("mail sent");
                }
        });
        res.send("You have been successfully registered to BloodPORT");
    })   
});

//for emergency user and social signup

router.post('/specialSignUp',function(request,response){
    data_body= request.body;

    signUp.create({
        user_name: data_body.user_name,
        user_email: data_body.user_email,
        user_mobile_no: data_body.user_mobile_no,
        user_blood_grp: data_body.user_blood_grp,
        user_password: data_body.user_pass,
        user_confirm_password: data_body.user_pass,
        user_gender: data_body.user_gender
    }).then(function(signUp){
        var transporter=nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user:'Bloodporttech@gmail.com',
                pass:'Rohan@123'
            }
        });

        var mailOptions={
            from: 'Bloodporttech@gmail.com',
            to: data_body.user_email,
            subject:'Mail from Bloodport for successful signup',
            html:'Hello '+data_body.user_name+", " +"You have been successfully registered with BloodPORT.\n Your password is-"+ data_body.user_pass
        };

        transporter.sendMail(mailOptions,function(err,info){
            if(err)
            {
                console.log(err);
            }
            else
            {
                console.log("mail sent");
            }
        });
        
        response.send("You have been successfully registered to BloodPORT");
    })

    
    
})

//for log in the user
router.post('/login_user',function(req,res){
    data_body=req.body;
    signUp.find({
        where:{
            user_mobile_no: data_body.user_mobile_no
        }
    }).then(function(signUp){
        if(signUp)
        {
            if(signUp.user_password==data_body.user_password)
            {   
                res.send("true");
                
            }
            else
            {
                res.send("Invalid Password");  
            }
        }
        else
        {
            res.send("You are not Registered with BlooPORT, Please SignUp first!!!");
        }
    });
});
//when the user forgets password
router.post('/forgotpassword',function(req,res){
    data_body=req.body;
    myemail=data_body.user_email;
    signUp.find({
        where:{
            user_email: data_body.user_email
        }
    }).then(function(signUp){
        if(signUp){
            console.log("email is provided");

            //sending mail
            var transporter= nodemailer.createTransport({
                service: 'Gmail',
                auth:{
                    user: 'Bloodporttech@gmail.com',
                    pass: 'Rohan@123'
                }
            });

            var mailOptions= {
                from: 'Bloodporttech@gmail.com',
                to: data_body.user_email,
                subject: 'Mail to change your BloodPort password',
                html: 'Hello '+signUp.user_name+", Your old password for BloodPORT is :"+signUp.user_password+"<br><h3>Please change your password to be more secure.</h3>"
            };

            transporter.sendMail(mailOptions,function(err,success){
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    console.log("mail sent");
                    res.send("A mail has been sent to your registered email");
                }
            });
        }
        else{
            res.send("Please provide a valid e-mail");
        }
    })
});

//when the user wants to update his password
/*router.post('/updatePassword',function(req,res){
    data_body=req.body;
    if(data_body.user_password==data_body.user_confirm_password)
    {
        console.log("passwords match");
        signUp.update({
            user_password:data_body.user_password
        },
        {
            where:{
                user_email: 'sakshi781996@gmail.com'
            }
        }).then(()=>{
            res.send("password updated");
            var transporter=nodemailer.createTransport({
                service:'Gmail',
                auth:{
                    user:'shourya301996@gmail.com',
                    pass:'secureme'
                }
            });

            var mailOptions={
                from:'shourya301996@gmail.com',
                to: 'sakshi781996@gmail.com',
                subject:'Confirmation mail for successful Password change',
                text:'Hello User, Your password has been changed successfully'
            } 

            transporter.sendMail(mailOptions,function(err,info){
                if(err)
                {
                    console.log(err);
                }
                else{
                    console.log("Mail has been sent");
                }
            })
        });       
    }
    else
    {
        res.send("Passwords don't match");
    }
})*/


//api for user profile section

router.post('/get_details',function(req,res){
    data_body=req.body;

    signUp.find({
        where:{
            user_mobile_no: data_body.user_mobile_no
        }
    }).then(function(signUp){
        console.log(signUp);
        res.send(signUp);
    })
});

router.post('/update_details',function(req,res){
    data_body=req.body;
    console.log("req is "+req.body.user_email);
    signUp.find({
        where: {
            user_mobile_no: data_body.user_mobile_no
        }
    }).then(function(signUp){
        console.log("updating details of "+data_body.user_mobile_no+" user");

        signUp.update({
            user_name: data_body.user_name,
            user_blood_grp: data_body.user_blood_grp,
            user_email: data_body.user_email,
            user_mobile_no: data_body.user_mobile_no,
            user_dob: data_body.user_dob,
            user_gender: data_body.user_gender
        }).then(function(signUp){
            console.log("fields updated");
            res.send("Your details have been successfully updated");
        })
    })
});

router.post('/modal_check',function(req,res){
    data_body=req.body;
    signUp.find({
        where:{
            user_mobile_no:data_body.user_mobile_no
        }
    }).then((response)=>{
        if(response)
        {
            console.log(response);
            res.send("User exists");
        }
        else
        {   
            console.log(response);
            res.send("new user");
        }
    })
    
})

router.post('/emergency_submit',function(req,res){
    data_body=req.body;

    signUp.create({
        user_mobile_no: data_body.user_mobile_no,
        user_email: data_body.user_email,
        user_blood_grp: data_body.user_blood_grp,
        user_password: data_body.user_pass,
        user_confirm_password: data_body.user_pass
    }).then(function(response){
        res.send("user added");

        var transporter=nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user:'Bloodporttech@gmail.com',
                pass:'Rohan@123'   
            }
        });

        var mailOptions={
            from: 'Bloodporttech@gmail.com',
            to: data_body.user_email,
            subject:'Mail from Bloodport for successful signup',
            html:'Hello '+data_body.user_name+", " +"You have been successfully registered with BloodPORT.\n Your password is-"+ data_body.user_pass 
        };

        transporter.sendMail(mailOptions,function(err,info){
            if(err)
            {
                console.log(err);
            }
            else
            {
                console.log('mail sent');
            }
        })

        res.send("You have been successfully registered to BloodPORT");
    })
})

router.post('/update_modal_details',function(req,res){
    data_body=req.body;

    signUp.find({
        where:{
            user_mobile_no: data_body.user_mobile_no
        }
    }).then(function(signUp){
        console.log('user found');

        signUp.update({
            user_name: data_body.user_name,
            user_dob: data_body.user_dob,
            user_gender: data_body.user_gender
        }).then(function(signUp){
            console.log("updt details");
            res.send("Your details have been successfully updated");
        })
    })
})

module.exports=router;
