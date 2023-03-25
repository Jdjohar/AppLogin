var express = require('express');
const fileupload = require("express-fileupload");
const morgan = require("morgan");
const app = require('../app');
const db = require('../db');
var path = require('path');
const { Pool } = require('pg')
const axios = require('axios');
const { response } = require('express');
const ics = require('ics');
const { writeFileSync } = require('fs');
var nodemailer = require('nodemailer');
const ical = require('ical-generator');
const bcrypt = require('bcrypt'); //for hashing passwords
// const flash = require('express-flash');
const passport = require('passport');
const jwtGenerator = require('../utils/jwtGenerator');
const validInfo = require('../db/middleware/validInfo');
const authorization = require('../db/middleware/authorization');
const { bodyParser } = require('body-parser');



var router = express.Router();
// router.all(express.static("/files"));

// Add Access Control Allow Origin headers
// router.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   if (req.method ==='OPTIONS'){
//     res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
//     return res.status(200).json({});
//   }
//   next();
// });


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {page:'Home', menuId:'home'});
});


/* GET About page. */
router.get('/about', function(req, res, next) {
  res.render('about', {page:'About Us', menuId:'about'});
});


/* GET Contact page. */
router.get('/contact', function(req, res, next) {
  res.render('contact', {page:'Contact Us', menuId:'contact'});
});


/* GET Time page. */
router.get('/next', function(req, res, next) {
  res.render('next', {page:'Second ', menuId:'second'});
});


/* GET Services page. */
router.get('/service', function(req, res, next) {
  res.render('service', {page:'service ', menuId:'second'});
});

router.get("/ics.js",  (req, res) => {
console.log("jashan");

});

// using this route .ics file send to user email.
// router.get("/send",  (req, res) => {
//   res.render('send', {page:'send ', menuId:'second'});

//   const output = ` 
  
//   <p>Your ICS file here</p>
//   <a href="www.jdwebservices.com/test.ics">ICS file</a>
//   `;

  
// var transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'deepfilm12@gmail.com',
//     pass: 'Jashan86990'
//   }
// });

// var mailOptions = {
//   from: 'deepfilm12@gmail.com',
//   to: 'jdeep514@gmail.com',
//   subject: 'Merchant Name - Confirmation Email',
//   text: 'That was easy!',
//   html: output
// };

// transporter.sendMail(mailOptions, function(error, info){
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });
  
//   });

router.get("/icsexport",  (req, res) => {
  axios.get("https://nishkamscholarship.herokuapp.comapi/v1/business/1")
  .then((response)=>
    {
      console.log(response.data.data);      
      console.log(response.data.data.business.phonenumber);      
      console.log(response.data.data.service[0].servicename);      

      const business_name = response.data.data.business.business_name;

      // const day = response.data.data.time[0].day_name;
      const phonenumber = response.data.data.business.phonenumber;
      const service = response.data.data.service[0].servicename;
      
      res.render('/icsexport', {

        business_name, phonenumber, service
      });



      // Mail send invites

      var smtpTransport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "jdwebservices1@gmail.com",
            pass: "Jashan86990"
        }
     });


     function contentdetail(description, summary, business_name1, day1, phone_number, service){
      let content = 'BEGIN:VCALENDAR\n' +
      'VERSION:2.0\n' +
      'BEGIN:VEVENT\n' +
      'SUMMARY:'+ summary +'\n' +
      'DTSTART;TZID=Asia/Kolkata:20210123T120000\n' +
      'DTEND;TZID=Asia/Kolkata:20210123T130000\n' +
      'RRULE:FREQ=WEEKLY;BYDAY=SA \n' +
      'LOCATION:JD Web Services \n' +
      'ORGANIZER;CN=deepfilm12@gmail.com:mailto:deepfilm12@gmail.com \n ' +
      'DESCRIPTION:' + description + '\n' +
      'BUSINESSNAME:`business_name` \n' +
      'STATUS:CONFIRMED\n' +
      'SEQUENCE:3\n' +
      'BEGIN:VALARM\n' +
      'TRIGGER:-PT10M\n' +
      'DESCRIPTION:' + description + '\n' +
      'ACTION:DISPLAY\n' +
      'END:VALARM\n' +
      'END:VEVENT\n' +
      'END:VCALENDAR'; 
    
      return content

     }


    let content = contentdetail("This is an email confiramtion for the following appointment:", "This is summary", business_name, phonenumber, service)

     var mailOptions = {
       from: "deepfilm12@gmail.com",
       to: "jdeep514@gmail.com",
       subject: "Merchant Name - Confirmation Email",
       //html: "<h1>Welcome to my website</h1>",
       icalEvent: {
        contentType: 'text/calendar; charset="utf-8"; method=REQUEST',
         filename: 'invitation.ics',
         method: 'request',
         content: content
     }
       
     }
     smtpTransport.sendMail(mailOptions, function (error, response) {
       if (error) {
           console.log(error);
       } else {
           console.log("Message sent: " , response);
       }
     })
     
     //send obj
     
     async function sendemail(sendto,sendfrom, subject, htmlbody) {
         mailOptions = {
             from: sendfrom,
             to: sendto,
             subject: subject,
             html: htmlbody,
     
         }
     smtpTransport.sendMail(mailOptions, function (error, response) {
             if (error) {
                 console.log(error);
             } else {
                 console.log("Message sent: " , response);
             }
         })
     }
     module.exports = {
         sendemail,
     };





      // End Mail send invites










    })
    .catch((err)=>{
      console.log(err);
    });

})


// Nishkam Website test API
router.get("/api/v1/testapi", async (req, res) => {
  
  try{
    const results = await db.query("select * from students");
    // console.log(results);
    res.status(200).json({
      status: "success 2",
     
    });

  }catch (err) {
    console.log(err);
  }
});

// Student Verify API
router.get("/api/v1/verify", async (req, res) => {
  let {email,check} = req.query;

  const hashedpassword = bcrypt.compare(email, check);
  
  if(!hashedpassword) {
    return res.status(401).json("Not Validate.");
}else{
  const results = await db.query(`SELECT * FROM login_users WHERE useremail = $1`, [email]);
  if(results.rows.length > 0){
    const applicationreportresults = await db.query(`UPDATE login_users SET emailverify = 'verified' WHERE stuemail = $1`, [email]) ;
    res.status(200).json({
      status: "failed",
      message:  "Email Verified Successfully"
    })
  } else {
    res.status(200).json({
      status: "failed",
      message:  "Email id Not Exist"
    })
  }
}

});
// Student Signup API
router.post("/api/v1/applogin/signup", async (req, res, next) => {
  let signinwith = "Email"
  let {name,email,password,mobile, emailverify} = req.body;

  let hashedpassword = await bcrypt.hash(password, 10);
  const results = await db.query(`SELECT * FROM login_users WHERE useremail = $1`, [email]);
  if(results.rows.length > 0){
    res.status(200).json({
      status: "failed",
      message:  "Email id Already Exist"
    })
  } else {
    const newUser = await db.query(
      `INSERT INTO login_users(username, useremail, userpassword,userloginwith,usermobile,emailverify)
      VALUES($1, $2, $3, $4,$5,$6) RETURNING id
      `, [name, email, hashedpassword, signinwith,mobile, emailverify]
    )
    console.log(newUser,"New User Added!");
    const lastid = newUser.rows[0].id
    if(lastid > 0)
    {
      let hashedemail = await bcrypt.hash(email, 10);
      console.log(hashedemail, "hashedemail"); 

      
      var transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "jdeep514@gmail.com",
            pass: "snbkzokkzxuqghxi"
        }
     });

     let info = await transporter.sendMail({
      from: '"Login App 👻" <jdeep514@gmail.com>', // sender address
      to: `${email}`, // list of receivers
      subject: "Verification Email - Login App", // Subject line
      // text: `Hello ${results.rows[0].name}, Your New Password is ${hashedemail}`, // plain text body
      html: ` <!DOCTYPE html>

      <html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
      <head>
      <title></title>
      <meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
      <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
      </head>
      <body style="background-color: #ffffff; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
      <div style="font-size: 14px; mso-line-height-alt: 16.8px; color: #8d8a8a; line-height: 1.2; font-family: Arial, Helvetica Neue, Helvetica, sans-serif;">
<p style="margin: 0; font-size: 14px;"><span style="">Dear `+name+`, <br/><br/>Thanks for being part of family</p>
<a href="https://stormy-teal-cuttlefish.cyclic.app/api/v1/verify?email=`+email+`&check=`+hashedemail+`" style="text-decoration: none;" target="_blank">Verify Now</a>
</div>
      </body>
      </html>` // html body
    });

    console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));




    res.status(200).json({
      status: "success",
      data: results.rows,
      message: "Registered"
    });
    }else{
      res.status(200).json({
        status: "failed",
        message: "Try Again..."
      });
    }
  }


});

