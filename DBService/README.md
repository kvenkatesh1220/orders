Setup
=====

**Install NodeJs**

	Install latest LTS version of NodeJs from https://nodejs.org/en/download/ , which would additionally install latest compatible NPM.

**Install MongoDb**

	Install MongoDb from https://www.mongodb.com/download-center#community .
	Every time you run the server application, you have to make sure that the MongoDb server is running (execute command 'mongod' to start). Or you can install mongod as a Windows Service by using NSSM (google it! for steps)
	(Optional) You may also want to install RoboMongo to see data in GUI.

**Install Redis**

	https://github.com/MSOpenTech/redis/releases (for windows). Please check appropriate source for linux
	(Optional) You may also want to install 'Redis Desktop Manager' to see cache data in GUI
	(Optional) You may also want to install 'Fasto Redis' to execute redis commands
	You can check redis version using "redis-server --version"

**Install NPM packages**
	npm install
	npm install --dev

**Queue**
	Dont use TTL, BackoffDelay, Attempts. Reason: If server crashes in between student import, job is triggering second time.

Running the Application
=======================
	npm install
	npm install --dev
	npm start
Npm installation steps are required to be run only when package.json is updated with new modules. Otherwise optional.

Debugging the Application
=========================
How to debug node express application (https://expressjs.com/en/guide/debugging.html)
On Windows
	set DEBUG=express:* & node server.js
On Linux
	DEBUG=express:* node server.js


Database
========
**Backup**

	mongodump --db <db_name> --gzip

**Restore**

	mongorestore --gzip --db <fresh_db_name> dump/xxxxxxx/

http://snmaynard.com/2012/10/17/things-i-wish-i-knew-about-mongodb-a-year-ago/
https://github.com/suprememoocow/node-mongodb-datadog-stats
http://stackoverflow.com/questions/21069813/mongoose-multiple-query-populate-in-a-single-call
http://frontendcollisionblog.com/mongodb/2016/01/24/mongoose-populate.html

Pre hooks (middleware)
	 In document middleware functions, "this" refers to the document.
	 In query middleware functions, "this" refers to the query.
	 findAndModify() doesn't seem working on Student mongoose model that's why 'update' pre hook associated with it is not written for cand_schema. 
http://mongoosejs.com/docs/middleware.html

Redis
=====
Delete a key pattern

	redis-cli -n 1 EVAL "return redis.call('DEL', unpack(redis.call('KEYS', ARGV[1] .. '*')))" 0 YOUR_PREFIX_TO_DELETE:

Security Considerations
=======================
https://www.youtube.com/watch?v=W-8XeQ-D1RI
	:: Node.js Express AWS Web Security Best Practices [Presentation]

app.disable("x-powered-by");
Avoid Parameter pollution
res.setHeader('Strict-Transport-Security', ....... )

Cross Site Request Forgery
	app.use(express.csrf())
	res.locals.csrftoken = req.csrfToken();

Content Security Policy	:: Execute javascript files only served from the list of websites.
X Frame options

Mongoose / Express / ...
========================
Use Mongoose lean().exec() to improve performance where ever possible
Specifically use it for Find commands where you just need data that is not saved again.
http://www.tothenew.com/blog/high-performance-find-query-using-lean-in-mongoose-2/

------------------------------------------------------------------------------------------------
Degrees / Category / Subject classification example
	http://www.matchcollege.com/colleges-online-degrees
https://docs.nearbycolleges.info/#autocomplete
------------------------------------------------------------------------------------------------

//TODO: Send meta info about the API response
	http://stackoverflow.com/questions/12168624/pagination-response-payload-from-a-restful-api

standard-json-api-response-format
	http://stackoverflow.com/questions/12806386/standard-json-api-response-format
------------------------------------------------------------------------------------------------

http://stackoverflow.com/questions/10090414/express-how-to-pass-app-instance-to-routes-from-a-different-file
Use >>   req.app

http://stackoverflow.com/questions/10306185/nodejs-best-way-to-pass-common-variables-into-separate-modules

https://github.com/petkaantonov/bluebird/wiki/Promise-anti-patterns

http://stackoverflow.com/questions/21009572/how-to-use-a-variable-for-a-property-name-when-using-underscore-js-findwhere-fun

http://stackoverflow.com/questions/28104798/assign-only-if-property-exists-in-target-object

------------------------------------------------------------------------------------------------
Regex to remove all 'required fields from mongoose schema' (for manually creating swagger doc)
 *, *required *: (true|false)

http://stackoverflow.com/questions/26423508/mongoose-assign-field-of-type-array-of-strings

------------------------------------------------------------------------------------------------
Remote logger for node-bunyan that logs to the browser via Bunyan DevTools
https://www.npmjs.com/package/bunyan-remote
------------------------------------------------------------------------------------------------
https://www.youtube.com/watch?v=3NN4K3BEaQM
	Watch this video at time 17 min where he explains most important express middlewares

------------------------------------------------------------------------------------------------
https://www.npmjs.com/package/mongoose-hidden
A Mongoose schema plugin that hooks into toJSON() and toObject() to allow
hiding of properties you usually do not want to sent client-side.

https://github.com/yamadapc/mongoose-private-paths
https://github.com/vs-archive/mongoose-ui-forms   (Not much documentation)

*****
	https://github.com/thenrikie/mongo-query-generator
*****
	https://github.com/jupe/mongoose-query
*****
https://gist.github.com/madhums/1123688

------------------------------------------------------------------------------------------------

//LEARNINGS:10 http://stackoverflow.com/questions/130396/are-there-constants-in-javascript
//LEARNINGS:40 http://stackoverflow.com/questions/2821509/can-you-use-constant-variables-in-javascript

------------------------------------------------------------------------------------------------

https://github.com/tj/node-only
	Check this JSON Utility

------------------------------------------------------------------------------------------------

// Use the below macros.
//LEARNINGS:
//TODO:
//NOTE:

------------------------------------------------------------------------------------------------

//LEARNING : Beware using the JSON.parse(JSON.stringify(obj)) method on Date
	objects - JSON.stringify(new Date()) returns a string representation of the
	date in ISO format, which JSON.parse() doesn't convert back to a Date object.
	Ref : http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-clone-an-object

------------------------------------------------------------------------------------------------

//Currently used parsers
{
	app.use(g_module_bodyParser.json()); // get information from html forms
	app.use(g_module_bodyParser.urlencoded({ extended: true }));
}


//TODO : need to install various parser middlewares as per need. Below is good example.
	However I have to research more.
{
	// parse various different custom JSON types as JSON
	app.use(bodyParser.json({ type: 'application/*+json' }))

	// parse some custom thing into a Buffer
	app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }))

	// parse an HTML body into a string
	app.use(bodyParser.text({ type: 'text/html' }))
}

