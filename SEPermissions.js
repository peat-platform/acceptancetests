/**
 * Created by dconway on 13/05/15.
 */
'use strict';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
var supertest = require('supertest-as-promised');
var request = supertest('https://dev.openi-ict.eu');
var assert = require('chai').assert;


//describe('Service Enablers', function () {
//   describe('Authentication API', function () {
//
//   });
//});

var testType = {
   "@reference": "genericExample",
   "@context"  : [
      {
         "@property_name": "stringArray",
         "@openi_type"    : "string",
         "@multiple"     : true,
         "@required"     : true,
         "@context_id"      : "Array of Strings"
      }
   ]
};

var SEDeveloper = {
   session    : "",
   userDetails: {
      username: "SEDeveloper",
      password: "SEDeveloper"
   },
   client     : {
      name       : "Discovery Service",
      isSE       : true,
      description: "This service enables apps to add social networks features by allowing them search for other users of the app"
   }

};


var AppDeveloper = {
   session    : "",
   userDetails: {
      "username": "AppDeveloper",
      "password": "AppDeveloper"
   },
   client     : {
      name       : "Find-a-Friend",
      description: "This application uses the Discovery SE to allow users to find their friends, somehow."
   },
   //Hardcoded... NOT GOOD
   permissions: [
      {
         "ref"         : "t_55498fbeed28c6a26946af8643e2743d-167",
         "type"        : "type",
         "access_level": "APP",
         "access_type" : "CREATE"
      },
      {
         "ref"         : "t_55498fbeed28c6a26946af8643e2743d-167",
         "type"        : "type",
         "access_level": "CLOUDLET",
         "access_type" : "READ"
      },
      {
         "ref"         : "t_55498fbeed28c6a26946af8643e2743d-167",
         "type"        : "type",
         "access_level": "APP",
         "access_type" : "UPDATE"
      },
      {
         "ref"         : "t_55498fbeed28c6a26946af8643e2743d-167",
         "type"        : "type",
         "access_level": "APP",
         "access_type" : "DELETE"
      },
      {
         "ref" : "Discovery Service",
         "type": "service_enabler"
      }
   ]
};

