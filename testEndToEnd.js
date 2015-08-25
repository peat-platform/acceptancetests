'use strict';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
var supertest        = require('supertest-as-promised');
var config           = require('./config');
var request          = supertest(config.url);
var internal_request = supertest(config.internal);
var assert           = require('chai').assert;

var token;

//-----TYPES API-----

var testType = {
   "@reference": "genericExample",
   "@context"  : [
      {
         "@property_name": "stringArray",
         "@data_type"    : "string",
         "@multiple"     : true,
         "@required"     : true,
         "@description"      : "Array of Strings"
      }
   ]
};

var dev_user = {
   "username": "platformTestDev",
   "password": "platformTestDev"
};

var user = {
   "username": "platformTest",
   "password": "platformTest"
};

var client = {
   "name"       : "MochaTest",
   "description": "Client used for testing of the platform"
};
var session = "";
token = "";

describe('Types API', function () {
   describe('Creating Types', function () {
      it('should create GenericEntry Type', function () {
         this.timeout(10000);
         return request.post('/api/v1/types')
            .send(testType)
            .set('Accept', 'application/json')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               if ( body["error"] !== undefined && body["error"].indexOf("Type already exists") > 0 ) {
                  assert(response.status == 409, 'Message should be "Type already exists" on 409 status, not: ' + response.status)
               }
               else {
                  assert(body["@id"] !== undefined, 'Type ID should be returned not '+JSON.stringify(body));
               }
            });
      });
   });
   describe('Get Type', function () {
      it('should retrieve single type', function () {
         this.timeout(10000);
         return request.get('/api/v1/types/t_e18dd069371d528764d51c54d5bf9611-167')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert(body["@reference"] === testType["@reference"], "Body should contain correct Type reference");
               testType = body
            })
            .expect(200);
      });
   });
   describe('Get Type List', function () {
      it('should get list of types', function () {
         this.timeout(10000);
         return request.get('/api/v1/types')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert(body["meta"] !== undefined, "Check for 'meta' key");
               if ( body["meta"] !== undefined ) {
                  assert(parseInt(body["meta"]["total_count"]) > 0, 'Type count should not equal 0');
               }
            })
            .expect(200);
      });
      it('should get list of type IDs', function () {
         this.timeout(10000);
         return request.get('/api/v1/types?id_only=true')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert(body.toString().indexOf("@context") === -1, "Should not contain Type Body");
            })
            .expect(200);
      });
   });
});


//-----Authentication API-----


describe('Authentication API', function () {
   describe('Users', function () {
      it('should fail password strength check', function () {
         this.timeout(10000);
         return request.post('/api/v1/auth/users')
            .send({
               "username": "test",
               "password": "test"
            })
            .set('Accept', 'application/json')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert(body["error"] === "The password length must be between 6 and 80 characters.", 'Password Strength error should be returned not '+JSON.stringify(body))
            });
      });
      it('should create a user', function () {
         this.timeout(10000);
         return request.post('/api/v1/auth/users')
            .send(user)
            .set('Accept', 'application/json')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               if ( body["error"] !== undefined && body["error"].indexOf("exists") > 0 ) {
                  assert(response.status == 409, 'Error 409 Should be returned if user already exists')
               }
               else {
                  assert(response.status == 201, 'Status should be "201" not ' + response.status);
               }
            });
      });
      it('should create a user', function () {
         this.timeout(10000);
         return request.post('/api/v1/auth/users')
            .send(dev_user)
            .set('Accept', 'application/json')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               if ( body["error"] !== undefined && body["error"].indexOf("exists") > 0 ) {
                  assert(response.status == 409, 'Error 409 Should be returned if user already exists')
               }
               else {
                  assert(response.status == 201, 'Status should be "201" not ' + response.status);
               }
            });
      });
   });
   describe('Session', function () {
      it('should receive error about incorrect details', function () {
         this.timeout(10000);
         return request.post('/api/v1/auth/sessions')
            .send({
               "username": "platformTest",
               "password": "platformT",
               "scope"   : "user"
            })
            .set('Accept', 'application/json')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert(body["error"] === "Your password and username did not match.", 'Incorrect details error should be returned not:' + body["error"])
            })
            .expect(400)
      });
      it('should create user session', function () {
         this.timeout(10000);
         return request.post('/api/v1/auth/sessions')
            .send({
               "username": "platformTestDev",
               "password": "platformTestDev",
               "scope"   : "developer"
            })
            .set('Accept', 'application/json')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert(body["session"] !== undefined, 'User session should be returned not '+body);
               session = body["session"];
            });
      });
   });
   describe('Client', function () {
      it('should create client on platform using user details', function () {
         this.timeout(10000);
         return request.post('/api/v1/auth/clients')
            .send(client)
            .set('Accept', 'application/json')
            .set('Authorization', session)
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert(body["cloudlet"] !== undefined, 'Cloudlet should be returned with client details');
               assert(body["api_key"] !== undefined, '"api_key" should be returned with client details');
               assert(body["secret"] !== undefined, '"secret" should be returned with client details');
               client = body
            });
      });
   });
   describe('Authorization', function () {
      it('should authorize client to access data on behalf of user', function () {
         this.timeout(10000);
         return request.post('/api/v1/auth/authorizations')
            .send({
               username: user.username,
               password: user.password,
               api_key : client.api_key,
               secret  : client.secret
            })
            .set('Accept', 'application/json')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert(body["session"] !== undefined, 'Authorization session should be returned');
               token = body["session"];
            });
      });
   });
});


