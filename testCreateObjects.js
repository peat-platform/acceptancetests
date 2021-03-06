'use strict';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
var supertest        = require('supertest-as-promised');
var config           = require('./config');
var request          = supertest(config.url);
var internal_request = supertest(config.internal);
var assert           = require('chai').assert;

//-----TYPES API-----


var sub_type_type = {
   "@reference": "Test Type Variations Sub Object",
   "@context": [
      {
         "@property_name": "name",
         "@data_type": "string",
         "@multiple": false,
         "@required": true,
         "@description": "Forename Name"
      },
      {
         "@property_name": "age",
         "@data_type": "int",
         "@multiple": false,
         "@required": false,
         "@description": "Age"
      },
      {
         "@property_name": "fav_nums",
         "@data_type": "int",
         "@multiple": true,
         "@required": false,
         "@description": "Favourite Numbers"
      }
   ]
};

var small_obj_type = {
   "@reference": "Test Type Variations Small",
   "@context": [
      {
         "@property_name": "name",
         "@data_type": "string",
         "@multiple": false,
         "@required": true,
         "@description": "Name of Car"
      },
      {
         "@property_name": "sub_obj",
         "@data_type": "t_ac526b83922cbf138a313269f9c204f2-395",
         "@multiple": false,
         "@required": true,
         "@description": "Sub Object"
      }
   ]
};

var  large_obj_type = {
   "@reference": "Test Type Variations Large",
   "@context": [
      {
         "@property_name": "boolean",
         "@data_type": "boolean",
         "@multiple": false,
         "@required": true,
         "@description": "boolean"
      },
      {
         "@property_name": "int",
         "@data_type": "int",
         "@multiple": false,
         "@required": true,
         "@description": "int"
      },
      {
         "@property_name": "string",
         "@data_type": "string",
         "@multiple": false,
         "@required": true,
         "@description": "string"
      },
      {
         "@property_name": "float",
         "@data_type": "float",
         "@multiple": false,
         "@required": true,
         "@description": "float"
      },
      {
         "@property_name": "url",
         "@data_type": "url",
         "@multiple": false,
         "@required": true,
         "@description": "url"
      },
      {
         "@property_name": "date",
         "@data_type": "date",
         "@multiple": false,
         "@required": true,
         "@description": "date"
      },
      {
         "@property_name": "timestamp",
         "@data_type": "timestamp",
         "@multiple": false,
         "@required": true,
         "@description": "timestamp"
      },
      {
         "@property_name": "gps",
         "@data_type": "gps",
         "@multiple": false,
         "@required": true,
         "@description": "gps"
      },
      {
         "@property_name": "hex",
         "@data_type": "hexadecimal",
         "@multiple": false,
         "@required": true,
         "@description": "hex"
      },
      {
         "@property_name": "base64",
         "@data_type": "base64",
         "@multiple": false,
         "@required": true,
         "@description": "base64"
      }
   ]
};

var sub_type_type_id  = "t_ac526b83922cbf138a313269f9c204f2-395";
var small_obj_type_id = "t_b57b89fd65c32de4960f37f6c406c13e-314";
var large_obj_type_id = "t_4335ad54f41f12fe4fffda653eefe2ce-1121";

var sub_obj_1 = {
   "@type": "t_ac526b83922cbf138a313269f9c204f2-395",
   "@data": {
      "name"     : "sub_obj_1",
      "age"      : 300,
      "fav_nums" : [10, 44, 342]
   }
};


var sub_obj_2 = {
   "@type": "t_ac526b83922cbf138a313269f9c204f2-395",
   "@data": {
      "name"     : "sub_obj_2",
      "fav_nums" : [103, 4, 23]
   }
};


var small_obj_1 = {
   "@type": "t_b57b89fd65c32de4960f37f6c406c13e-314",
   "@data": {
      "name"     : "small obj 1",
      "sub_obj"  : "replace with real object Id before creating object"
   }
};