------------------------------------------------------------------------------------------------
// - - - - Error Handlers - - - -
/*
// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});
*/

/*
// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
    message: err.message,
    error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  next(err);
  res.render('error', {
  message: err.message,
  error: {}
  });
});
*/
------------------------------------------------------------------------------------------------

TODOs

1) UI : Make the URI an absolute path by copying the common part from a global constant.
This would allow us to run the API and HTML web pages on different servers.

------------------------------------------------------------------------------------------------
Trick (Copied from Stack Overflow)
To make the error show up as an error in the web console, as you originally intended, I use this trick:

.catch(function(err) { setTimeout(function() { throw err; }); });
http://stackoverflow.com/questions/30715367/why-can-i-not-throw-inside-a-promise-catch-handler

------------------------------------------------------------------------------------------------

http://stackoverflow.com/questions/34960886/are-there-still-reasons-to-use-promise-libraries-like-q-or-bluebird-now-that-we

------------------------------------------------------------------------------------------------

'/:mongoId([0-9a-f]{24})'
express routing regular expression for mongodb ids
------------------------------------------------------------------------------------------------

http://stackoverflow.com/questions/14671332/is-there-any-way-to-prevent-override-overwrite-of-functions-variables-in-singlet

------------------------------------------------------------------------------------------------

The current Config module that we have build in-house and using today doesn't allow
us to change the config values from the command line unlike some other modules
available in the community.

For ex, https://github.com/lorenwest/node-config
I am not sure if it is a good idea to have the capability to change the config
values in runtime from outside of the node process (or even from inside node
process). Lets see how our requirements evolve...., until then - TC -Prasad

------------------------------------------------------------------------------------------------
https://www.npmjs.com/package/live-server

npm install --production
	This would not install devDependencies
------------------------------------------------------------------------------------------------

https://github.com/nicokaiser/node-monit
https://howtonode.org/deploying-node-upstart-monit

https://www.npmjs.com/package/node-uptime


Data Migration
==============
	**https://github.com/balmasi/migrate-mongoose**

	http://stackoverflow.com/questions/17410020/mongoose-migrate

	https://github.com/kennethklee/mongoose-rolling-migration

	https://www.npmjs.com/package/mongoose-lazy-migration

	https://github.com/balmasi/migrate-mongoose

	https://www.npmjs.com/package/mongoose-migrate

	https://www.npmjs.com/package/mongoose-migration

	https://www.npmjs.com/package/mongoose-data-migrations

------------------------------------------------------------------------------------------------

fs.watch() & fs.watchFile()
http://tech.nitoyon.com/en/blog/2013/10/02/node-watch-impl/
http://stackoverflow.com/questions/12978924/fs-watch-fired-twice-when-i-change-the-watched-file

http://socket.io/docs/#using-with-express-3/4
https://github.com/felixge/node-formidable/blob/master/example/upload.js
https://www.npmjs.com/package/stream-body-parser
https://www.npmjs.com/package/busboy
	http://lollyrock.com/articles/express4-file-upload/
	http://stackoverflow.com/questions/23691194/node-express-file-upload
http://code.tutsplus.com/tutorials/how-to-create-a-resumable-video-uploade-in-node-js--net-25445
https://www.npmjs.com/package/node-rest-client
http://stackoverflow.com/questions/9914816/what-is-an-example-of-the-simplest-possible-socket-io-example

https://github.com/socketio/socket.io-client/issues/641
https://github.com/whatwg/fetch/issues/251


http://stackoverflow.com/questions/24058157/socket-io-node-js-cross-origin-request-blocked
http://stackoverflow.com/questions/15771805/how-to-set-socket-io-origins-to-restrict-connections-to-one-url/21711242#21711242
http://stackoverflow.com/questions/31507688/cors-blocked-with-node-js-and-socket-io
** https://www.jayway.com/2015/04/13/600k-concurrent-websocket-connections-on-aws-using-node-js/

https://github.com/binaryjs/binaryjs
https://github.com/liamks/Delivery.js

------------------------------------------------------------------------------------------------

https://www.npmjs.com/package/audit
https://www.npmjs.com/package/audit-log

------------------------------------------------------------------------------------------------

// To read data from Command Prompt in line by line.

https://www.npmjs.com/package/readline-sync
https://www.npmjs.com/package/readline2