// Normal login Scholarship
router.post("/api/v1/scholarship/login",function(req,res,next){
  console.log('Login 1')
  passport.authenticate("local", function(err, user, info) {
    if(err) {
      return next(err);
    }
    console.log(info.message, 'Login 1')
    console.log(user, 'Login 1')
    
    if(!user) {
      return res.status(401).json({
        status: "failure",
        message: info.message,
      });
    }
    return res.status(200).json({
      status: "success",
      message: `Welcome ${user.stuname}, Nishkam Scholarship Automation`,
      data: user
    });
    
  })(req, res, next);
}
);


//Login with Google or Facebook
router.post("/api/v1/scholarship/social-login", async(req,res)=> {
  //console.log("req: ",req);
  const name = req.body.name;
  const email = req.body.email;
  const id = req.body.id;
  const img = req.body.img;
  const signinwith = req.body.signinwith;
  // const googleId = req.body.googleId;

  const googleUser = await db.query(`SELECT * FROM students WHERE socialid = $1`, [id]);
  console.log(googleUser, "googleUser");
  if(googleUser.rows.length > 0){
    res.status(200).json({
      status: "success",
      data: googleUser.rows[0],
      redirect: "/"
    })
  } else {
    var newUser = await db.query(`INSERT INTO students(stuname, stuemail, socialid, loginwith) VALUES($1, $2, $3, $4)`, [name, email, id, signinwith]);
    const googleUser = await db.query(`SELECT * FROM students WHERE stuemail = $1`, [email]);
  console.log(googleUser, "googleUser");
    res.status(200).json({
      status: "success",
      data: googleUser.rows[0],
      redirect: "/"
    })
  }
})






// Application Form
router.post("/api/v1/scholarship/collegereport", async (req, res) => {
  try{
    let {stuid,applicantid,nameofstudent,fathername,studentaddress,district,tehsil,pincode,phonenumber,emailid,nameofthecollege,addressofthecollege,nameoftheuniversity,nameoftheprincipal,nameoftheprincipalphone,nameoftheprincipalemail,familyincome,receivingfinancialaidyesno,receivingfinancialaidorganization,receivingfinancialaidacademicyear,academicyeardetail,prevoiusyeardetail,tutionfee,developmentfee,examinationfee,otherfee,totalfee,transportfee,refundablefee,hostelfee,grandfee} = req.body;
    const results = await db.query(`INSERT INTO collegereport(stuid,applicantid,nameofstudent,fathername,studentaddress,district,tehsil,pincode,phonenumber,emailid,nameofthecollege,addressofthecollege,nameoftheuniversity,nameoftheprincipal,nameoftheprincipalphone,nameoftheprincipalemail,familyincome,receivingfinancialaidyesno,receivingfinancialaidorganization,receivingfinancialaidacademicyear,academicyeardetail,prevoiusyeardetail,tutionfee,developmentfee,examinationfee,otherfee,totalfee,transportfee,refundablefee,hostelfee,grandfee)VALUES($1, $2, $3, $4, $5, $6, $7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31)`, [stuid,applicantid,nameofstudent,fathername,studentaddress,district,tehsil,pincode,phonenumber,emailid,nameofthecollege,addressofthecollege,nameoftheuniversity,nameoftheprincipal,nameoftheprincipalphone,nameoftheprincipalemail,familyincome,receivingfinancialaidyesno,receivingfinancialaidorganization,receivingfinancialaidacademicyear,academicyeardetail,prevoiusyeardetail,tutionfee,developmentfee,examinationfee,otherfee,totalfee,transportfee,refundablefee,hostelfee,grandfee]);
    console.log(results);
    const academicyearapp = new Date().getFullYear().toString()
    const applicationreportgoogleUser = await db.query(`SELECT * FROM applicationreport WHERE stuid = $1 AND academicyear = $2`, [stuid.toString(),academicyearapp]);
  console.log(applicationreportgoogleUser, "googleUser");
  if(applicationreportgoogleUser.rows.length > 0){
    const applicationreportresults = await db.query(`UPDATE applicationreport SET currentstatus = $1, applicationlock = $2 WHERE stuid = $3 AND academicyear = $4`, ['collegereport','true',stuid.toString(),academicyearapp]) ;
  }else{
    const applicationreportresults = await db.query(`INSERT INTO applicationreport(stuid,applicantid,currentstatus,applicationlock,academicyear)
    VALUES($1, $2, $3, $4, $5) RETURNING id`, [stuid.toString(),applicantid.toString(),'collegereport','true',academicyearapp]);
  }



    res.status(200).json({
      status: "success",
      results: results.rows[0],
      data:{
        business:results.rows,
      },
    });

  }catch (err) {
    console.log(err);
  }
});