var small_obj_2 = {
   "@type": "t_b57b89fd65c32de4960f37f6c406c13e-314",
   "@data": {
      "name"     : "small obj 1",
      "sub_obj"  : {
         "name"     : "sub_obj_literal"
      }
   }
};

var large_obj = {
   "@type": "t_4335ad54f41f12fe4fffda653eefe2ce-1121",
   "@data": {
      "boolean"   : true,
      "int"       : 1,
      "string"    : "mock string",
      "float"     : 3452.234,
      "url"       : "https://dev.peat-platform.org/admin/",
      "date"      : "06-03-1990",
      "timestamp" : "2014-04-20 10:32:55.339",
      "gps"       : "52.29504228453735,-7.895050048828125",
      "hex"       : "345AF345",
      "base64"    : "dGVzdCB0ZXN0IHRlc3Q="
   }
};


var permissions_manifest = [
   {
      "ref"         : "t_ac526b83922cbf138a313269f9c204f2-395",
      "type"        : "type",
      "access_level": "APP",
      "access_type" : "CREATE"
   },
   {
      "ref"         : "t_ac526b83922cbf138a313269f9c204f2-395",
      "type"        : "type",
      "access_level": "APP",
      "access_type" : "READ"
   },
   {
      "ref"         : "t_ac526b83922cbf138a313269f9c204f2-395",
      "type"        : "type",
      "access_level": "APP",
      "access_type" : "UPDATE"
   },
   {
      "ref"         : "t_ac526b83922cbf138a313269f9c204f2-395",
      "type"        : "type",
      "access_level": "APP",
      "access_type" : "DELETE"
   },
   {
      "ref"         : "t_b57b89fd65c32de4960f37f6c406c13e-314",
      "type"        : "type",
      "access_level": "APP",
      "access_type" : "CREATE"
   },
   {
      "ref"         : "t_b57b89fd65c32de4960f37f6c406c13e-314",
      "type"        : "type",
      "access_level": "APP",
      "access_type" : "READ"
   },
   {
      "ref"         : "t_b57b89fd65c32de4960f37f6c406c13e-314",
      "type"        : "type",
      "access_level": "APP",
      "access_type" : "UPDATE"
   },
   {
      "ref"         : "t_b57b89fd65c32de4960f37f6c406c13e-314",
      "type"        : "type",
      "access_level": "APP",
      "access_type" : "DELETE"
   },
   {
      "ref"         : "t_4335ad54f41f12fe4fffda653eefe2ce-1121",
      "type"        : "type",
      "access_level": "APP",
      "access_type" : "CREATE"
   },
   {
      "ref"         : "t_4335ad54f41f12fe4fffda653eefe2ce-1121",
      "type"        : "type",
      "access_level": "APP",
      "access_type" : "READ"
   },
   {
      "ref"         : "t_4335ad54f41f12fe4fffda653eefe2ce-1121",
      "type"        : "type",
      "access_level": "APP",
      "access_type" : "UPDATE"
   },
   {
      "ref"         : "t_4335ad54f41f12fe4fffda653eefe2ce-1121",
      "type"        : "type",
      "access_level": "APP",
      "access_type" : "DELETE"
   }
];


//create types
//get Types

//create sub object
//get sub object
//create small with reference
//get small

//create small with literal
//create small with litteral (minus optional)


var dev_user = {
   "username": "acceptance_test_platformTestDev",
   "password": "acceptance_test_platformTestDev",
   "scope"   : "developer"
};

var user = {
   "username": "acceptance_test_platformTest",
   "password": "acceptance_test_platformTest",
   "scope"   : "user"
};

var user_2 = {
   "username": "acceptance_test_platformTest_2",
   "password": "acceptance_test_platformTest_2",
   "scope"   : "user"
};

var client = {
   "name"       : "Create Object Test Client",
   "isTest"     : true,
   "description": "Client used for testing of the platform"
};


