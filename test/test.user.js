var should = require("should");
var Account = require("../models/account.js");
var db;

describe('Account', function() {

  beforeEach(function(done) {
    var account = new Account({
      username: '12345',
      password: 'testy'
    });

    account.save(function(error) {
      if (error) console.log('error' + error.message);
      else console.log('no error');
      done();
    });
  });

  it('find a user by username', function(done) {
    Account.findOne({ username: '12345' }, function(err, account) {
      account.username.should.eql('12345');
      console.log("   username: ", account.username);
      done();
    });
  });

  afterEach(function(done) {
    Account.remove({}, function() {
      done();
    });
  });

});