// college report Form
router.post("/api/v1/scholarship/updatenewapplication", async (req, res) => {
  try{
    let {stuid,categoryname,catid,appid,formatname} = req.body;
    console.log(req.body, "Update req.body")
    let {fullname,firstname,middlename,lastname,dob,religion,castecat,gender,contactno,email,raddress,district,tehsil,stustate,pincode,residing,Fathername,fatherfirstname,fathermiddlename,fatherlastname,Fathereducation,Fatheroccupation,Fatherannualincome,mothername,motherfirstname,mothermiddlename,motherlastname,mothereducation,motheroccupation,motherannualincome,brothersisterdetail,rusticatedyesno,rusticatedyesdetail,shdfrequestyesno,shdfrequestyesdetail,examinationspasseddetail,academicrecorddetail,scholarshipisrequested,duration,admission,completion,collegeUniversityname,collegeUniversityaddress,collegeUniversitytype,collegeUniversitystudyingatpresent,achievementsscholarshipmedal,achievementsmeritcertificate,achievementshobbies,referencesperson,justification,detailsofbankaccount,familyoccupationname,familyoccupationfather,familyoccupationmother,familyassetsowned,familyagricultureassets,familylivesto,knowscholarship,interviewtimeslot,interviewcenter,contactno2} = req.body;
    // const results = await db.query(`INSERT INTO applicationdata(stuid,catid,catname,formatname,fullname,dob,religion,castecat,gender,contactno,email,raddress,district,tehsil,stustate,pincode,residing,Fathername,Fathereducation,Fatheroccupation,Fatherannualincome,mothername,mothereducation,motheroccupation,motherannualincome,brothersisterdetail,rusticatedyesno,rusticatedyesdetail,shdfrequestyesno,shdfrequestyesdetail,examinationspasseddetail,academicrecorddetail,scholarshipisrequested,duration,admission,completion,collegeUniversityname,collegeUniversityaddress,collegeUniversitytype,collegeUniversitystudyingatpresent,achievementsscholarshipmedal,achievementsmeritcertificate,achievementshobbies,referencesperson,justification,detailsofbankaccount,familyoccupationname,familyoccupationfather,familyoccupationmother,familyassetsowned,familyagricultureassets,familylivesto,knowscholarship,interviewtimeslot,interviewcenter)VALUES($1, $2, $3, $4, $5, $6, $7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36,$37,$38,$39,$40,$41,$42,$43,$44,$45,$46,$47,$48,$49,$50,$51,$52,$53,$54, $55) RETURNING id`, [stuid,catid,categoryname,formatname,fullname,dob,religion,castecat,gender,contactno,email,raddress,,firstname,middlename,lastname,district,tehsil,stustate,pincode,residing,Fathername,Fathereducation,Fatheroccupation,Fatherannualincome,mothername,mothereducation,motheroccupation,motherannualincome,brothersisterdetail,rusticatedyesno,rusticatedyesdetail,shdfrequestyesno,shdfrequestyesdetail,examinationspasseddetail,academicrecorddetail,scholarshipisrequested,duration,admission,completion,collegeUniversityname,collegeUniversityaddress,collegeUniversitytype,collegeUniversitystudyingatpresent,achievementsscholarshipmedal,achievementsmeritcertificate,achievementshobbies,referencesperson,justification,detailsofbankaccount,familyoccupationname,familyoccupationfather,familyoccupationmother,familyassetsowned,familyagricultureassets,familylivesto,knowscholarship,interviewtimeslot,interviewcenter]);
    const results = await db.query(`UPDATE applicationdata SET stuid = $1,catid = $2,catname = $3,formatname = $4,fullname = $5,dob = $6,religion = $7,castecat = $8,gender = $9,contactno = $10,email = $11,raddress = $12,district = $13,tehsil = $14,stustate = $15,pincode = $16,residing = $17,Fathername = $18,Fathereducation = $19,Fatheroccupation = $20,Fatherannualincome = $21,mothername = $22,mothereducation = $23,motheroccupation = $24,motherannualincome = $25,brothersisterdetail = $26,rusticatedyesno = $27,rusticatedyesdetail = $28,shdfrequestyesno = $29,shdfrequestyesdetail = $30,examinationspasseddetail = $31,academicrecorddetail = $32,scholarshipisrequested = $33,duration = $34,admission = $35,completion = $36,collegeUniversityname = $37,collegeUniversityaddress = $38,collegeUniversitytype = $39,collegeUniversitystudyingatpresent = $40,achievementsscholarshipmedal = $41,achievementsmeritcertificate = $42,achievementshobbies = $43,referencesperson = $44,justification = $45,detailsofbankaccount = $46,familyoccupationname = $47,familyoccupationfather = $48,familyoccupationmother = $49,familyassetsowned = $50,familyagricultureassets = $51,familylivesto = $52,knowscholarship = $53,interviewtimeslot = $54,interviewcenter = $55, contactno2 = $56,firstname = $57,middlename = $58,lastname = $59,fatherfirstname = $60,fathermiddlename = $61,fatherlastname = $62,motherfirstname = $63,mothermiddlename = $64,motherlastname = $65  WHERE id = $66 RETURNING id`, [stuid,catid,categoryname,formatname,fullname,dob,religion,castecat,gender,contactno,email,raddress,district,tehsil,stustate,pincode,residing,Fathername,Fathereducation,Fatheroccupation,Fatherannualincome,mothername,mothereducation,motheroccupation,motherannualincome,brothersisterdetail,rusticatedyesno,rusticatedyesdetail,shdfrequestyesno,shdfrequestyesdetail,examinationspasseddetail,academicrecorddetail,scholarshipisrequested,duration,admission,completion,collegeUniversityname,collegeUniversityaddress,collegeUniversitytype,collegeUniversitystudyingatpresent,achievementsscholarshipmedal,achievementsmeritcertificate,achievementshobbies,referencesperson,justification,detailsofbankaccount,familyoccupationname,familyoccupationfather,familyoccupationmother,familyassetsowned,familyagricultureassets,familylivesto,knowscholarship,interviewtimeslot,interviewcenter, contactno2,firstname,middlename,lastname,fatherfirstname,fathermiddlename,fatherlastname,motherfirstname,mothermiddlename,motherlastname,appid]);
    console.log(results);
    

    // res.status(200).json({
    //   status: "success",
    //   lastid: appid
    // });
    const updateresults = await db.query(`UPDATE studentcategory SET appid = $1 WHERE id = $2 RETURNING id`, [appid,catid]) ;
    const academicyearapp = new Date().getFullYear().toString()
    const applicationreportgoogleUser = await db.query(`SELECT * FROM applicationreport WHERE stuid = $1 AND academicyear = $2`, [stuid.toString(),academicyearapp]);
  console.log(applicationreportgoogleUser, "googleUser");
  if(applicationreportgoogleUser.rows.length > 0){
    const applicationreportresults = await db.query(`UPDATE applicationreport SET currentstatus = $1, applicationlock = $2 WHERE stuid = $3 AND academicyear = $4`, ['applicationform','false',stuid.toString(),academicyearapp]) ;
  }else{
    const applicationreportresults = await db.query(`INSERT INTO applicationreport(stuid,applicantid,currentstatus,applicationlock,academicyear)
    VALUES($1, $2, $3, $4, $5) RETURNING id`, [stuid.toString(),appid.toString(),'applicationform','false',academicyearapp]);
  }



    res.status(200).json({
      status: "success",
      catidd: catid,
      catidds: updateresults.rows,
      applicationidd: appid,
      lastid: appid
    });

    console.log(catid,appid)
    console.log(updateresults.rows)

  }catch (err) {
    console.log(err);
  }
});