var client_2 = {
   "name"       : "Create Object Test Client Number 2",
   "isTest"     : true,
   "description": "Client used for testing of the platform no 2"
};

var app_developer_session = "";
var user_session          = "";
var user_session_2        = "";
var auth_token            = "";
var auth_token_2          = "";
var auth_token_new        = "";


describe('Teardown', function () {
   it('should delete', function () {
      this.timeout(10000);
      return internal_request.delete('/api/v1/crud/users/users_' + dev_user.username)
         .set('Accept', 'application/json')
         .set('authorization', "29f81fe0-3097-4e39-975f-50c4bf8698c7")

   });
   it('should delete', function () {
      this.timeout(10000);
      return internal_request.delete('/api/v1/crud/users/users_' + user.username)
         .set('Accept', 'application/json')
         .set('authorization', "29f81fe0-3097-4e39-975f-50c4bf8698c7")
   });
   it('should delete', function () {
      this.timeout(10000);
      return internal_request.delete('/api/v1/crud/users/users_' + user_2.username)
         .set('Accept', 'application/json')
         .set('authorization', "29f81fe0-3097-4e39-975f-50c4bf8698c7")
   })
});


describe('Types API', function () {
   describe('Creating Types', function () {
      it('should create sub Type', function () {
         this.timeout(10000);
         return request.post('/api/v1/types')
            .send(sub_type_type)
            .set('Accept', 'application/json')
            .set('authorization', "29f81fe0-3097-4e39-975f-50c4bf8698c7")
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
      }),
      it('should create small Object Type', function () {
         this.timeout(10000);
         return request.post('/api/v1/types')
            .send(small_obj_type)
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
      }),
      it('should large Object Type', function () {
         this.timeout(10000);
         return request.post('/api/v1/types')
            .send(large_obj_type)
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
      })
   });
   describe('Getting Type', function () {
      it('should retrieve sub_type type', function () {
         this.timeout(10000);
         return request.get('/api/v1/types/' + sub_type_type_id)
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert(body["@reference"] === sub_type_type["@reference"], "Body should contain correct Type reference");
            })
            .expect(200);
      }),
         it('should retrieve small obj type', function () {
         this.timeout(10000);
         return request.get('/api/v1/types/' + small_obj_type_id)
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert(body["@reference"] === small_obj_type["@reference"], "Body should contain correct Type reference");
            })
            .expect(200);
      }),
         it('should retrieve large object type', function () {
            this.timeout(10000);
            return request.get('/api/v1/types/' + large_obj_type_id)
               .expect('content-type', 'application/json; charset=utf-8')
               .expect(function (response) {
                  var body = JSON.parse(response.text);
                  assert(body["@reference"] === large_obj_type["@reference"], "Body should contain correct Type reference");
               })
               .expect(200);
      })
   });
});


