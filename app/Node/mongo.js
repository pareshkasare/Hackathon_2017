
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var bodyParser = require("body-parser");
var express = require('express');
var cors = require('cors');
var request = require('request');
var app = express();
var url = 'mongodb://pskcnc:testpskcnc@ds139360.mlab.com:39360/ase_project';
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/getappointments', function (req, res) {
    MongoClient.connect(url, function(err, db) {
        if(err)
        {
            res.write("Failed, Error while connecting to Database");
            res.end();
        }
        getappointment(db, res, function() {
            //res.write("success");
            //console.log(res);
            db.close();
            res.end();
        });
    });

	
});

var getappointment = function(db, res, callback) {
    //console.log("loggin in user"+data.password);
    //var cursor = db.collection('users').find();

    var stream = db.collection('appointments').find().stream();
    var out="";
    stream.on('data', function (doc) {

        console.log(JSON.stringify(doc));
        out = out+JSON.stringify(doc)+",";

    });
    stream.on('end', function() {
        out = "["+out.slice(0,-1)+"]";
        res.write(out);

        callback();
    });
};
app.post('/getappointment', function (req, res) {
    MongoClient.connect(url, function(err, db) {
        if(err)
        {
            res.write("Failed, Error while connecting to Database");
            res.end();
        }
        getoneappointment(db, req.body,res, function() {
            //res.write("success");
            //console.log(res);
            db.close();
            res.end();
        });
    });

	
});

var getoneappointment = function(db, data,res, callback) {
    //console.log("loggin in user"+data.password);
    //var cursor = db.collection('users').find();
    var ObjectId = require('mongodb').ObjectID;
	
    var stream = db.collection('appointments').find({_id:ObjectId(data.id)}).stream();
    var out="";
    stream.on('data', function (doc) {

        console.log(JSON.stringify(doc));
        out = out+JSON.stringify(doc)+",";

    });
    stream.on('end', function() {
        out = "["+out.slice(0,-1)+"]";
        res.write(out);

        callback();
    });
};
app.post('/getdocappointments', function (req, res) {
    MongoClient.connect(url, function(err, db) {
        if(err)
        {
            res.write("Failed, Error while connecting to Database");
            res.end();
        }
        getdocappt(db,req.body, res, function() {
            //res.write("success");
            //console.log(res);
            db.close();
            res.end();
        });
    });

	
});

var getdocappt = function(db, data,res, callback) {
    //console.log("loggin in user"+data.password);
    //var cursor = db.collection('users').find();
    var ObjectId = require('mongodb').ObjectID;
    var stream = db.collection('appointments').find({"doc_id":data.docid}).stream();
    var out="";
    stream.on('data', function (doc) {

        console.log(JSON.stringify(doc));
        out = out+JSON.stringify(doc)+",";

    });
    stream.on('end', function() {
        out = "["+out.slice(0,-1)+"]";
        res.write(out);

        callback();
    });
};
app.post('/getdoctors', function (req, res) {
    MongoClient.connect(url, function(err, db) {
        if(err)
        {
            res.write("Failed, Error while connecting to Database");
            res.end();
        }
        getdoc(db, res, function() {
            //res.write("success");
            //console.log(res);
            db.close();
            res.end();
        });
    });

	
});

var getdoc = function(db, res, callback) {
    //console.log("loggin in user"+data.password);
    //var cursor = db.collection('users').find();

    var stream = db.collection('users').find({"usertype":"D"}).stream();
    var out="";
    stream.on('data', function (doc) {

        console.log(JSON.stringify(doc));
        out = out+JSON.stringify(doc)+",";

    });
    stream.on('end', function() {
        out = "["+out.slice(0,-1)+"]";
        res.write(out);

        callback();
    });
};
app.post('/nursecheckin', function (req, res) {
    MongoClient.connect(url, function(err, db) {
        if(err)
        {
            res.write("Failed, Error while connecting to Database");
            res.end();
        }
        updateDocument(db, req.body,res, function() {


        });
    });
});
var updateDocument = function(db, data,res, callback) {

    console.log("DATA FOR UPDATE::::::" +JSON.stringify(data));
    var ObjectId = require('mongodb').ObjectID;
    db.collection('appointments').updateOne({_id:ObjectId(data.id)},{$set:{'vital.sysbp':data.sysbp,'vital.disbp':data.disbp,'vital.oxygen':data.oxygen,'vital.weight':data.weight,'roomnum':data.roomnum,'reason':data.reason,'nurse':true}}, function(err, result) {
     if(err)
     {
     res.write("DBUPDATE failure");
     res.end();
     }
     else{
         res.write("Success");
         db.close();
         res.end();
     }
     callback();
     });
};
app.post('/receptionistcheckin', function (req, res) {
    MongoClient.connect(url, function(err, db) {
        if(err)
        {
            res.write("Failed, Error while connecting to Database");
            res.end();
        }
        updateDocument2(db, req.body,res, function() {


        });
    });
});
var updateDocument2 = function(db, data,res, callback) {

    console.log("DATA FOR UPDATE::::::" +JSON.stringify(data));
    var ObjectId = require('mongodb').ObjectID;
    db.collection('appointments').updateOne({_id:ObjectId(data.id)},{$set:{'recep':true}}, function(err, result) {
     if(err)
     {
     res.write("DBUPDATE failure");
     res.end();
     }
     else{
         res.write("Success");
         db.close();
         res.end();
     }
     callback();
     });
};
app.post('/doctordone', function (req, res) {
    MongoClient.connect(url, function(err, db) {
        if(err)
        {
            res.write("Failed, Error while connecting to Database");
            res.end();
        }
        updateDocument3(db, req.body,res, function() {


        });
    });
});
var updateDocument3 = function(db, data,res, callback) {

    console.log("DATA FOR UPDATE::::::" +JSON.stringify(data));
    var ObjectId = require('mongodb').ObjectID;
    db.collection('appointments').updateOne({_id:ObjectId(data.id)},{$set:{'doc':true}}, function(err, result) {
     if(err)
     {
     res.write("DBUPDATE failure");
     res.end();
     }
     else{
         res.write("Success");
         db.close();
         res.end();
     }
     callback();
     });
};
app.post('/searchpatient', function (req, res) {
    MongoClient.connect(url, function(err, db) {
        if(err)
        {
            res.write("Failed, Error while connecting to Database");
            res.end();
        }
        searchpatientinfo(db, req.body,res, function() {
            //res.write("success");
            //console.log(res);
            db.close();
            res.end();
        });
    });

	
});
var searchpatientinfo = function(db,data, res, callback) {
    console.log("loggin in user"+data.cnum);
    //var cursor = db.collection('users').find();

    var stream = db.collection('users').find({$and:[{ 'number': new RegExp(data.cnum, 'i'),"usertype":"P" }]}).stream();
    var out="";
    stream.on('data', function (doc) {

        console.log(JSON.stringify(doc));
        out = out+JSON.stringify(doc)+",";

    });
    stream.on('end', function() {
        out = "["+out.slice(0,-1)+"]";
        res.write(out);

        callback();
    });
};