// college report Form
router.post("/api/v1/scholarship/newapplication", async (req, res) => {
  try{
    let {stuid,categoryname,formatname} = req.body;
console.log(req.body, "New App req.body")
    const catresults = await db.query(`INSERT INTO studentcategory(stuid,categoryname,formatname)VALUES($1, $2, $3) RETURNING id`, [stuid,categoryname,formatname]);
    console.log(catresults, "Category id's");
    // res.status(200).json({
    //   status: "success",
    //   lastCatid: catresults.rows[0].id,
    //   data:{
    //     business:catresults.rows,
    //   },
    // });

const catid  = catresults.rows[0].id
    let {fullname,firstname,middlename,lastname,dob,religion,castecat,gender,contactno,contactno2,email,raddress,district,tehsil,stustate,pincode,residing,Fathername,Fathereducation,Fatheroccupation,Fatherannualincome,mothername,mothereducation,motheroccupation,motherannualincome,brothersisterdetail,rusticatedyesno,rusticatedyesdetail,shdfrequestyesno,shdfrequestyesdetail,examinationspasseddetail,academicrecorddetail,scholarshipisrequested,duration,admission,completion,collegeUniversityname,collegeUniversityaddress,collegeUniversitytype,collegeUniversitystudyingatpresent,achievementsscholarshipmedal,achievementsmeritcertificate,achievementshobbies,referencesperson,justification,detailsofbankaccount,familyoccupationname,familyoccupationfather,familyoccupationmother,familyassetsowned,familyagricultureassets,familylivesto,knowscholarship,interviewtimeslot,interviewcenter} = req.body;
    const results = await db.query(`INSERT INTO applicationdata(stuid,catid,catname,formatname,fullname,dob,religion,castecat,gender,contactno,contactno2,email,raddress,district,tehsil,stustate,pincode,residing,Fathername,Fathereducation,Fatheroccupation,Fatherannualincome,mothername,mothereducation,motheroccupation,motherannualincome,brothersisterdetail,rusticatedyesno,rusticatedyesdetail,shdfrequestyesno,shdfrequestyesdetail,examinationspasseddetail,academicrecorddetail,scholarshipisrequested,duration,admission,completion,collegeUniversityname,collegeUniversityaddress,collegeUniversitytype,collegeUniversitystudyingatpresent,achievementsscholarshipmedal,achievementsmeritcertificate,achievementshobbies,referencesperson,justification,detailsofbankaccount,familyoccupationname,familyoccupationfather,familyoccupationmother,familyassetsowned,familyagricultureassets,familylivesto,knowscholarship,interviewtimeslot,interviewcenter,firstname,middlename,lastname)VALUES($1, $2, $3, $4, $5, $6, $7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36,$37,$38,$39,$40,$41,$42,$43,$44,$45,$46,$47,$48,$49,$50,$51,$52,$53,$54, $55,$56,$57, $58,$59) RETURNING id`, [stuid,catid,categoryname,formatname,fullname,dob,religion,castecat,gender,contactno,contactno2,email,raddress,district,tehsil,stustate,pincode,residing,Fathername,Fathereducation,Fatheroccupation,Fatherannualincome,mothername,mothereducation,motheroccupation,motherannualincome,brothersisterdetail,rusticatedyesno,rusticatedyesdetail,shdfrequestyesno,shdfrequestyesdetail,examinationspasseddetail,academicrecorddetail,scholarshipisrequested,duration,admission,completion,collegeUniversityname,collegeUniversityaddress,collegeUniversitytype,collegeUniversitystudyingatpresent,achievementsscholarshipmedal,achievementsmeritcertificate,achievementshobbies,referencesperson,justification,detailsofbankaccount,familyoccupationname,familyoccupationfather,familyoccupationmother,familyassetsowned,familyagricultureassets,familylivesto,knowscholarship,interviewtimeslot,interviewcenter,firstname,middlename,lastname]);
    console.log(results);
    const applicationid = results.rows[0].id
    
    console.log(applicationid.toString(),catid, "catresults +++++++")
    res.status(200).json({
      status: "success",
      lastid: results.rows[0].id,
      data:{
        business:results.rows,
      },
    });
console.log(applicationid.toString(),catid, "abc ==========")
    const updateresults = await db.query(`UPDATE studentcategory SET appid = $1 WHERE id = $2 RETURNING id`, [applicationid.toString(),catid]) ;
    const academicyearapp = new Date().getFullYear().toString()
    const applicationreportgoogleUser = await db.query(`SELECT * FROM applicationreport WHERE stuid = $1 AND academicyear = $2`, [stuid.toString(),academicyearapp]);
  console.log(applicationreportgoogleUser, "googleUser");
  if(applicationreportgoogleUser.rows.length > 0){
    // const applicationreportresults = await db.query(`UPDATE applicationreport SET appid = $1 WHERE id = $2 RETURNING id`, [applicationid.toString(),catid]) ;
  }else{
    const applicationreportresults = await db.query(`INSERT INTO applicationreport(stuid,applicantid,currentstatus,applicationlock,academicyear)
    VALUES($1, $2, $3, $4, $5) RETURNING id`, [stuid.toString(),applicationid.toString(),'applicationform','false',academicyearapp]);
  }
    res.status(200).json({
      status: "success",
      catidd: catid,
      catidds: updateresults.rows,
      applicationidd: applicationid,
      lastid: results.rows[0].id
    });

  }catch (err) {
    console.log(err);
  }
});








// Documents Upload API STart
router.post("/api/v1/scholarship/docsupload", async (req, res) => {
  try{
  console.log("upload start")
  let {stuid,appid} = req.body;
  const newpath = path.join(__dirname, '../public/uploads/');
  console.log(newpath);
  const file = req.files.file;
  const filename = Date.now()+file.name;
 
  file.mv(`${newpath}${filename}`, (err) => {
    if (err) {
      res.status(500).send({ message: "File upload failed", code: 200 });
    }

    const results =  db.query(`INSERT INTO documentupload(stuid,appid,documentname,docfilename,approvestatus)VALUES($1, $2, $3, $4, $5)`, [stuid,appid,"marksheet",filename,"0"]);
    console.log(results);
 
  });

    const academicyearapp = new Date().getFullYear().toString()
    const applicationreportgoogleUser = await db.query(`SELECT * FROM applicationreport WHERE stuid = $1 AND academicyear = $2`, [stuid,academicyearapp]);
  console.log(applicationreportgoogleUser.rows, "googleUser");
  if(applicationreportgoogleUser.rows.length > 0){
    const applicationreportresults = await db.query(`UPDATE applicationreport SET currentstatus = $1 WHERE stuid = $2 AND academicyear = $3`, ['uploaddocument',stuid.toString(),academicyearapp]) ;
  }else{
    const applicationreportresults = db.query(`INSERT INTO applicationreport(stuid,applicantid,currentstatus,applicationlock,academicyear)
    VALUES($1, $2, $3, $4, $5) RETURNING id`, [stuid.toString(),appid.toString(),'uploaddocument','false',academicyearapp]);
  }


    res.status(200).send({ message: "File Uploaded", code: 200 });
 
 


}catch (err) {
  console.log(err);
}


});


router.post("/api/v1/scholarship/passport", async (req, res) => {
  try{
  console.log("upload start")
  let {stuid,appid} = req.body;
  const newpath = path.join(__dirname, '../public/uploads/');
  const passportfile = req.files.passport;
  const passportfilename = Date.now()+passportfile.name;
 
  passportfile.mv(`${newpath}${passportfilename}`, (err) => {
    if (err) {
      res.status(500).send({ message: "File upload failed", code: 200 });
    }
    const results =  db.query(`INSERT INTO documentupload(stuid,appid,documentname,docfilename,approvestatus)VALUES($1, $2, $3, $4, $5)`, [stuid,appid,"Passport Size Photo",passportfilename,"0"]);
    console.log(results);
 
  });

    const academicyearapp = new Date().getFullYear().toString()
    const applicationreportgoogleUser = await db.query(`SELECT * FROM applicationreport WHERE stuid = $1 AND academicyear = $2`, [stuid,academicyearapp]);
  console.log(applicationreportgoogleUser.rows, "googleUser");
  if(applicationreportgoogleUser.rows.length > 0){
    const applicationreportresults = await db.query(`UPDATE applicationreport SET currentstatus = $1 WHERE stuid = $2 AND academicyear = $3`, ['uploaddocument',stuid,academicyearapp]) ;
  }else{
    const applicationreportresults = db.query(`INSERT INTO applicationreport(stuid,applicantid,currentstatus,applicationlock,academicyear)
    VALUES($1, $2, $3, $4, $5) RETURNING id`, [stuid,appid,'uploaddocument','false',academicyearapp]);
  }


    res.status(200).send({ message: "File Uploaded", code: 200 });
 
 


}catch (err) {
  console.log(err);
}


});

