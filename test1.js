'use strict';  
var supertest = require('supertest-as-promised');  
var request = supertest('https://demo2.openi-ict.eu');  
var assert = require('chai').assert;

describe('TYPES API', function() {  
  it ('pull single type', function() {
    this.timeout(10000);
    return request.get('/api/v1/types/t_52d71b14c469b88682f46d8020ab64b5-393')
      .expect('content-type', 'application/json; charset=utf-8')
      .expect(function(response) {
        var body = JSON.parse(response.text);
        assert(body["@reference"] === "Ayda Daily Sensor Readings", 'Check reference');
      })
      .expect(200);
  });
});