describe('Setup App developer and user', function () {
   describe('Users', function () {

      it('should create a user', function () {
         this.timeout(10000);
         return request.post('/api/v1/auth/users')
            .send(user)
            .set('Accept', 'application/json')
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert(response.status == 201, 'Status should be "201".');
            });
      });
      it('should create a second user', function () {
         this.timeout(10000);
         return request.post('/api/v1/auth/users')
            .send(user_2)
            .set('Accept', 'application/json')
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert(response.status == 201, 'Status should be "201".');
            });
      });
      it('should create a developer user', function () {
         this.timeout(10000);
         return request.post('/api/v1/auth/users')
            .send(dev_user)
            .set('Accept', 'application/json')
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert(response.status == 201, 'Status should be "201".');
            });
      });
   });
   describe('Get app developer Session', function () {

      it('should create developer session', function () {
         this.timeout(10000);
         return request.post('/api/v1/auth/sessions')
            .send(dev_user)
            .set('Accept', 'application/json')
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert(body["session"] !== undefined, 'User session should be returned');
               app_developer_session = body["session"];
            });
      });

      it('should create user session', function () {
         this.timeout(10000);
         return request.post('/api/v1/auth/sessions')
            .send(user)
            .set('Accept', 'application/json')
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert(body["session"] !== undefined, 'User session should be returned');
               user_session = body["session"];
            });
      });

      it('should create user session for seond user', function () {
         this.timeout(10000);
         return request.post('/api/v1/auth/sessions')
            .send(user_2)
            .set('Accept', 'application/json')
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert(body["session"] !== undefined, 'User session should be returned');
               user_session_2 = body["session"];
            });
      });
   });


   describe('Create Test Client/App', function () {
      it('should create client on platform using user details', function () {
         this.timeout(10000);
         return request.post('/api/v1/auth/clients')
            .send(client)
            .set('Accept', 'application/json')
            .set('Authorization', app_developer_session)
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
   describe('Retrieve auth token for user and client/app', function () {
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
            //.expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert(body["session"] !== undefined, 'Authorization session should be returned');
               auth_token = body["session"];
            });
      });
      it('should authorize client to access data on behalf of second user', function () {
         this.timeout(10000);
         return request.post('/api/v1/auth/authorizations')
            .send({
               username: user_2.username,
               password: user_2.password,
               api_key : client.api_key,
               secret  : client.secret
            })
            .set('Accept', 'application/json')
            //.expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert(body["session"] !== undefined, 'Authorization session should be returned');
               auth_token_2 = body["session"];
            });
      });
   });
});

//-----Permissions API-----

describe('Permissions API', function () {
   describe('Test Permissions Not set', function () {

      it('should throw permission denied errror when I try to create sub_obj_1', function () {
         this.timeout(10000);
         return request.post('/api/v1/objects')
            .send(sub_obj_1)
            .set('Accept', 'application/json')
            .set('Authorization', auth_token)
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert.deepEqual(body, { error: 'permission denied' }, "Should say permission denied");
            })
      })
   })
});


//-----Permissions API-----

describe('Permissions API', function () {
   describe('Creating Permissions', function () {
      it('should create GenericEntry permissions for client and user', function () {
         this.timeout(10000);
         return internal_request.post('/api/v1/permissions/' + client.api_key)
            .send(permissions_manifest)
            .set('Accept', 'application/json')
            .set('Authorization', auth_token)
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert(body["status"] === 'update', 'Permission status should be updated')
            });
         //.expect(200)
      });

      it('should create GenericEntry permissions for client and second user', function () {
         this.timeout(10000);
         return internal_request.post('/api/v1/permissions/' + client.api_key)
            .send(permissions_manifest)
            .set('Accept', 'application/json')
            .set('Authorization', auth_token_2)
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert(body["status"] === 'update', 'Permission status should be updated')
            });
         //.expect(200)
      });
   });
});


//-----Objects API-----

