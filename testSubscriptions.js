/**
 * Created by dconway on 12/06/15.
 */

'use strict';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
var supertest        = require('supertest-as-promised');
var request          = supertest('https://dev.openi-ict.eu');
var internal_request = supertest('https://dev.openi-ict.eu:8443');
var assert           = require('chai').assert;


var typeID   = "t_55498fbeed28c6a26946af8643e2743d-167";
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


var user = {
   session    : "",
   authToken  : "",
   cloudlet   : "",
   userDetails: {
      username: "platformTest",
      password: "platformTest",
      scope   : "user"
   },
   subscription : {
      "cloudletid": "",
      "typeid": "",
      "objectid": "",
      "data": "",
      "notification_type": "",
      "endpoint": ""
   },
   subs : []
};

var session = "";


var AppDeveloper = {
   session    : "",
   userDetails: {
      "username": "AppDeveloper",
      "password": "AppDeveloper",
      "scope"   : "developer"
   },
   client     : {
      name       : "Find-a-Friend",
      isTest     : true,
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
      }
   ]
};



//-----Test Setup-----

describe('Test Setup', function () {
   describe('Users', function () {
      it('should create a Developer', function () {
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
      it('should create a User', function () {
         this.timeout(10000);
         return request.post('/api/v1/auth/users')
            .send(user.userDetails)
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
   });
   describe('Session', function () {
      it('should create user session', function () {
         this.timeout(10000);
         return request.post('/api/v1/auth/sessions')
            .send(AppDeveloper.userDetails)
            .set('Accept', 'application/json')
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert(body["session"] !== undefined, 'User session should be returned');
               AppDeveloper.session = body["session"];
            });
      });
   });
   describe('Client', function () {
      it('should create OPENi Application', function () {
         this.timeout(10000);
         return request.post('/api/v1/auth/clients')
            .send(AppDeveloper.client)
            .set('Accept', 'application/json')
            .set('Authorization',AppDeveloper.session)
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert(body["cloudlet"] !== undefined, 'Cloudlet should be returned with client details');
               assert(body["api_key"] !== undefined, '"api_key" should be returned with client details');
               assert(body["secret"] !== undefined, '"secret" should be returned with client details');
               AppDeveloper.client = body
            });
      });
   });
   describe('Authorization', function () {
      it('should authorize client to access data on behalf of user', function () {
         this.timeout(10000);
         return request.post('/api/v1/auth/authorizations')
            .send({
               username: user.userDetails.username,
               password: user.userDetails.password,
               api_key : AppDeveloper.client.api_key,
               secret  : AppDeveloper.client.secret
            })
            .set('Accept', 'application/json')
            //.expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert(body["session"] !== undefined, 'Authorization session should be returned');
               user.authToken = body["session"];
            });
      });
   });
   describe('Permissions', function () {
      it('should create GenericEntry permissions for client', function () {
         this.timeout(10000);
         return internal_request.post('/api/v1/permissions/' + AppDeveloper.client.api_key)
            .send(AppDeveloper.permissions)
            .set('Accept', 'application/json')
            .set('Authorization', user.authToken)
            //.expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert(body["status"] === 'update', 'Permission status should be updated')
            })
            .expect(200);
      });
   });
   describe('Get Cloudlet', function () {
      it('should return users cloudlet', function () {
         this.timeout(10000);
         return request.get('/api/v1/cloudlets')
            .set('Accept', 'application/json')
            .set('Authorization', user.authToken)
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert(body["@id"] !== undefined, "Object ID Should be returned");
               user.cloudlet = body["@id"];
            })
      });
   });
   describe('Creating Object', function () {
      it('should create GenericEntry Object', function () {
         this.timeout(10000);
         return request.post('/api/v1/objects')
            .send({
               "@openi_type": typeID,
               "@data"      : {
                  "stringArray": [
                     "mock string 1",
                     "mock string 2",
                     "mock string 3"
                  ]
               }
            })
            .set('Accept', 'application/json')
            .set('Authorization', user.authToken)
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert(body["@id"] !== undefined, "Object ID Should be returned not " + JSON.stringify(body));
               //objectid = body["@id"]
            })
      });
   });
});



