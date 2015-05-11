'use strict';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
var supertest = require('supertest-as-promised');
var request = supertest('https://peat.wizeoni.com');
var assert = require('chai').assert;

var token;

//-----TYPES API-----

var testType = {
   "@reference": "genericExample",
   "@context"  : [
      {
         "@property_name": "stringArray",
         "@data_type"   : "string",
         "@multiple"     : true,
         "@required"     : true,
         "@context"   : "Array of Strings"
      }
   ]
};

describe('-----TYPES API-----\n  Create Type', function () {
   it('Create GenericEntry Type', function () {
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

describe('Get Types', function () {
   it('Get Single Type', function () {
      this.timeout(10000);
      return request.get('/api/v1/types/t_078c98b96af6474768d74f916ca70286-163')
         .expect('content-type', 'application/json; charset=utf-8')
         .expect(function (response) {
            var body = JSON.parse(response.text);
            assert(body["@reference"] === testType["@reference"], "Body should contain correct Type reference")
            testType = body
         })
         .expect(200);
   });
   it('Get Types List', function () {
      this.timeout(10000);
      return request.get('/api/v1/types')
         .expect('content-type', 'application/json; charset=utf-8')
         .expect(function (response) {
            var body = JSON.parse(response.text);
            assert(body["meta"] !== undefined, "Check for 'meta' key");
            if ( body["meta"] !== undefined ) {
               assert(parseInt(body["meta"]["total_count"]) > 0, 'Type count should not equal 0');
            }
         })
         .expect(200);
   });
   it('Types List - ID Only Flag = True', function () {
      this.timeout(10000);
      return request.get('/api/v1/types?id_only=true')
         .expect('content-type', 'application/json; charset=utf-8')
         .expect(function (response) {
            var body = JSON.parse(response.text);
            assert(body.toString().indexOf("@context") === -1, "Should not contain Type Body");
         })
         .expect(200);
   });
});



//-----Authentication API-----

var user = {
   "username": "platformTest",
   "password": "platformTest"
};
var client = {
   "name"       : "MochaTest",
   "description": "Client used for testing of the platform"
};
var session = "";
token       = "";

describe('-----Authentication API-----\n  Users', function () {
   it('Password Strength Fail', function () {
      this.timeout(10000);
      return request.post('/api/v1/auth/users')
         .send({
            "username": "test",
            "password": "test"
         })
         .set('Accept', 'application/json')
         .expect('content-type', 'application/json; charset=utf-8')
         .expect(function (response) {
            var body = JSON.parse(response.text);
            assert(body["error"] === "The password length must be between 6 and 80 characters.", 'Password Strength error should be returned')
         });
   });
   it('Create User', function () {
      this.timeout(10000);
      return request.post('/api/v1/auth/users')
         .send(user)
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
   it('User Session Incorrect Details', function () {
      this.timeout(10000);
      return request.post('/api/v1/auth/sessions')
         .send({
            "username": "platformTest",
            "password": "platformT"
         })
         .set('Accept', 'application/json')
         .expect('content-type', 'application/json; charset=utf-8')
         .expect(function (response) {
            var body = JSON.parse(response.text);
            assert(body["error"] === "Your password and username did not match.", 'Incorrect details error should be returned')
         })
         .expect(400)
   });
   it('Create User Session', function () {
      this.timeout(10000);
      return request.post('/api/v1/auth/sessions')
         .send({
            "username": "platformTest",
            "password": "platformTest"
         })
         .set('Accept', 'application/json')
         .expect('content-type', 'application/json; charset=utf-8')
         .expect(function (response) {
            var body = JSON.parse(response.text);
            assert(body["session"] !== undefined, 'User session should be returned');
            session = body["session"];
         });
   });
});

describe('Client', function () {
   it('| Create Platform Client using User Session', function () {
      this.timeout(10000);
      return request.post('/api/v1/auth/clients')
         .send(client)
         .set('Accept', 'application/json')
         .set('Authorization', session)
         .expect('content-type', 'application/json; charset=utf-8')
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
   it('├- Authorize User-Client', function () {
      this.timeout(10000);
      return request.post('/api/v1/auth/authorizations')
         .send({
            username: user.username,
            password: user.password,
            api_key : client.api_key,
            secret  : client.secret
         })
         .set('Accept', 'application/json')
         .set('Authorization', session)
         //.expect('content-type', 'application/json; charset=utf-8')
         .expect(function (response) {
            var body = JSON.parse(response.text);
            assert(body["session"] !== undefined, 'Authorization session should be returned');
            token = body["session"];
         });
   });
});

//-----Permissions API-----

describe('-----Permissions API-----\n  Create Permissions', function () {

   it('Create GenericEntry Permissions for Client', function () {
      this.timeout(10000);
      return request.post('/api/v1/permissions')
         .send([
            {
               "ref": testType["@id"],
               "type": "type",
               "access_level": "APP",
               "access_type": "CREATE"
            },
            {
               "ref": testType["@id"],
               "type": "type",
               "access_level": "CLOUDLET",
               "access_type": "READ"
            },
            {
               "ref": testType["@id"],
               "type": "type",
               "access_level": "APP",
               "access_type": "UPDATE"
            },
            {
               "ref": testType["@id"],
               "type": "type",
               "access_level": "APP",
               "access_type": "DELETE"
            }
         ])
         .set('Accept', 'application/json')
         .set('Authorization', token)
         .expect('content-type', 'application/json; charset=utf-8')
         .expect(function (response) {
            //console.log(response);
            var body = JSON.parse(response.text);
            assert(body["status"] === 'update', 'Permission status should be updated')
         })
         .expect(200)
   });
});

//-----Objects API-----

console.log(testType["@id"])

var objectid;
var object;

describe('-----Objects API-----\n  Create Objects', function () {
   it('Create GenericEntry Object', function () {
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
         .expect('content-type', 'application/json; charset=utf-8')
         .expect(function (response) {
            var body = JSON.parse(response.text);
            assert(body["@id"] !== undefined, "Object ID Should be returned");
            objectid = body["@id"]
         });
   });
   it('| Read GenericEntry Object', function () {
      this.timeout(10000);
      return request.get('/api/v1/objects/'+objectid)
         .set('Authorization', token)
         .expect('content-type', 'application/json; charset=utf-8')
         .expect(function (response) {
            var body = JSON.parse(response.text);
            assert(body["@id"] !== undefined, 'Object body should have "@id" key');
            assert(body["@data_type"] !== testType["@data_type"], 'Object type should be '+testType["@data_type"]);
            object = body
         });
   });
   it('├- Update GenericEntry Object', function () {
      this.timeout(10000);
      var data = []
      data = object["@data"]["stringArray"];
      data.push("mock string " + Math.floor(Math.random()*101));
      object["@data"]["stringArray"] = data;
      return request.put('/api/v1/objects/'+objectid)
         .send(object)
         .set('Authorization', token)
         .expect('content-type', 'application/json; charset=utf-8')
         .expect(function (response) {
            var body = JSON.parse(response.text);
            assert(body["@id"] !== undefined, 'Update Object responce should have "@id" key');
         });
   });
   it('├ Delete GenericEntry Object', function () {
      this.timeout(10000);
      return request.delete('/api/v1/objects/'+objectid)
         .set('Authorization', token)
         //.expect('content-type', 'application/json; charset=utf-8')
         .expect(function (response) {
            var body = JSON.parse(response.text);
            assert(response.status === 200, "Should be 200 for successful delete")
         })
         .expect(200)
   })
});