describe('Objects API', function () {
   describe('Creating Objects', function () {
      it('should create sub_obj_1', function () {
         this.timeout(10000);
         return request.post('/api/v1/objects')
            .send(sub_obj_1)
            .set('Accept', 'application/json')
            .set('Authorization', auth_token)
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert(body["@id"] !== undefined, "Object ID Should be returned");
               sub_obj_1["@id"] = body["@id"]
            })
      }),
      it('should create sub_obj_2', function () {
         this.timeout(10000);
         return request.post('/api/v1/objects')
            .send(sub_obj_2)
            .set('Accept', 'application/json')
            .set('Authorization', auth_token)
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert(body["@id"] !== undefined, "Object ID Should be returned");
               sub_obj_2["@id"] = body["@id"]
            })
      }),
         it('should create small_obj_1', function () {
            small_obj_1["@data"].sub_obj = sub_obj_2["@id"];
            this.timeout(10000);
            return request.post('/api/v1/objects')
               .send(small_obj_1)
               .set('Accept', 'application/json')
               .set('Authorization', auth_token)
               .expect('content-type', 'application/json; charset=utf-8')
               .expect(function (response) {
                  var body = JSON.parse(response.text);
                  assert(body["@id"] !== undefined, "Object ID Should be returned");
                  small_obj_1["@id"] = body["@id"]
               })
         })
         ,
         it('should create small_obj_2', function () {
            this.timeout(10000);
            return request.post('/api/v1/objects')
               .send(small_obj_2)
               .set('Accept', 'application/json')
               .set('Authorization', auth_token)
               .expect('content-type', 'application/json; charset=utf-8')
               .expect(function (response) {
                  var body = JSON.parse(response.text);
                  assert(body["@id"] !== undefined, "Object ID Should be returned");
                  small_obj_2["@id"] = body["@id"]
               })
         })
         ,
         it('should create large_obj', function () {
            this.timeout(10000);
            return request.post('/api/v1/objects')
               .send(large_obj)
               .set('Accept', 'application/json')
               .set('Authorization', auth_token)
               .expect('content-type', 'application/json; charset=utf-8')
               .expect(function (response) {
                  var body = JSON.parse(response.text);
                  assert(body["@id"] !== undefined, "Object ID Should be returned");
                  large_obj["@id"] = body["@id"]
               })
         })
         ,
         it('should create large_obj for second user', function () {
            this.timeout(10000);
            return request.post('/api/v1/objects')
               .send(large_obj)
               .set('Accept', 'application/json')
               .set('Authorization', auth_token_2)
               .expect('content-type', 'application/json; charset=utf-8')
               .expect(function (response) {
                  var body = JSON.parse(response.text);
                  assert(body["@id"] !== undefined, "Object ID Should be returned");
               })
         })
   });
   describe('Reading Objects', function () {
      it('should Read large_obj Object', function () {
         this.timeout(10000);
         return request.get('/api/v1/objects/' + large_obj["@id"])
            .set('Authorization', auth_token)
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert.deepEqual(body["@id"],         large_obj["@id"], 'Object id should be ' + large_obj["@id"]);
               assert.deepEqual(body["@type"], large_obj["@type"], 'Object type should be ' + large_obj["@type"]);
               assert.deepEqual(body["@data"],       large_obj["@data"], 'Object @data not matching');
            });
      }),
      it('should Read small_obj_1 Object', function () {
         this.timeout(10000);
         return request.get('/api/v1/objects/' + small_obj_1["@id"])
            .set('Authorization', auth_token)
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert.deepEqual(body["@id"],         small_obj_1["@id"], 'Object id should be ' + small_obj_1["@id"]);
               assert.deepEqual(body["@type"], small_obj_1["@type"], 'Object type should be ' + small_obj_1["@type"]);
               assert.deepEqual(body["@data"],       small_obj_1["@data"], 'Object @data not matching');
            });
      }),
      it('should Read small_obj_2 Object', function () {
         this.timeout(10000);
         return request.get('/api/v1/objects/' + small_obj_2["@id"])
            .set('Authorization', auth_token)
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert.deepEqual(body["@id"],         small_obj_2["@id"], 'Object id should be ' + small_obj_2["@id"]);
               assert.deepEqual(body["@type"], small_obj_2["@type"], 'Object type should be ' + small_obj_2["@type"]);
               assert.deepEqual(body["@data"],       small_obj_2["@data"], 'Object @data not matching');
            });
      }),
      it('should Read small_obj_2 Object with resolve true', function () {
         this.timeout(10000);
         return request.get('/api/v1/objects/' + small_obj_1["@id"] + "?resolve=true")
            .set('Authorization', auth_token)
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert.deepEqual(body["@id"],         small_obj_1["@id"], 'Object id should be ' + small_obj_1["@id"]);
               assert.deepEqual(body["@type"], small_obj_1["@type"], 'Object type should be ' + small_obj_1["@type"]);
               assert.deepEqual(body["@data"], {
                                    "name": "small obj 1",
                                    "sub_obj": {
                                      "fav_nums": [ 103, 4, 23 ],
                                      "name": "sub_obj_2"
                                    }
                                 }, 'Object @data not matching');
            });
      }),

         it('Read all objects', function () {
            this.timeout(10000);
            return request.get('/api/v1/objects/')
               .set('Authorization', auth_token)
               .expect('content-type', 'application/json; charset=utf-8')
               .expect(function (response) {
                  var body = JSON.parse(response.text);
                  assert.deepEqual(body.meta.total_count,         5, 'Should read 0');
               });
         });
      it('Read all objects for second user', function () {
         this.timeout(10000);
         return request.get('/api/v1/objects/')
            .set('Authorization', auth_token_2)
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert.deepEqual(body.meta.total_count,         1, 'Should read 0');
            });
      })
   });
});


