var express = require("express");
var app = express();
//	sdk = new BoxSDK({
//		clientID: 'vqwdc5l2kqbf7o29izbircp3s6gjznf0',
//		clientSecret: 'IQ7mSLqLRv0IvIr8djqhbWQmCkYarInK',
//});
var cfenv = require("cfenv");
var bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

var mydb;

/* Endpoint to greet and add a new visitor to database.
* Send a POST request to localhost:3000/api/visitors with body
* {
* 	"name": "Bob"
* }
*/
app.post("/api/visitors", function (request, response) {
  var userName = request.body.name;
  if(!mydb) {
    console.log("No database.");
    response.send("Hello " + userName + "!");
    return;
  }
  // insert the username as a document
  mydb.insert({ "name" : userName }, function(err, body, header) {
    if (err) {
      return console.log('[mydb.insert] ', err.message);
    }
    response.send("Hello " + userName + "! I added you to the database.");
  });
});

/**
 * Endpoint to get a JSON array of all the visitors in the database
 * REST API example:
 * <code>
 * GET http://localhost:3000/api/visitors
 * </code>
 *
 * Response:
 * [ "Bob", "Jane" ]
 * @return An array of all the visitor names
 */
app.get("/api/visitors", function (request, response) {
  var names = [''];
  if(!mydb) {
    response.json(names);
    return;
  }

  mydb.list({ include_docs: true }, function(err, body) {
    if (!err) {
      body.rows.forEach(function(row) {
        if(row.doc.name)
          names.push(row.doc.name);
      });
      response.json(names);
    }
  });
});

app.use(express.static(__dirname + '/views'));

var port = process.env.PORT || 3000
app.listen(port, function() {
    console.log("To view your app, open this link in your browser: http://localhost:" + port);
});


// Box things
//Initialize SDK

var BoxSDK = require('box-node-sdk');
var sdk = new BoxSDK({
	  clientID: '10psittpqbnqgvcm1twksvtoyfqyex2k',
	  clientSecret: 'APehX2FXVEFdHyqR9Gtu5NYUk42EryyZ'
	});

	// Create a basic API client
var client = sdk.getBasicClient('2zgA2UveMmRZxWj57smnLsgX83MbRJDc');
/*
//Get some of that sweet, sweet data!
client.users.get(client.CURRENT_USER_ID, null, function(err, currentUser) {
  if(err) throw err;
  console.log('Hello, ' + currentUser.name + '!');
});
*/

app.post("/api/getlist", function (request, response) {
	var id = request.body.id;
	if (id == null)
			id = 24655132539;
	client.folders.getItems(id, null, function(err, res) {
		if(err) {
			response.send('ERROR');
		}
		else {
			response.send(res);
		}
	});
});

app.get("/api/getlist", function (request, response) {
	var id = request.body.id;
	if (id == null)
		id = 24655132539;
	client.folders.getItems(id, null, function(err, res) {
		if(err) {
			response.send('ERROR');
		}
		else {
			response.send(res)
		}
	});
});