describe('Service Enablers', function () {
   describe('Setup', function () {
      describe('Creating Types', function () {
         it('should create GenericEntry Type for use by test', function () {
            this.timeout(10000);
            return request.post('/api/v1/types')
               .send(testType)
               .set('Accept', 'application/json')
               .expect('content-type', 'application/json; charset=utf-8')
               .expect(function (response) {
                  var body = JSON.parse(response.text);
                  if ( body["error"] !== undefined && body["error"].indexOf("Type already exists") > 0 ) {
                     assert(response.status == 409, 'Message should be "Type already exists" on 409 status')
                  }
                  else {
                     assert(body["@id"] !== undefined, 'Type ID should be returned');
                  }
               });
         });
      });
   });
   describe('Create Service Enabler', function () {
      it('should create the user "SEDeveloper" on the platform', function () {
         this.timeout(10000);
         return request.post('/api/v1/auth/users')
            .send(SEDeveloper.userDetails)
            .set('Accept', 'application/json')
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               if ( body["error"] !== undefined && body["error"].indexOf("exists") > 0 ) {
                  assert(response.status == 409, 'Error 409 Should be returned if user already exists')
               }
               else {
                  assert(response.status == 201, 'Status should be "201".');
               }
            });
      });

      it('should log SEDeveloper into the Platform', function () {
         this.timeout(10000);
         return request.post('/api/v1/auth/sessions')
            .send(SEDeveloper.userDetails)
            .set('Accept', 'application/json')
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert(body["session"] !== undefined, 'User session should be returned');
               SEDeveloper.session = body["session"];
            });
      });

      it('should create SE on platform', function () {
         this.timeout(10000);
         return request.post('/api/v1/auth/clients')
            .send(SEDeveloper.client)
            .set('Accept', 'application/json')
            .set('Authorization', SEDeveloper.session)
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert(body["cloudlet"] !== undefined, 'Cloudlet should be returned with client details');
               assert(body["api_key"] !== undefined, '"api_key" should be returned with client details');
               assert(body["secret"] !== undefined, '"secret" should be returned with client details');
               assert(body["isSE"] === true, 'SE not created correctly, "isSE" field does not exist');
               SEDeveloper.client = body
            });
      });

   });

   describe('Create Application to use SE', function () {
      it('should create the user "AppDeveloper" on the platform', function () {
         this.timeout(10000);
         return request.post('/api/v1/auth/users')
            .send(AppDeveloper.userDetails)
            .set('Accept', 'application/json')
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               if ( body["error"] !== undefined && body["error"].indexOf("exists") > 0 ) {
                  assert(response.status == 409, 'Error 409 Should be returned if user already exists')
               }
               else {
                  assert(response.status == 201, 'Status should be "201".');
               }
            });
      });

      it('should log AppDeveloper into the Platform', function () {
         this.timeout(10000);
         return request.post('/api/v1/auth/sessions')
            .send(SEDeveloper.userDetails)
            .set('Accept', 'application/json')
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert(body["session"] !== undefined, 'User session should be returned');
               AppDeveloper.session = body["session"];
            });
      });

      it('should create Application on platform', function () {
         this.timeout(10000);
         return request.post('/api/v1/auth/clients')
            .send(AppDeveloper.client)
            .set('Accept', 'application/json')
            .set('Authorization', AppDeveloper.session)
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert(body["cloudlet"] !== undefined, 'Cloudlet should be returned with client details');
               assert(body["api_key"] !== undefined, '"api_key" should be returned with client details');
               assert(body["secret"] !== undefined, '"secret" should be returned with client details');
               AppDeveloper.client = body
            });
      });


      it('should create SE permissions for App', function () {
         this.timeout(10000);
         return request.post('/api/v1/app_permissions')
            .send(AppDeveloper.permissions)
            .set('Accept', 'application/json')
            .set('Authorization', AppDeveloper.session)
            //.expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert(body[0]["status"] === 'update', 'Permission status should be {"status":"update"} but was:\n\t' + JSON.stringify(body))
            })
      });

   });

   describe('Create Test Users', function () {

      var userSession;
      var userToken;

      var createUser = function (username, password) {
         return request.post('/api/v1/auth/users')
            .send({
               "username": username,
               "password": password
            })
            .set('Accept', 'application/json')
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               if ( body["error"] !== undefined && body["error"].indexOf("exists") > 0 ) {
                  assert(response.status == 409, 'Error 409 Should be returned if user already exists')
               }
               else {
                  assert(response.status == 201, 'Status should be "201".');
               }
            });
      };

      var getUserSession = function (username, password) {
         var body;
         return request.post('/api/v1/auth/sessions')
            .send({
               "username": username,
               "password": password
            })
            .set('Accept', 'application/json')
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               body = JSON.parse(response.text);
               assert(body["session"] !== undefined, 'User session should be returned');
               userSession = body["session"];
            });
      };

      var authenticate = function (username, password, userSession) {
         var body;
         return request.post('/api/v1/auth/authorizations')
            .send({
               "username": username,
               "password": password,
               api_key   : AppDeveloper.client.api_key,
               secret    : AppDeveloper.client.secret
            })
            .set('Accept', 'application/json')
            .set('Authorization', userSession)
            //.expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               body = JSON.parse(response.text);
               assert(body["session"] !== undefined, 'Authorization session should be returned');
               userToken = body["session"];
            });
      };

      var setPermission = function (userToken) {
         var body;
         return request.post('/api/v1/permissions')
            .send(AppDeveloper.permissions)
            .set('Accept', 'application/json')
            .set('Authorization', userToken)
            //.expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               body = JSON.parse(response.text);
               assert(body[0]["status"] === 'update', 'Permission status should be {"status":"update"} but was:\n\t' + JSON.stringify(body))
            })
      };

      var i;
      for ( i = 0; i < 1; i++ ) {
         describe('Create user' + i.toString(), function () {

            var user = "UserTest" + i.toString();

            it('should create user' + i.toString() + ' on system', function () {
               this.timeout(10000);
               return createUser(user, user)
            });
            it('should create user session', function () {
               this.timeout(10000);
               return getUserSession(user, user)
            });
            it('should authorize application to access data on behalf of user', function () {
               this.timeout(10000);
               return authenticate(user, user, userSession)
            });
            it('should set user permission for application', function () {
               this.timeout(10000);
               return setPermission(userToken)
            });
         });

         describe('Create object for user' + i.toString(), function () {
            it('should create GenericEntry Object', function () {
               this.timeout(10000);
               return request.post('/api/v1/objects')
                  .send({
                     "@openi_type": "t_55498fbeed28c6a26946af8643e2743d-167",
                     "@data": {
                        "stringArray": [
                           "mock string " + Math.floor(Math.random() * 101),
                           "mock string " + Math.floor(Math.random() * 101),
                           "mock string " + Math.floor(Math.random() * 101)
                        ]
                     }
                  })
                  .set('Accept', 'application/json')
                  .set('Authorization', userToken)
                  .expect('content-type', 'application/json; charset=utf-8')
                  .expect(function (response) {
                     var body = JSON.parse(response.text);
                     assert(body["@id"] !== undefined, "Object ID Should be returned. Received \n\t"+JSON.stringify(body));
                  })
            });
         });

         describe('Validate Service Enabler Permissions for User'+ i.toString() +' Objects', function () {

            var AppView = null;
            var SEView = null;

            it('should get objectIDs from Application viewpoint', function () {
               this.timeout(10000);
               return request.get('/api/v1/search?id_only=true')
                  .set('Accept', 'application/json')
                  .set('Authorization', AppDeveloper.session)
                  .expect('content-type', 'application/json; charset=utf-8')
                  .expect(function (response) {
                     var body = JSON.parse(response.text);
                     assert(body["meta"] !== undefined, "Responce should contain 'meta' key");
                     assert(parseInt(body["meta"]["total_count"]) > 0, "Object count from Application Viewpoint should not be 0");
                     if(parseInt(body["meta"]["total_count"]) > 0) {
                        AppView = body;
                     }
                  });
            });

            it('should get objectIDs from Service Enabler viewpoint', function () {
               this.timeout(10000);
               return request.get('/api/v1/search?id_only=true')
                  .set('Accept', 'application/json')
                  .set('Authorization', SEDeveloper.session)
                  .expect('content-type', 'application/json; charset=utf-8')
                  .expect(function (response) {
                     var body = JSON.parse(response.text);
                     //console.log(JSON.stringify(body));
                     assert(parseInt(body["meta"]["total_count"]) > 0, "Object count from Service Enabler Viewpoint should not be 0");
                     if(parseInt(body["meta"]["total_count"]) > 0) {
                        SEView = body;
                     }
                  });
            });

            it('Service Enabler and Application viewpoints should be the same.', function () {
               assert(AppView !== null, "Objects from Application viewpoint should not be null!");
               assert(SEView !== null, "Objects from Service Enabler viewpoint should not be null!");
               assert(JSON.stringify(AppView) === JSON.stringify(SEView), "Object lists from Application and Service enabler viewpoint should be equal");
            });

         });

      }

   });

});