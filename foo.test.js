var proxyquire = require('proxyquire');
var sinon = require('sinon');
var assert = require('assert');
var fs = require('fs');
var path = require('path');
var foo;

describe('when path.extname(file) returns .markdown', function() {
    var extnamestub;
    var file = 'somefile';

    before(function() {
        extnamestub = sinon.stub(path, 'extname');
        foo = proxyquire('./foo', { path: { extname: extnamestub}});
        extnamestub.withArgs(file).returns('.markdown');
    });

    after(function() {
        path.extname.restore();
    });

    it('extnameAllCaps returns .markdown', function() {
        assert.equal(foo.extnameAllCaps(file), '.MARKDOWN');
    });
});