router.post("/api/v1/scholarship/dmc", async (req, res) => {
  try{
  console.log("upload start")
  let {stuid,appid} = req.body;
  const newpath = path.join(__dirname, '../public/uploads/');
  const dmcfile = req.files.dmc;
  const dmcfilename = Date.now()+dmcfile.name;
 
  dmcfile.mv(`${newpath}${dmcfilename}`, (err) => {
    if (err) {
      res.status(500).send({ message: "File upload failed", code: 200 });
    }
    const results =  db.query(`INSERT INTO documentupload(stuid,appid,documentname,docfilename,approvestatus)VALUES($1, $2, $3, $4, $5)`, [stuid,appid,"DMC",dmcfilename,"0"]);
    console.log(results);
 
  });

    const academicyearapp = new Date().getFullYear().toString()
    const applicationreportgoogleUser = await db.query(`SELECT * FROM applicationreport WHERE stuid = $1 AND academicyear = $2`, [stuid,academicyearapp]);
  console.log(applicationreportgoogleUser.rows, "googleUser");
  if(applicationreportgoogleUser.rows.length > 0){
    const applicationreportresults = await db.query(`UPDATE applicationreport SET currentstatus = $1 WHERE stuid = $2 AND academicyear = $3`, ['uploaddocument',stuid.toString(),academicyearapp]) ;
  }else{
    const applicationreportresults = db.query(`INSERT INTO applicationreport(stuid,applicantid,currentstatus,applicationlock,academicyear)
    VALUES($1, $2, $3, $4, $5) RETURNING id`, [stuid.toString(),appid.toString(),'uploaddocument','false',academicyearapp]);
  }


    res.status(200).send({ message: "File Uploaded", code: 200 });
 
 


}catch (err) {
  console.log(err);
}


});


router.post("/api/v1/scholarship/feesreceipts", async (req, res) => {
  try{
  console.log("upload start")
  let {stuid,appid} = req.body;
    const newpath = path.join(__dirname, '../public/uploads/');
  const feesreceiptfile = req.files.feesreceipts;
  const feesreceiptfilename = Date.now()+feesreceiptfile.name;
 
  feesreceiptfile.mv(`${newpath}${feesreceiptfilename}`, (err) => {
    if (err) {
      res.status(500).send({ message: "File upload failed", code: 200 });
    }
    const results =  db.query(`INSERT INTO documentupload(stuid,appid,documentname,docfilename,approvestatus)VALUES($1, $2, $3, $4, $5)`, [stuid,appid,"Fee Recipts",feesreceiptfilename,"0"]);
    console.log(results);
 
  });

    const academicyearapp = new Date().getFullYear().toString()
    const applicationreportgoogleUser = await db.query(`SELECT * FROM applicationreport WHERE stuid = $1 AND academicyear = $2`, [stuid,academicyearapp]);
  console.log(applicationreportgoogleUser.rows, "googleUser");
  if(applicationreportgoogleUser.rows.length > 0){
    const applicationreportresults = await db.query(`UPDATE applicationreport SET currentstatus = $1 WHERE stuid = $2 AND academicyear = $3`, ['uploaddocument',stuid.toString(),academicyearapp]) ;
  }else{
    const applicationreportresults = db.query(`INSERT INTO applicationreport(stuid,applicantid,currentstatus,applicationlock,academicyear)
    VALUES($1, $2, $3, $4, $5) RETURNING id`, [stuid.toString(),appid.toString(),'uploaddocument','false',academicyearapp]);
  }


    res.status(200).send({ message: "File Uploaded", code: 200 });
 
 


}catch (err) {
  console.log(err);
}


});


router.post("/api/v1/scholarship/deathcertificate", async (req, res) => {
  try{
  console.log("upload start")
  let {stuid,appid} = req.body;
    const newpath = path.join(__dirname, '../public/uploads/');
  const deathcertificatefile = req.files.deathcertificate;
  const deathcertificatefilename = Date.now()+deathcertificatefile.name;
 
  deathcertificatefile.mv(`${newpath}${deathcertificatefilename}`, (err) => {
    if (err) {
      res.status(500).send({ message: "File upload failed", code: 200 });
    }
    const results =  db.query(`INSERT INTO documentupload(stuid,appid,documentname,docfilename,approvestatus)VALUES($1, $2, $3, $4, $5)`, [stuid,appid,"Death Certificate",deathcertificatefilename,"0"]);
    console.log(results);
 
  });

    const academicyearapp = new Date().getFullYear().toString()
    const applicationreportgoogleUser = await db.query(`SELECT * FROM applicationreport WHERE stuid = $1 AND academicyear = $2`, [stuid,academicyearapp]);
  console.log(applicationreportgoogleUser.rows, "googleUser");
  if(applicationreportgoogleUser.rows.length > 0){
    const applicationreportresults = await db.query(`UPDATE applicationreport SET currentstatus = $1 WHERE stuid = $2 AND academicyear = $3`, ['uploaddocument',stuid.toString(),academicyearapp]) ;
  }else{
    const applicationreportresults = db.query(`INSERT INTO applicationreport(stuid,applicantid,currentstatus,applicationlock,academicyear)
    VALUES($1, $2, $3, $4, $5) RETURNING id`, [stuid.toString(),appid.toString(),'uploaddocument','false',academicyearapp]);
  }


    res.status(200).send({ message: "File Uploaded", code: 200 });
 
 


}catch (err) {
  console.log(err);
}


});


router.post("/api/v1/scholarship/familyincome", async (req, res) => {
  try{
  console.log("upload start")
  let {stuid,appid} = req.body;
    const newpath = path.join(__dirname, '../public/uploads/');
  const familyincomefile = req.files.familyincome;
  const familyincomefilename = Date.now()+familyincomefile.name;
 
  familyincomefile.mv(`${newpath}${familyincomefilename}`, (err) => {
    if (err) {
      res.status(500).send({ message: "File upload failed", code: 200 });
    }
    const results =  db.query(`INSERT INTO documentupload(stuid,appid,documentname,docfilename,approvestatus)VALUES($1, $2, $3, $4, $5)`, [stuid,appid,"Family Income",familyincomefilename,"0"]);
    console.log(results);
 
  });

    const academicyearapp = new Date().getFullYear().toString()
    const applicationreportgoogleUser = await db.query(`SELECT * FROM applicationreport WHERE stuid = $1 AND academicyear = $2`, [stuid,academicyearapp]);
  console.log(applicationreportgoogleUser.rows, "googleUser");
  if(applicationreportgoogleUser.rows.length > 0){
    const applicationreportresults = await db.query(`UPDATE applicationreport SET currentstatus = $1 WHERE stuid = $2 AND academicyear = $3`, ['uploaddocument',stuid.toString(),academicyearapp]) ;
  }else{
    const applicationreportresults = db.query(`INSERT INTO applicationreport(stuid,applicantid,currentstatus,applicationlock,academicyear)
    VALUES($1, $2, $3, $4, $5) RETURNING id`, [stuid.toString(),appid.toString(),'uploaddocument','false',academicyearapp]);
  }


    res.status(200).send({ message: "File Uploaded", code: 200 });
 
 


}catch (err) {
  console.log(err);
}


});


