var myemail;
var router = require('express').Router(),
    nodemailer=require('nodemailer')
    connection= require('../connection'),
    wellknown = require('nodemailer-wellknown'),
    sequelize=connection.sequelize,


signUp=connection.seq.define('signUp',{
	user_name:{
		type:sequelize.STRING,
		allowNUll:false,
	},
	user_mobile_no:{
		type:sequelize.INTEGER,
		allowNUll:false,
	},
	user_email:{
		type:sequelize.STRING,
		allowNUll:false,
	},

	user_password:{
		type:sequelize.STRING,
		allowNUll:false,
	},
	user_confirm_password:{
		type:sequelize.STRING,
		allowNUll:false,
	}
},
{
	freezeTableName:true,
	timestamps:true,

})


signUp.sync();

//for submitting details
router.post('/signup',(req,res)=>{
	data_body=req.body;
	console.log(data_body);
	var check=false;
	
	signUp.find({
		where:{
			user_email:data_body.user_email
		}
	}).then((signUp)=>{
		if(signUp)
		{
			check=false;
		}
		else
		{
			check=true;
		}
	}).then(()=>{
		if(check)
		{
			if(data_body.user_password==data_body.user_confirm_password)
			{
				signUp.create
				({
					user_name:data_body.user_name,
					user_mobile_no:data_body.user_mobile_no,
					user_email:data_body.user_email,
					user_password:data_body.user_password,
					user_confirm_password:data_body.user_confirm_password
				});
				var transporter=nodemailer.createTransport({
					service:'Gmail',
					auth:{
						user:'shourya301996@gmail.com',
						pass:'secureme'
					}
				});

				var mailOptions={
					from:'shourya301996@gmail.com',
					to:data_body.user_email,
					subject:'Mail from Bloodport for successful signup',
					html:'<h1>Hello User, You have been registered with Bloodport</h1>'
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
			}
			else
			{
				res.send("Password and Confirm Password doesnt match!, Please re-neter password!");
			}	
		}
		else
		{
			console.log("E-mail Id " +data_body.user_email+" already exists!!, Sorry Can't signup!");
			res.send("E-mail Id " +data_body.user_email+" already exists!!, Please signup with a different email");
		}

	})
})

//for log in the user
router.post('/login_user',function(req,res){
    data_body=req.body;
    var found =false;
    console.log("checking details");

    signUp.find({
        where:{
            user_email: data_body.user_email
        }
    }).then(function(signUp){
        if(signUp)
        {
            console.log("user found");
            if(signUp.user_password==data_body.user_password)
            {
                found=true;
                console.log("you are logged in");
                res.send("User has been successfully logged in");
            }
            else{
                found=false;
                res.send("Password Doesn't match, Please enter a correct pasword");
            }
        }
        else{
            found=false;
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
                    user: 'shourya301996@gmail.com',
                    pass: 'secureme'
                }
            });

            var mailOptions= {
                from: 'shourya301996@gmail.com',
                to: data_body.user_email,
                subject: 'Mail to change your BloodPort password',
                text: 'Hello user, change the password. the link is- http://localhost:8080/login/updatePassword'
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
router.post('/updatePassword',function(req,res){
    data_body=req.body;
    if(data_body.user_password==data_body.user_confirm_password)
    {
        console.log("passwords match");
        signUp.update({
            user_password:data_body.user_password
        },
        {
            where:{
                user_email: myemail
            }
        }).then(()=>{
            console.log("password updated");
            var transporter=nodemailer.createTransport({
                service:'Gmail',
                auth:{
                    user:'shourya301996@gmail.com',
                    pass:'secureme'
                }
            });

            var mailOptions={
                from:'shourya301996@gmail.com',
                to:myemail,
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
        console.log("Passwords don't match");
    }
})

module.exports=router;