describe("Testing App token Isolation", function(){

   describe('Create Test Client/App', function () {
      it('should create client on platform using user details', function () {
         this.timeout(10000);
         return request.post('/api/v1/auth/clients')
            .send(client_2)
            .set('Accept', 'application/json')
            .set('Authorization', app_developer_session)
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert(body["cloudlet"] !== undefined, 'Cloudlet should be returned with client details');
               assert(body["api_key"] !== undefined, '"api_key" should be returned with client details');
               assert(body["secret"] !== undefined, '"secret" should be returned with client details');
               client_2 = body
            });
      });
   });
   describe('Retrieve auth token for user and client/app', function () {
      it('should authorize client to access data on behalf of user', function () {
         this.timeout(10000);
         return request.post('/api/v1/auth/authorizations')
            .send({
               username: user.username,
               password: user.password,
               api_key : client_2.api_key,
               secret  : client_2.secret
            })
            .set('Accept', 'application/json')
            //.expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert(body["session"] !== undefined, 'Authorization session should be returned');
               auth_token_new = body["session"];
            });
      })
   });
   describe('TRy to read object from other App', function() {

      it('should not Read small_obj_1 Object', function () {
         this.timeout(10000);
         return request.get('/api/v1/objects/' + small_obj_1["@id"])
            .set('Authorization', auth_token_new)
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert.deepEqual(body, {error: 'Permission denied'}, 'Object id should be denied');
            });
      });

      it('try to read list with new auth token', function () {
         this.timeout(10000);
         return request.get('/api/v1/objects/')
            .set('Authorization', auth_token_new)
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert.deepEqual(body.meta.total_count, 0, 'Should read 0');
            });
      });

      it('try to read list with app dev session token', function () {
         this.timeout(10000);
         return request.get('/api/v1/objects/')
            .set('Authorization', app_developer_session)
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert.deepEqual(body.meta.total_count, 6, 'Should read 0');
            });
      });


      it('try to read list with user session token', function () {
         this.timeout(10000);
         return request.get('/api/v1/objects')
            .set('Authorization', user_session)
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert.deepEqual(body.meta.total_count,         5, 'Should read 0');
            });
      });

      it('try to read list with user session token', function () {
         this.timeout(10000);
         return request.get('/api/v1/objects/')
            .set('Authorization', user_session_2)
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert.deepEqual(body.meta.total_count,         1, 'Should read 0');
            });
      });


      it('should create large_obj for first user and second client without authorisation', function () {
         this.timeout(10000);
         return request.post('/api/v1/objects')
            .send(large_obj)
            .set('Accept', 'application/json')
            .set('Authorization', auth_token_new)
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert.deepEqual(body, { error: 'permission denied' }, "Should be returned permission denied");
            })
      });

      it('should create permissions for client and user', function () {
         this.timeout(10000);
         return internal_request.post('/api/v1/permissions/' + client_2.api_key)
            .send(permissions_manifest)
            .set('Accept', 'application/json')
            .set('Authorization', auth_token_new)
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert(body["status"] === 'update', 'Permission status should be updated')
            });
         //.expect(200)
      });

      it('should create large_obj for first user and second client', function () {
         this.timeout(10000);
         return request.post('/api/v1/objects')
            .send(large_obj)
            .set('Accept', 'application/json')
            .set('Authorization', auth_token_new)
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert(body["@id"] !== undefined, "Object ID Should be returned");
            })
      });

      it('try to read list with user session token', function () {
         this.timeout(10000);
         return request.get('/api/v1/objects/')
            .set('Authorization', user_session)
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert.deepEqual(body.meta.total_count,         6, 'Should read 0');
            });
      });


      it('try to read list with app dev session token', function () {
         this.timeout(10000);
         return request.get('/api/v1/objects/')
            .set('Authorization', app_developer_session)
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert.deepEqual(body.meta.total_count,         7, 'Should read 0');
            });
      });


      it('try to read list with new auth token', function () {
         this.timeout(10000);
         return request.get('/api/v1/objects/')
            .set('Authorization', auth_token_new)
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert.deepEqual(body.meta.total_count,         1, 'Should read 0');
            });
      })

   });


   describe('Read object with filters', function(){

      it('Add sleep and force start n1ql', function () {
         this.timeout(10000);

            request.get('/api/v1/objects?with_property=boolean&order=descending')
               .set('Authorization', app_developer_session)
               .expect('content-type', 'application/json; charset=utf-8')
               .expect(function (response) {
                  var body = JSON.parse(response.text);
                  assert.deepEqual(body.meta.total_count,         3, 'Should read 0');
               });

         var start = new Date().getTime();
         for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > 5000){
               break;
            }
         }

      });


      it('try to read list with app dev session token (with filter and dev session)', function () {
         this.timeout(10000);
            return request.get('/api/v1/objects?with_property=boolean&order=descending')
               .set('Authorization', app_developer_session)
               .expect('content-type', 'application/json; charset=utf-8')
               .expect(function (response) {
                  var body = JSON.parse(response.text);
                  assert.deepEqual(body.meta.total_count,         3, 'Should read 3');
               });
      });



      it('try to read list with app dev session token (with property_filter and dev session)', function () {
         this.timeout(10000);
            return request.get('/api/v1/objects?with_property=hex&property_filter=hex%3D345AF345')
               .set('Authorization', app_developer_session)
               .expect('content-type', 'application/json; charset=utf-8')
               .expect(function (response) {
                  var body = JSON.parse(response.text);
                  assert.deepEqual(body.meta.total_count,         3, 'Should read 3');
               });
      });


      it('try to read list with app dev session token (with property_filter and dev session : boolean true)', function () {
         this.timeout(10000);
            return request.get('/api/v1/objects?property_filter=boolean%3Dtrue')
               .set('Authorization', app_developer_session)
               .expect('content-type', 'application/json; charset=utf-8')
               .expect(function (response) {
                  var body = JSON.parse(response.text);
                  assert.deepEqual(body.meta.total_count,         3, 'Should read 3');
               });
      });



      it('try to read list with app dev session token (with property_filter and dev session : boolean false)', function () {
         this.timeout(10000);
            return request.get('/api/v1/objects?with_property=hex&property_filter=boolean%3Dfalse')
               .set('Authorization', app_developer_session)
               .expect('content-type', 'application/json; charset=utf-8')
               .expect(function (response) {
                  var body = JSON.parse(response.text);
                  assert.deepEqual(body.meta.total_count,         0, 'Should read 0');
               });
      });


      it('try to read list with app dev session token (with filter and user session)', function () {
         this.timeout(10000);
         return request.get('/api/v1/objects?with_property=name')
            .set('Authorization', user_session)
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert.deepEqual(body.meta.total_count,         4, 'Should read 0');
            });
      });


      it('try to read list with app dev session token (with property_filter and user session)', function () {
         this.timeout(10000);
         return request.get('/api/v1/objects?property_filter=name%3Dsub_obj_1')
            .set('Authorization', user_session)
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert.deepEqual(body.meta.total_count,         1, 'Should read 0');
            });
      });


      it('try to read list with app dev session token (with filter and auth session)', function () {
         this.timeout(10000);
         return request.get('/api/v1/objects?with_property=name')
            .set('Authorization', user_session)
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert.deepEqual(body.meta.total_count,         4, 'Should read 0');
            });
      });


      it('try to read list with app dev session token (with property_filter and auth session)', function () {
         this.timeout(10000);
         return request.get('/api/v1/objects?property_filter=name%3Dsub_obj_1')
            .set('Authorization', auth_token)
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert.deepEqual(body.meta.total_count,         1, 'Should read 0');
            });
      })
   });


   describe('Search without Filters', function(){

      it('try to search with user session token', function () {
         this.timeout(10000);
         return request.get('/api/v1/search/')
            .set('Authorization', user_session)
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert.deepEqual(body.meta.total_count,         6, 'Should read 0');
            });
      });


      it('try to search with app dev session token', function () {
         this.timeout(10000);
         return request.get('/api/v1/search/')
            .set('Authorization', app_developer_session)
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert.deepEqual(body.meta.total_count,         7, 'Should read 0');
            });
      });


      it('try to search with new auth token', function () {
         this.timeout(10000);
         return request.get('/api/v1/search/')
            .set('Authorization', auth_token_new)
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert.deepEqual(body.meta.total_count,         7, 'Should read 0');
            });
      })

   });


   describe('Search with filters', function(){


      it('try to search with app dev session token (with filter and dev session)', function () {
         this.timeout(10000);
         return request.get('/api/v1/search?with_property=boolean&order=descending')
            .set('Authorization', app_developer_session)
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert.deepEqual(body.meta.total_count,         3, 'Should read 3');
            });
      });


      it('try to search with app dev session token (with property_filter and dev session)', function () {
         this.timeout(10000);
         return request.get('/api/v1/search?with_property=hex&property_filter=hex%3D345AF345')
            .set('Authorization', app_developer_session)
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert.deepEqual(body.meta.total_count,         3, 'Should read 3');
            });
      });


      it('try to search with app dev session token (with property_filter and dev session : boolean true)', function () {
         this.timeout(10000);
         return request.get('/api/v1/search?property_filter=boolean%3Dtrue')
            .set('Authorization', app_developer_session)
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert.deepEqual(body.meta.total_count,         3, 'Should read 3');
            });
      });



      it('try to search with app dev session token (with property_filter and dev session : boolean false)', function () {
         this.timeout(10000);
         return request.get('/api/v1/search?with_property=hex&property_filter=boolean%3Dfalse')
            .set('Authorization', app_developer_session)
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert.deepEqual(body.meta.total_count,         0, 'Should read 0');
            });
      });


      it('try to search with app dev session token (with filter and user session)', function () {
         this.timeout(10000);
         return request.get('/api/v1/search?with_property=name')
            .set('Authorization', user_session)
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert.deepEqual(body.meta.total_count,         4, 'Should read 0');
            });
      });


      it('try to search with app dev session token (with property_filter and user session)', function () {
         this.timeout(10000);
         return request.get('/api/v1/search?property_filter=name%3Dsub_obj_1')
            .set('Authorization', user_session)
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert.deepEqual(body.meta.total_count,         1, 'Should read 0');
            });
      });


      it('try to search with app dev session token (with filter and auth session)', function () {
         this.timeout(10000);
         return request.get('/api/v1/search?with_property=name')
            .set('Authorization', user_session)
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert.deepEqual(body.meta.total_count,         4, 'Should read 0');
            });
      });


      it('try to search with app dev session token (with property_filter and auth session)', function () {
         this.timeout(10000);
         return request.get('/api/v1/search?property_filter=name%3D*obj*')
            .set('Authorization', auth_token_new)
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(function (response) {
               var body = JSON.parse(response.text);
               assert.deepEqual(body.meta.total_count,         4, 'Should read 0');
            });
      })
   })
});