//-----Permissions API-----

describe('Permissions API', function () {
   describe('Creating Permissions', function () {

      it('should create GenericEntry permissions for client', function () {
         this.timeout(10000);
         return internal_request.post('/api/v1/permissions/' + client.api_key)
            .send([
               {
                  "ref"         : testType["@id"],
                  "type"        : "type",
                  "access_level": "APP",
                  "access_type" : "CREATE"
               },
               {
                  "ref"         : testType["@id"],
                  "type"        : "type",
                  "access_level": "CLOUDLET",
                  "access_type" : "READ"
               },
               {
                  "ref"         : testType["@id"],
                  "type"        : "type",
                  "access_level": "APP",
                  "access_type" : "UPDATE"
               },
               {
                  "ref"         : testType["@id"],
                  "type"        : "type",
                  "access_level": "APP",
                  "access_type" : "DELETE"
               }
            ])
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               var result;
               (body["status"] !== undefined) ? result = body["status"] : result = body["error"];
               assert(body["status"] === 'update', 'Permission status should be updated not '+result)
            });
            //.expect(200)
      });
   });
});

//-----Objects API-----

var objectid;
var object;

describe('Objects API', function () {
   describe('Creating Objects', function () {
      it('should create GenericEntry Object', function () {
         this.timeout(10000);
         return request.post('/api/v1/objects')
            .send({
               "@type": testType["@id"],
               "@data"      : {
                  "stringArray": [
                     "mock string 1",
                     "mock string 2",
                     "mock string 3"
                  ]
               }
            })
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert(body["@id"] !== undefined, "Object ID Should be returned");
               objectid = body["@id"]
            })
      });
   });
   describe('Reading Objects', function () {
      it('should Read GenericEntry Object', function () {
         this.timeout(10000);
         return request.get('/api/v1/objects/' + objectid)
            .set('Authorization', token)
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert(body["@id"] !== undefined, 'Object body should have "@id" key');
               assert(body["@type"] !== testType["@type"], 'Object type should be ' + testType["@type"]);
               object = body
            });
      });
   });
   describe('Updaing Objects', function () {
      it('should update GenericEntry Object', function () {
         this.timeout(10000);
         var data = [];
         data = object["@data"]["stringArray"];
         data.push("mock string " + Math.floor(Math.random() * 101));
         object["@data"]["stringArray"] = data;
         return request.put('/api/v1/objects/' + objectid)
            .send(object)
            .set('Authorization', token)
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert(body["@id"] !== undefined, 'Update Object responce should have "@id" key');
            });
      });
   });
   describe('Deleting Objects', function () {
      it('should delete GenericEntry Object', function () {
         this.timeout(10000);
         setTimeout(function(){

         return request.delete('/api/v1/objects/' + objectid)
            .set('Authorization', token)
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert(response.status === 200, "Should be 200 for successful delete")
            })
            .expect(200)
         }, 3000)
      })
   });
});