router.post("/api/v1/scholarship/photocopypassbook", async (req, res) => {
  try{
  console.log("upload start")
  let {stuid,appid} = req.body;
    const newpath = path.join(__dirname, '../public/uploads/');

  const photocopypassbookfile = req.files.photocopypassbook;
  const photocopypassbookfilename = Date.now()+photocopypassbookfile.name;
 
  photocopypassbookfile.mv(`${newpath}${photocopypassbookfilename}`, (err) => {
    if (err) {
      res.status(500).send({ message: "File upload failed", code: 200 });
    }
    const results =  db.query(`INSERT INTO documentupload(stuid,appid,documentname,docfilename,approvestatus)VALUES($1, $2, $3, $4, $5)`, [stuid,appid,"PhotoCopy PassBook",photocopypassbookfilename,"0"]);
    console.log(results);
 
  });

    const academicyearapp = new Date().getFullYear().toString()
    const applicationreportgoogleUser = await db.query(`SELECT * FROM applicationreport WHERE stuid = $1 AND academicyear = $2`, [stuid,academicyearapp]);
  console.log(applicationreportgoogleUser.rows, "googleUser");
  if(applicationreportgoogleUser.rows.length > 0){
    const applicationreportresults = await db.query(`UPDATE applicationreport SET currentstatus = $1 WHERE stuid = $2 AND academicyear = $3`, ['uploaddocument',stuid.toString(),academicyearapp]) ;
  }else{
    const applicationreportresults = db.query(`INSERT INTO applicationreport(stuid,applicantid,currentstatus,applicationlock,academicyear)
    VALUES($1, $2, $3, $4, $5) RETURNING id`, [stuid.toString(),appid.toString(),'uploaddocument','false',academicyearapp]);
  }


    res.status(200).send({ message: "File Uploaded", code: 200 });
 
 


}catch (err) {
  console.log(err);
}


});
router.post("/api/v1/scholarship/otherdocument", async (req, res) => {
  try{
  console.log("upload start")
  let {stuid,appid} = req.body;
    const newpath = path.join(__dirname, '../public/uploads/');
  const otherdocumentfile = req.files.otherdocument;
  const otherdocumentfilename = Date.now()+otherdocumentfile.name;
 console.log("Print atas")
  otherdocumentfile.mv(`${newpath}${otherdocumentfilename}`, (err) => {
    if (err) {
      res.status(500).send({ message: "File upload failed", code: 200 });
    }
    const results =  db.query(`INSERT INTO documentupload(stuid,appid,documentname,docfilename,approvestatus)VALUES($1, $2, $3, $4, $5)`, [stuid,appid,"Other Document",otherdocumentfilename,"0"]);
    console.log(results);
 
  });

    const academicyearapp = new Date().getFullYear().toString()
    const applicationreportgoogleUser = await db.query(`SELECT * FROM applicationreport WHERE stuid = $1 AND academicyear = $2`, [stuid,academicyearapp]);
  console.log(applicationreportgoogleUser.rows, "googleUser");
  if(applicationreportgoogleUser.rows.length > 0){
    const applicationreportresults = await db.query(`UPDATE applicationreport SET currentstatus = $1 WHERE stuid = $2 AND academicyear = $3`, ['uploaddocument',stuid.toString(),academicyearapp]) ;
  }else{
    const applicationreportresults = db.query(`INSERT INTO applicationreport(stuid,applicantid,currentstatus,applicationlock,academicyear)
    VALUES($1, $2, $3, $4, $5) RETURNING id`, [stuid.toString(),appid.toString(),'uploaddocument','false',academicyearapp]);
  }


    res.status(200).send({ message: "File Uploaded", code: 200 });
 
 


}catch (err) {
  console.log(err);
}


});
router.post("/api/v1/scholarship/documentdelete", async (req, res) => {
  try{
  console.log("DELETE start")
  let {documentid,documentnametxt} = req.body;
    const results =  db.query(`DELETE from documentupload where id = $1`, [documentid]);
    console.log(results);
 

    res.status(200).send({ message: "File Deleted", code: 200 });
 
 


}catch (err) {
  console.log(err);
}


});
router.post("/api/v1/scholarship/documentupload", async (req, res) => {
  try{
  console.log("upload start")
  let {stuid,appid,documentnametxt} = req.body;
    const newpath = path.join(__dirname, '../public/uploads/');
  const otherdocumentfile = req.files.file;
  const otherdocumentfilename = Date.now()+otherdocumentfile.name;
 console.log("Print atas")
  otherdocumentfile.mv(`${newpath}${otherdocumentfilename}`, (err) => {
    if (err) {
      res.status(500).send({ message: "File upload failed", code: 200 });
    }
    const results =  db.query(`INSERT INTO documentupload(stuid,appid,documentname,docfilename,approvestatus)VALUES($1, $2, $3, $4, $5)`, [stuid,appid,documentnametxt,otherdocumentfilename,"0"]);
    console.log(results);
 
  });

    const academicyearapp = new Date().getFullYear().toString()
    const applicationreportgoogleUser = await db.query(`SELECT * FROM applicationreport WHERE stuid = $1 AND academicyear = $2`, [stuid,academicyearapp]);
  console.log(applicationreportgoogleUser.rows, "googleUser");
  if(applicationreportgoogleUser.rows.length > 0){
    const applicationreportresults = await db.query(`UPDATE applicationreport SET currentstatus = $1 WHERE stuid = $2 AND academicyear = $3`, ['uploaddocument',stuid.toString(),academicyearapp]) ;
  }else{
    const applicationreportresults = db.query(`INSERT INTO applicationreport(stuid,applicantid,currentstatus,applicationlock,academicyear)
    VALUES($1, $2, $3, $4, $5) RETURNING id`, [stuid.toString(),appid.toString(),'uploaddocument','false',academicyearapp]);
  }


    res.status(200).send({ message: "File Uploaded", code: 200 });
 
 


}catch (err) {
  console.log(err);
}


});


// ==========================
// Documents Upload API End
// ==========================




// Categorty Upload
router.post("/api/v1/scholarship/category", async (req, res) => {
  try{
    let {stuid,categoryname,formatname} = req.body;

    const results = await db.query(`INSERT INTO studentcategory(stuid,categoryname,formatname)VALUES($1, $2, $3) RETURNING id`, [stuid,categoryname,formatname]);
    console.log(results, "Category id's");
    res.status(200).json({
      status: "success",
      results: results.rows.id,
      data:{
        business:results.rows,
      },
    });

  }catch (err) {
    console.log(err);
  }
});


// ============================
// Nishkam Website API End
// ============================



// ============================
// Nishkam Admin API Start
// ============================

// Get all Application data
router.post("/api/v1/admin/applicationstatusget", async (req, res) => {
  let {stuid,appid} = req.body;
  try{
    const results = await db.query(`select appilicationstatusmessage from finalsubmit where stuid = $1 AND appid = $2`,[stuid, appid])
    
    
    // console.log(results);
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data:{
        business:results.rows,
      },
    });

  }catch (err) {
    console.log(err);
  }
});



// Get all Application data
router.get("/api/v1/admin/applicationresults/:id", async (req, res) => {
  let {id} = req.params;
  try{
    const results = await db.query(`select * from applicationdata where stuid = $1 order by id desc`,[id]);
    // console.log(results);
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data:{
        business:results.rows,
      },
    });

  }catch (err) {
    console.log(err);
  }
});



// Get all Collegereport data
router.get("/api/v1/admin/collegereport", async (req, res) => {
  try{
    const results = await db.query("select * from collegereport");
    // console.log(results);
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data:{
        business:results.rows,
      },
    });

  }catch (err) {
    console.log(err);
  }
});




//user information