app.post('/removeappt', function (req, res) {
    MongoClient.connect(url, function(err, db) {
        if(err)
        {
            res.write("Failed, Error while connecting to Database");
            res.end();
        }
        removeuser(db, req.body,res, function() {
            res.write("Success");
            //console.log(res);
            db.close();
            res.end();
        });
    });
});
var removeuser = function(db, data,res, callback) {
    console.log("id passed"+data.id);
    var ObjectId = require('mongodb').ObjectID;

    var cursor = db.collection('appointments').remove({_id:ObjectId(data.id)});
    MongoClient.connect(url, function(err, db) {
        if(err)
        {
            res.write("Failed, Error while connecting to Database");
            //res.end();
        }
       /* getusers(db, res, function() {
            //res.write("success");
            //console.log(res);
            //db.close();
            //res.end();
        });*/
    });
    callback();
    /*
    cursor.each(function(err,doc){
        assert.equal(err,null);
        console.log("data"+ data);
        if(doc != null)
        {
            res.write("success")
            console.log("User logged:" + doc.email);
            console.log("pwd:"+doc.password);
        }
        else {
            callback();
        }
    });*/

};	
app.post('/createappointment', function (req, res) {
    MongoClient.connect(url, function(err, db) {
        if(err)
        {
            res.write("Failed, Error while connecting to Database");
            res.end();
        }
        createappointment(db,req.body, res, function() {
            //res.write("success");
            //console.log(res);
            db.close();
            res.end();
        });
    });

	
});

var createappointment = function(db, data,res, callback) {

    console.log("em:" + data.email);

		db.collection('appointments').insertOne( data, function(err, result) {
			if(err)
			{
				res.write("DBINSERT failure");
				db.close();
				res.end();

			}
			else{
				res.write("Success");
				db.close();
				res.end();
				callback();
			}

        })



    /*db.collection('users').insertOne( data, function(err, result) {
        if(err)
        {
            res.write("Registration Failed, Error While Registering");
            res.end();
        }
        console.log("Inserted a document into the users collection.");
        callback();
    });*/
};
app.get('/medAPI', function (req, res) {
    var result={
        'meds': []
    };

    var name = req.query.name;
    var brand = req.query.brand;
    console.log("found this on url: ", name);
    console.log("found this on url: ", brand);
    if(name) {
        request('https://dailymed.nlm.nih.gov/dailymed/services/v2/rxcuis.json?rxString=' + name, function (error, response, body) {
            //Check for error
            if (error) {
                return console.log('Error:', error);
            }

            //Check for right status code
            if (response.statusCode !== 200) {
                return console.log('Invalid Status Code Returned:', response.statusCode);
            }
            //All is good. Print the body
            body = JSON.parse(body);
            var med_data = body.data;
            for (var i = 0; i < med_data.length; i++) {
                result.meds.push({
                    'name': med_data[i].rxstring,
                    'rxcui': med_data[i].rxcui
                });
            }
            res.contentType('application/json');
            res.write(JSON.stringify(result));
            res.end();
        });
        console.log(result);
    }
    else if(brand){
        request('https://dailymed.nlm.nih.gov/dailymed/services/v2/spls.json?rxcui=' + brand, function (error, response, body) {
            //Check for error
            if (error) {
                return console.log('Error:', error);
            }

            //Check for right status code
            if (response.statusCode !== 200) {
                return console.log('Invalid Status Code Returned:', response.statusCode);
            }
            //All is good. Print the body
            body = JSON.parse(body);
            var med_data = body.data;
            for (var i = 0; i < med_data.length; i++) {
                result.meds.push({
                    'name': med_data[i].title,
                    'setid': med_data[i].setid
                });
            }
            res.contentType('application/json');
            res.write(JSON.stringify(result));
            res.end();
        });

    }
    else {
        res.contentType('application/json');
        res.write('["Error":"No valid Parameter passed in API call"]');
        res.end();
    }

});

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})