//-----Create Test Users-----

var userSession;
var userToken;

var createUser = function (username, password) {
   return request.post('/api/v1/auth/users')
      .send({
         "username": username,
         "password": password
      })
      .set('Accept', 'application/json')
      .expect(function (response) {
         var body = JSON.parse(response.text);
         if ( body["error"] !== undefined && body["error"].indexOf("exists") > 0 ) {
            assert(response.status == 409, 'Error 409 Should be returned if user already exists')
         }
         else {
            assert(response.status == 201, 'Status should be "201" not ' + response.status);
         }
      });
   //.then(function (err, res) {
   // return getUserSession(username, password);
   // });
};

var getUserSession = function (username, password) {
   var body;
   return request.post('/api/v1/auth/sessions')
      .send({
         "username": username,
         "password": password,
         "scope"   : "user"
      })
      .set('Accept', 'application/json')
      .expect(function (response) {
         body = JSON.parse(response.text);
         assert(body["session"] !== undefined, 'User session should be returned');
         userSession = body["session"];
      });
   //.then(function (err, res) {
   // return authenticate(username, password, body["session"]);
   // })
};

var authenticate = function (username, password, userSession) {
   var body;
   return request.post('/api/v1/auth/authorizations')
      .send({
         "username": username,
         "password": password,
         api_key   : client.api_key,
         secret    : client.secret
      })
      .set('Accept', 'application/json')
      .set('Authorization', userSession)
      .expect(function (response) {
         body = JSON.parse(response.text);
         assert(body["session"] !== undefined, 'Authorization session should be returned');
         userToken = body["session"];
      });
   //.then(function (err, res) {
   // return setPermission(testType["@id"], body["session"]);
   // });
};

var setPermission = function (typeID, userToken) {
   var body;
   return internal_request.post('/api/v1/permissions/' + client.api_key)
      .send([
         {
            "ref"         : typeID,
            "type"        : "type",
            "access_level": "APP",
            "access_type" : "CREATE"
         },
         {
            "ref"         : typeID,
            "type"        : "type",
            "access_level": "CLOUDLET",
            "access_type" : "READ"
         },
         {
            "ref"         : typeID,
            "type"        : "type",
            "access_level": "APP",
            "access_type" : "UPDATE"
         },
         {
            "ref"         : typeID,
            "type"        : "type",
            "access_level": "APP",
            "access_type" : "DELETE"
         }
      ])
      .set('Accept', 'application/json')
      .set('Authorization', userToken)
      .expect(function (response) {
         body = JSON.parse(response.text);
         assert(body["status"] === 'update', 'Permission status should be updated')
      })
      .expect(200)
};

