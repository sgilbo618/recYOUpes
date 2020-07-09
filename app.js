/***************************************************************
** Name: Samanth Guilbeault
***************************************************************/

let express = require('express');
let request = require('request');
let session = require('express-session');
let handlebars = require('express-handlebars');
let bodyParser = require('body-parser');
let credentials = require('./credentials.js');

let app = express();

/* add helper functions for handlebars
   source: https://github.com/ericf/express-handlebars#helpers */
let hbs = handlebars.create({
	helpers: {
		// compares two values
		ifeq: function (a, b, options){
				if (a == b){return options.fn(this);}
				return options.inverse(this);
			}
	}
});

app.engine('handlebars', hbs.engine);

app.set('view engine', 'handlebars');
app.set('port', 4223);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/*
TODO: use sessions to create user accounts
*/
app.use(session({
	secret: credentials.sessionSecret,
	resave: true,
	saveUninitialized: true
}));


// home get route
app.get('/', function(req, res){
	let context = {};
	res.render('home', context);
});

app.post('/', function(req, res){
	let context = {};
	let id = req.query.id;
	// use ID for http request for get recipe information
	request('https://api.spoonacular.com/recipes/' + id + '/information?apiKey=' + credentials.spoonKey, 
	function(err, response, body){
		if(!err && response.statusCode < 400){
			let info = JSON.parse(body);
			context.title = info["title"];
			context.imageUrl = info["image"];
			context.ingredients = info["extendedIngredients"];
			context.instructions = info["analyzedInstructions"][0]["steps"];
			context.link = info["image"];
			res.render('recipe', context);
		} else {
			if(response){
				console.log(response.statusCode);
			}
			next(err);
		}
	}); 
});

// search get route
app.get('/search', function(req, res){
	let context = {};
	res.render('search', context);
});

// search post route
app.post('/search', function(req, res, next){
	let context = {};
	let offset = req.body.number;
	context.oldOffset = parseInt(offset) + 1;
	// http request to search for recipe id
	request('https://api.spoonacular.com/recipes/search?query=' 
	+ req.body.searchTerm + '&offset=' + offset + '&number=12' + '&instructionsRequired=true' + '&apiKey=' + credentials.spoonKey, 
	function(err, response, body){
		if(!err && response.statusCode < 400){
			let results = JSON.parse(body);
			context.searchTerm = req.body.searchTerm;
			context.newOffset = parseInt(offset) + 12;
			let items = [];
			for (let i = 0; i < results["results"].length; i++){
				let item = {};
				item.id = results["results"][i]["id"];
				item.title = results["results"][i]["title"];
				item.imageUrl = results["baseUri"] + results["results"][i]["image"];
				item.minutes = results["results"][i]["readyInMinutes"];
				item.servings = results["results"][i]["servings"];
				items.push(item);
			}
			context.items = items;
			res.render('results', context);
		} else {
			if(response){
				console.log(response.statusCode);			
			}
			next(err);
		}
	});
});

// recipe show page
app.post('/recipe', function(req, res, next){
	let context = {};
	let id = req.body.id;
	// use ID for http request for get recipe information
	request('https://api.spoonacular.com/recipes/' + id + '/information?apiKey=' + credentials.spoonKey, 
	function(err, response, body){
		if(!err && response.statusCode < 400){
			let info = JSON.parse(body);
			context.title = info["title"];
			context.imageUrl = info["image"];
			context.ingredients = info["extendedIngredients"];
			context.instructions = info["analyzedInstructions"][0]["steps"];
			context.link = info["image"];
			res.render('recipe', context);
		} else {
			if(response){
				console.log(response.statusCode);
			}
			next(err);
		}
	}); 
});

// random get route
app.get('/random', function(req, res, next){
	let context = {};
	request('https://api.spoonacular.com/recipes/random?apiKey=' + credentials.spoonKey, 
	function(err, response, body){
		if(!err && response.statusCode < 400){
			let info = JSON.parse(body);
			context.title = info["recipes"][0]["title"];
			context.imageUrl = info["recipes"][0]["image"];
			context.ingredients = info["recipes"][0]["extendedIngredients"]
			context.instructions = info["recipes"][0]["analyzedInstructions"][0]["steps"];
			context.link = info["image"];
			res.render('random', context);
		} else {
			if(response){
				console.log(response.statusCode);
			}
			next(err);
		}
	});
});

// submit get route
app.get('/submit', function(req, res, next){
	let context = {};
	res.render('submit', context);
});

// submit post route
app.post('/submit', function(req, res, next){
	let context = {};
	context.name = req.body.user;
	context.title = req.body.recipeTitle;
	res.render('thanks', context);
});


// error routes
app.use(function(req,res){
	res.status(404);
	res.render('404');
});

app.use(function(err, req, res, next){
	res.type('plain/text');
	res.status(500);
	res.render('500');
});

// server set u
app.listen(process.env.PORT || app.get('port'), function(){
	console.log('Server is up at port ' + app.get('port') + 'press ctrl-c to terminate.');
});