router.post("/api/v1/current/status/applicationreport", async(req,res)=> {
  const stuid = req.body.stuid;
  // const applicantid = req.body.applicantid;

  const academicyearapp = new Date().getFullYear().toString()
  const userinfo = await db.query(`SELECT * FROM applicationreport WHERE stuid = $1 AND academicyear = $2 order by id desc`, [stuid,academicyearapp]);
  // console.log(userinfo, "googleUser");
  if(userinfo.rows.length > 0){
    res.status(200).json({
      status: "success",
      data: userinfo.rows,
      redirect: "/"
    })
  } else {
      res.status(200).json({
      status: "No Information exist in database",
    })
  }
})

router.post("/api/v1/admin/fetchapplicantdata", async(req,res)=> {
  const fullname = req.body.fullname;
  const contactno = req.body.contactno;
  const email = req.body.email;

  const userinfo = await db.query(`SELECT * FROM applicationdata WHERE fullname = $1 OR contactno = $2 OR email = $3`, [fullname,contactno,email]);
  // console.log(userinfo, "googleUser");
  if(userinfo.rows.length > 0){
    res.status(200).json({
      status: "success",
      data: userinfo.rows,
      redirect: "/"
    })
  } else {
      res.status(200).json({
      status: "No Information exist in database",
    })
  }
})


// Final Report Submit
router.post("/api/v1/admin/finalsubmit", async(req, res) => {
  try{
  console.log("upload start")
  let {stuid,appid,catid} = req.body;
  const newpath = path.join(__dirname, '../public/uploads/');
  const collegereportfile = req.files.collegereportfile;
  const collegereportfilename = collegereportfile.name;
  console.log("Hello225")

  var uniqueidsample = Math.floor(100000 + Math.random() * 900000);   
  uniqueidsample = String(uniqueidsample);
  uniqueidsample = uniqueidsample.substring(0,9);



  const uniqueid = "NISHKAM"+ uniqueidsample;
  const entrytime = new Date();
  const lastupdate = new Date();
  const update_date = new Date();
 
  collegereportfile.mv(`${newpath}${collegereportfilename}`, async (err) => {
    if (err) {
      res.status(500).send({ message: "File upload failed", code: 200 });
    }
    console.log("results");

 const results = db.query(`INSERT INTO finalsubmit(stuid,appid,catid,uniqueid,collegereportfilename,appilicationstatus,appilicationstatusmessage,entrytime,lastupdate,update_date)VALUES($1, $2, $3, $4, $5,$6,$7,$8,$9,$10)`, [stuid,appid,catid,uniqueid,collegereportfilename,"0","Pending",entrytime,lastupdate,update_date]);
    console.log(results);


    const getcontactno = await db.query(`select contactno from applicationdata where stuid = $1`,[stuid]);
    console.log(getcontactno, "========================");
    if(getcontactno.rows.length > 0)
    {
    const contactno = getcontactno.rows[0].contactno
    
    const message = `Dear Applicant, Your Application is successfully submitted. Status is Pending.`
    const api_url = `http://pro.eglsms.in/app/smsapi/index.php?key=561F8DC385D0C7&campaign=0&routeid=21&type=text&contacts=91${contactno}&senderid=ALERTN&msg=${message}`;
    
    axios.get(api_url)
  .then(function (response) {
    // handle success
    console.log(response);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function () {
    // always executed
  });
    }
 
  });

    const academicyearapp = new Date().getFullYear().toString()
    const applicationreportgoogleUser = await db.query(`SELECT * FROM applicationreport WHERE stuid = $1 AND academicyear = $2`, [stuid,academicyearapp]);
  console.log(applicationreportgoogleUser.rows, "googleUser");
  if(applicationreportgoogleUser.rows.length > 0){
    const applicationreportresults = await db.query(`UPDATE applicationreport SET currentstatus = $1 WHERE stuid = $2 AND academicyear = $3`, ['applicationlock',stuid.toString(),academicyearapp]) ;
  }else{
    const applicationreportresults = db.query(`INSERT INTO applicationreport(stuid,applicantid,currentstatus,applicationlock,academicyear)
    VALUES($1, $2, $3, $4, $5) RETURNING id`, [stuid.toString(),appid.toString(),'applicationlock','false',academicyearapp]);
  }


    res.status(200).send({ message: "File Uploaded", code: 200 });
 
 


}catch (err) {
  console.log(err);
}


});

// Final Report Submit
router.post("/api/v1/application/lock", async(req, res) => {
  try{
  let {stuid,appid,catid} = req.body;

    const academicyearapp = new Date().getFullYear().toString()
    const applicationreportgoogleUser = await db.query(`SELECT * FROM applicationreport WHERE stuid = $1 AND academicyear = $2`, [stuid,academicyearapp]);
  console.log(applicationreportgoogleUser.rows, "googleUser");
  if(applicationreportgoogleUser.rows.length > 0){
    const applicationreportresults = await db.query(`UPDATE applicationreport SET currentstatus = $1 WHERE stuid = $2 AND academicyear = $3`, ['applicationlock',stuid.toString(),academicyearapp]) ;
  }else{
    const applicationreportresults = db.query(`INSERT INTO applicationreport(stuid,applicantid,currentstatus,applicationlock,academicyear)
    VALUES($1, $2, $3, $4, $5) RETURNING id`, [stuid.toString(),appid.toString(),'applicationlock','false',academicyearapp]);
  }


    res.status(200).send({ message: "File Uploaded", code: 200 });
 
 


}catch (err) {
  console.log(err);
}


});

router.post("/api/v1/application/view/full", async(req,res)=> {
  try{
  let {stuid,appid} = req.body;
  const applicationreport = await db.query(`select * from applicationreport where stuid = $1 AND applicantid = $2 order by id desc`, [stuid,appid]);
  const checkfinalsubmit = await db.query(`select * from finalsubmit where stuid = $1 AND appid = $2 order by id desc`, [stuid,appid]);
  const checkdocument = await db.query(`select * from documentupload where stuid = $1 AND appid = $2 order by id desc`, [stuid,appid]);
  const collegereportinfo = await db.query(`SELECT * FROM collegereport WHERE stuid = $1 AND applicantid = $2 order by id desc`, [stuid,appid]);
  const applicationdatainfo = await db.query(`SELECT * FROM applicationdata WHERE id = $1 order by id desc`, [appid]);
  // console.log(userinfo, "googleUser");
  // if(applicationdatainfo.rows.length > 0){
    res.status(200).json({
      status: "success",
      applicationdata: applicationdatainfo.rows,
      collegereportdata: collegereportinfo.rows.length > 0 ? collegereportinfo.rows : null,
      documentdata: checkdocument.rows.length > 0 ? checkdocument.rows : null,
      finalsubmitdata: checkfinalsubmit.rows.length > 0 ? checkfinalsubmit.rows : null,
      applicationreportdata: applicationreport.rows.length > 0 ? applicationreport.rows : null,
      redirect: "/"
    })
  // } else {
  //     res.status(201).json({
  //     status: "failed",
  //     message: "No Information exist in database",
  //   })
  // }  

}catch (err) {
  console.log(err);
}

})



//user information

router.get("/api/v1/admin/fullfecthdata/:id", async(req,res)=> {
  
  const userinfo = await db.query(`SELECT * FROM applicationdata WHERE id = $1`, [req.params.id]);
  console.log(req.params.id, "Req ID");
  // console.log(userinfo, "googleUser");
  if(userinfo.rows.length > 0){
    res.status(200).json({
      status: "success",
      data: userinfo.rows[0],
      redirect: "/"
    })
  } else {
      res.status(201).json({
      status: "failed",
      message: "No Information exist in database",
    })
  }
})



// Get College Report data
router.get("/api/v1/admin/fetchcollegerepot/:stuid/:applicantid", async (req, res) => {
  try{
    // console.log(stuid,appid, "asasxcascdmasnasbcdu");
    const checkdocument = await db.query(`select * from collegereport where stuid = $1 AND applicantid = $2 order by id desc`, [req.params.stuid,req.params.applicantid ]);
    console.log(checkdocument);
    res.status(200).json({
      status: "success",
      results: checkdocument.rows.length,
      data:{
        docs:checkdocument.rows,
      },
    });

  }catch (err) {
    console.log(err);
  }
});






// Get all Application data
router.get("/api/v1/admin/documentcheck/:stuid/:appid", async (req, res) => {

  
  try{
    // console.log(stuid,appid, "asasxcascdmasnasbcdu");
    const checkdocument = await db.query(`select * from documentupload where stuid = $1 AND appid = $2`, [req.params.stuid,req.params.appid ]);
    console.log(checkdocument);
    res.status(200).json({
      status: "success",
      results: checkdocument.rows.length,
      data:{
        docs:checkdocument.rows,
      },
    });

  }catch (err) {
    console.log(err);
  }
});




// Interview Center Upload
router.post("/api/v1/admin/interviewcenter", async (req, res) => {
  try{
    let {centername,centerinchargename,centerinchargephone} = req.body;

    const results = await db.query(`INSERT INTO interviewcenter(centername,centerinchargename,centerinchargephone)VALUES($1, $2, $3) RETURNING id`, [centername,centerinchargename,centerinchargephone]);
    console.log(results, "Category id's");
    res.status(200).json({
      status: "success",
      message:"Center Added Successfully!",
      results: results.rows.id,
      data:{
        business:results.rows,
      },
    });

  }catch (err) {
    console.log(err);
  }
});



// Fetch Interviewcenter API
router.get("/api/v1/admin/fetchinterviewcenter", async (req, res) => {
  
  try{
    const results = await db.query("select * from interviewcenter");
    console.log(results);
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data:{
        business:results.rows,
      },
    });

  }catch (err) {
    console.log(err);
  }
});