describe('Test Users', function () {
   describe('Creating User 1', function () {
      it('should create user on system', function () {
         this.timeout(10000);
         return createUser("UserTest1", "UserTest1")
      });
      it('should create user session', function () {
         this.timeout(10000);
         return getUserSession("UserTest1", "UserTest1")
      });
      it('should authorize application to access data on behalf of user', function () {
         this.timeout(10000);
         return authenticate("UserTest1", "UserTest1", userSession)
      });
      it('should set user permission for application', function () {
         this.timeout(10000);
         return setPermission(testType["@id"], userToken)
      });
   });
   describe('Creating User 2', function () {
      it('should create user on system', function () {
         this.timeout(10000);
         return createUser("UserTest2", "UserTest2")
      });
      it('should create user session', function () {
         this.timeout(10000);
         return getUserSession("UserTest2", "UserTest2")
      });
      it('should authorize application to access data on behalf of user', function () {
         this.timeout(10000);
         return authenticate("UserTest2", "UserTest2", userSession)
      });
      it('should set user permission for application', function () {
         this.timeout(10000);
         return setPermission(testType["@id"], userToken)
      });
   });
   describe('Creating User 3', function () {
      it('should create user on system', function () {
         this.timeout(10000);
         return createUser("UserTest3", "UserTest3")
      });
      it('should create user session', function () {
         this.timeout(10000);
         return getUserSession("UserTest3", "UserTest3")
      });
      it('should authorize application to access data on behalf of user', function () {
         this.timeout(10000);
         return authenticate("UserTest3", "UserTest3", userSession)
      });
      it('should set user permission for application', function () {
         this.timeout(10000);
         return setPermission(testType["@id"], userToken)
      });
   });
   describe('Creating User 4', function () {
      it('should create user on system', function () {
         this.timeout(10000);
         return createUser("UserTest4", "UserTest4")
      });
      it('should create user session', function () {
         this.timeout(10000);
         return getUserSession("UserTest4", "UserTest4")
      });
      it('should authorize application to access data on behalf of user', function () {
         this.timeout(10000);
         return authenticate("UserTest4", "UserTest4", userSession)
      });
      it('should set user permission for application', function () {
         this.timeout(10000);
         return setPermission(testType["@id"], userToken)
      });
   });
   describe('Creating User 5', function () {
      it('should create user on system', function () {
         this.timeout(10000);
         return createUser("UserTest5", "UserTest5")
      });
      it('should create user session', function () {
         this.timeout(10000);
         return getUserSession("UserTest5", "UserTest5")
      });
      it('should authorize application to access data on behalf of user', function () {
         this.timeout(10000);
         return authenticate("UserTest5", "UserTest5", userSession)
      });
      it('should set user permission for application', function () {
         this.timeout(10000);
         return setPermission(testType["@id"], userToken)
      });
   });
   describe('Creating User 6', function () {
      it('should create user on system', function () {
         this.timeout(10000);
         return createUser("UserTest6", "UserTest6")
      });
      it('should create user session', function () {
         this.timeout(10000);
         return getUserSession("UserTest6", "UserTest6")
      });
      it('should authorize application to access data on behalf of user', function () {
         this.timeout(10000);
         return authenticate("UserTest6", "UserTest6", userSession)
      });
      it('should set user permission for application', function () {
         this.timeout(10000);
         return setPermission(testType["@id"], userToken)
      });
   });
   describe('Creating User 7', function () {
      it('should create user on system', function () {
         this.timeout(10000);
         return createUser("UserTest7", "UserTest7")
      });
      it('should create user session', function () {
         this.timeout(10000);
         return getUserSession("UserTest7", "UserTest7")
      });
      it('should authorize application to access data on behalf of user', function () {
         this.timeout(10000);
         return authenticate("UserTest7", "UserTest7", userSession)
      });
      it('should set user permission for application', function () {
         this.timeout(10000);
         return setPermission(testType["@id"], userToken)
      });
   });
   describe('Creating User 8', function () {
      it('should create user on system', function () {
         this.timeout(10000);
         return createUser("UserTest8", "UserTest8")
      });
      it('should create user session', function () {
         this.timeout(10000);
         return getUserSession("UserTest8", "UserTest8")
      });
      it('should authorize application to access data on behalf of user', function () {
         this.timeout(10000);
         return authenticate("UserTest8", "UserTest8", userSession)
      });
      it('should set user permission for application', function () {
         this.timeout(10000);
         return setPermission(testType["@id"], userToken)
      });
   });
   describe('Creating User 9', function () {
      it('should create user on system', function () {
         this.timeout(10000);
         return createUser("UserTest9", "UserTest9")
      });
      it('should create user session', function () {
         this.timeout(10000);
         return getUserSession("UserTest9", "UserTest9")
      });
      it('should authorize application to access data on behalf of user', function () {
         this.timeout(10000);
         return authenticate("UserTest9", "UserTest9", userSession)
      });
      it('should set user permission for application', function () {
         this.timeout(10000);
         return setPermission(testType["@id"], userToken)
      });
   });
   describe('Creating User 10', function () {
      it('should create user on system', function () {
         this.timeout(10000);
         return createUser("UserTest10", "UserTest10")
      });
      it('should create user session', function () {
         this.timeout(10000);
         return getUserSession("UserTest10", "UserTest10")
      });
      it('should authorize application to access data on behalf of user', function () {
         this.timeout(10000);
         return authenticate("UserTest10", "UserTest10", userSession)
      });
      it('should set user permission for application', function () {
         this.timeout(10000);
         return setPermission(testType["@id"], userToken)
      });
   });
});
