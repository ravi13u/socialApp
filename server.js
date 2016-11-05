var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var bcrypt = require('bcryptjs');
var jwt = require('jwt-simple');
var bodyparser = require('body-parser');
var app = express();
var JWT = 'nitamyvar';
var db = null;
MongoClient.connect("mongodb://localhost:27017/mittens",function(err,dbconn){
	if(!err){
		console.log("we are connected");
		db = dbconn;

	}
});

app.use(bodyparser.json());

app.use(express.static('public'));


app.get('/myvar',function(req,res,next){
	
  db.collection('myvar',function(err,myvarCollection){
  	myvarCollection.find().toArray(function(err,myvar){
  		console.log(myvar);
            return res.json(myvar);

  	}); 
  });

});

app.post('/myvar',function(req,res,next){

	var token = req.headers.authorization;
	var user = jwt.decode(token,JWT);
    
    db.collection('myvar',function(err,myvarCollection){
    	var newmyvar = {
    	text: req.body.newmyvar,
    	user: user._id,
    	username: user.username
    };
  	myvarCollection.insert(newmyvar,{w:1},function(err){
            return res.send();
	});
  });

});

app.put('/myvar/remove',function(req,res,next){
    
    var token = req.headers.authorization;
	var user = jwt.decode(token,JWT);
    
    db.collection('myvar',function(err,myvarCollection){
    	var myvarId = req.body.myvar._id;

  	myvarCollection.remove({_id: ObjectId(myvarId), user: user._id},{w:1},function(err,result){
             return res.send();
	});
  }); 

});
   


   app.post('/user',function(req,res,next){
   
    db.collection('user',function(err,userCollection){
     
         bcrypt.genSalt(10,function(err,salt){
         	bcrypt.hash(req.body.password,salt,function(err,hash){

         var newUser = {
   	username: req.body.username,
   	password: hash
   };
   userCollection.insert(newUser,{w:1},function(err){
            return res.send();
	});
         	});
        });

    
     });
 });


app.put('/user/signin',function(req,res,next){
   
    db.collection('user',function(err,userCollection){
      
      userCollection.findOne({username: req.body.username},function(err,user){
      	bcrypt.compare(req.body.password,user.password,function(err,result){
      		if(result){

      			      var token = jwt.encode(user,JWT);
                       return res.json({token:token});
      		        } 
      		else{ 
                        return res.status(400).send();
      		     }
      	    });

        });

    
    });
});


app.listen(3000,function(){
 	console.log('Eg is running on port 3000!');
 });