//Show Current fina; Status


// Fetch Interviewcenter API
router.post("/api/v1/admin/currentfinalstatus", async (req, res) => {
  const {stuid, appid} = req.body;
  try{
    if(appid != "" && appid != null)
    {
      const results = await db.query(`select * from finalsubmit where stuid = $1 AND appid = $2`,[stuid,appid]);
      console.log(results);
      res.status(200).json({
        status: "success",
        results: results.rows.length,
        data:{
          business:results.rows,
        },
      });
    }else{
    const results = await db.query(`select * from finalsubmit where stuid = $1`,[stuid]);
    console.log(results);
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data:{
        business:results.rows,
      },
    });
    }

  }catch (err) {
    console.log(err);
  }
});


// Status Update Final API
router.post("/api/v1/admin/finalstatusupdate", async (req, res) => {

  const {appilicationstatusmessage, appilicationstatus, appid} = req.body;
  console.log(appilicationstatusmessage, appilicationstatus, "========" )
  try{
    const updateresults = await db.query(`UPDATE finalsubmit SET appilicationstatus = $1, appilicationstatusmessage = $2 WHERE appid = $3 RETURNING stuid`, [appilicationstatus,appilicationstatusmessage, appid]) ;
    console.log(updateresults);
   
    const stuid = updateresults.rows[0].stuid

    const getcontactno = await db.query(`select contactno from applicationdata where stuid = $1`,[stuid]);
    console.log(getcontactno, "========================");
    const contactno = getcontactno.rows[0].contactno
    
    const message = `Dear Applicant, Your Application Status is ${appilicationstatusmessage}.`
    const api_url = `http://pro.eglsms.in/app/smsapi/index.php?key=561F8DC385D0C7&campaign=0&routeid=21&type=text&contacts=91${contactno}&senderid=ALERTN&msg=${message}`;
    
    axios.get(api_url)
  .then(function (response) {
    // handle success
    console.log(response);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function () {
    // always executed
  });

   
   
   
   
   
   
   
   
   
   
    res.status(200).json({
      status: "success",
      results: updateresults.rows.length,
      data:{
        business:updateresults.rows,
      },
    });

  }catch (err) {
    console.log(err);
  }
});




// Document Status Update API
router.post("/api/v1/admin/documentstatusupdate", async (req, res) => {

  const {approvestatus, docid} = req.body;
  try{
    const updateresults = await db.query(`UPDATE documentupload SET approvestatus = $1 WHERE id = $2 RETURNING stuid,documentname`, [approvestatus, docid]) ;
    // console.log(updateresults, "========================");
    
    const stuid = updateresults.rows[0].stuid
    const documentnamed = updateresults.rows[0].documentname
    const documentname = documentnamed.charAt(0).toUpperCase() + documentnamed.substring(1);


    const getcontactno = await db.query(`select contactno from applicationdata where stuid = $1`,[stuid]);
    console.log(getcontactno, "========================");
    const contactno = getcontactno.rows[0].contactno
   
    const approvestatusmsg = approvestatus == 1 ? "Approved" : approvestatus == 2 ? "Disapproved" : "Pending"

    const message = `Dear User, Your ${documentname} Document is ${approvestatusmsg}.`
    const api_url = `http://pro.eglsms.in/app/smsapi/index.php?key=561F8DC385D0C7&campaign=0&routeid=21&type=text&contacts=91${contactno}&senderid=ALERTN&msg=${message}`;
    
    axios.get(api_url)
  .then(function (response) {
    // handle success
    console.log(response);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function () {
    // always executed
  });

    res.status(200).json({
      status: "success",
      results: updateresults.rows.length,
      data:{
        business:updateresults.rows,
      },
    });

  }catch (err) {
    console.log(err);
  }
});


//===========================
// forget passport
//===========================
router.post("/api/v1/forgotpasswovrd/", async (req, res) => {

  try{
    let email = req.body.email;
    const results = await db.query("SELECT * FROM users WHERE email = $1", [email]);
  
    console.log(email,'console');
    console.log(results.rows);
  if(results.rows.length <= 0){
    res.status(401).json({
      status: "failure",
      message: "Email not Matched with our Records!",
      data: results.rows[0]
    })
    }else {
      console.log('getpassword');
      const passwordget = results.rows[0].password;

      const number = Math.floor(000000 + Math.random() * 900000)
      console.log(number);  
      console.log("hashedpassword");
      let newPassword = number.toString(); 
      let hashedpassword = await bcrypt.hash(newPassword, 10);
      console.log(hashedpassword, "hashedpassword"); 

      const updatepassword =  await db.query(`UPDATE users SET password = $1 where email = $2`, [hashedpassword, email])
      console.log(updatepassword);

      
      var transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "jdwebservices1@gmail.com",
            pass: "Zsxedc@123@"
        }
     });

     let info = await transporter.sendMail({
      from: '"Jashandeep Singh 👻" <jdwebservices1@gmail.com>', // sender address
      to: `${email}`, // list of receivers
      subject: "New Password from Career Engine ✔", // Subject line
      text: `Hello ${results.rows[0].name}, Your New Password is ${number}`, // plain text body
      html: `Hello ${results.rows[0].name}, Your New Password is ${number}`, // html body
    });

    console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

      res.status(201).json({
        status: "Success",
        message: "Email Matched with our Records!",
        data: results.rows[0]
      })
    }





  }catch (err) {
    console.log(err);
  }



});






// ============================
// Nishkam Admin API End
// ============================




module.exports = router;