//-----Subscription Test-----


describe('Subscription Tests', function () {


   describe('Create Subscriptions', function () {
      it('should create SSE Subscription', function () {
         this.timeout(10000);
         return request.post('/api/v1/subscription')
            .send({
               "cloudletid"         : user.cloudlet,
               "typeid"             : typeID,
               "notification_type"  : "sse"
            })
            .set('Accept', 'application/json')
            .set('Authorization', user.authToken)
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert(response.status == 201, 'Status should be "201".');
               assert(body["id"] !== undefined, "Subscription ID Should be returned");
               if (body["id"] !== undefined) {
                  user.subs.push(body["id"])
               }
            });
      });
      it('should create Notification Subscription', function () {
         this.timeout(10000);
         return request.post('/api/v1/subscription')
            .send({
               "cloudletid"         : user.cloudlet,
               "typeid"             : typeID,
               "notification_type"  : "notification",
               "endpoint"           :  "http://localhost"
            })
            .set('Accept', 'application/json')
            .set('Authorization', user.authToken)
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert(response.status == 201, 'Status should be "201".');
               assert(body["id"] !== undefined, "Subscription ID Should be returned");
               if (body["id"] !== undefined) {
                  user.subs.push(body["id"])
               }
            });
      });
      it('should create Email Subscription', function () {
         this.timeout(10000);
         return request.post('/api/v1/subscription')
            .send({
               "cloudletid"         : user.cloudlet,
               "typeid"             : typeID,
               "notification_type"  : "email",
               "endpoint"           : "test@123.com"
            })
            .set('Accept', 'application/json')
            .set('Authorization', user.authToken)
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert(response.status == 201, 'Status should be "201".');
               assert(body["id"] !== undefined, "Subscription ID Should be returned");
               if (body["id"] !== undefined) {
                  user.subs.push(body["id"])
               }
            });
      });
      it('should create SMS Subscription', function () {
         this.timeout(10000);
         return request.post('/api/v1/subscription')
            .send({
               "cloudletid"         : user.cloudlet,
               "typeid"             : typeID,
               "notification_type"  : "sms",
               "endpoint"           : "0123456789"
            })
            .set('Accept', 'application/json')
            .set('Authorization', user.authToken)
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert(response.status == 201, 'Status should be "201".');
               assert(body["id"] !== undefined, "Subscription ID Should be returned");
               if (body["id"] !== undefined) {
                  user.subs.push(body["id"])
               }
            });
      });
      it('should create GCM Subscription', function () {
         this.timeout(10000);
         return request.post('/api/v1/subscription')
            .send({
               "cloudletid"         : user.cloudlet,
               "typeid"             : typeID,
               "notification_type"  : "gcm",
               "endpoint"           :  "DEADBEEF123456780"
            })
            .set('Accept', 'application/json')
            .set('Authorization', user.authToken)
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert(response.status == 201, 'Status should be "201".');
               assert(body["id"] !== undefined, "Subscription ID Should be returned");
               if (body["id"] !== undefined) {
                  user.subs.push(body["id"])
               }
            });
      });
      var i;
      var limit;

      var deleteSubscription = function (sub) {
         return request.del('/api/v1/subscription/'+ sub)
            .set('Accept', 'application/json')
            .set('Authorization', user.authToken)
            .expect(function (response) {
               assert(response.req.path.indexOf("undefined") == -1, 'Path should not contain "undefined" ' + response.status);
            });
      };

      for ( i = 0; i < 5; i++ ) {
         it('should delete subscription ' + i, function () {
            this.timeout(10000);
            return deleteSubscription(user.subs.pop())
         });
      }
   });
});

