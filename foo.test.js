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

describe('when fs.readdir calls with [file1, file]', function() {
    var readdirstub;

    before(function() {
        readdirstub = sinon.stub(fs, 'readdir');
        foo = proxyquire('./foo', { fs: { readdir: readdirstub }});
        readdirstub.withArgs('../simple').yields(null, ['file1', 'file']);
    });

    after(function() {
        fs.readdir.restore();
    });

    it('fileallcaps calls with FILE1, FILE', function(done) {
        foo.fileAllCaps('../simple', function(err, files) {
            assert.equal(err, null);
            assert.equal(files[0], 'FILE1');
            assert.equal(files[1], 'FILE');
            done();
        });
    });
});

describe('when fs.readdir returns an error', function() {
    var readdirError;
    var readdirStub;

    before(function() {
        readdirStub = sinon.stub(fs, 'readdir');
        foo = proxyquire('./foo', { fs : { readdir: readdirStub }});
        readdirError = new Error('some error');
        readdirStub.withArgs('../simple').yields(readdirError, null);
    });

    after(function() {
        fs.readdir.restore();
    });

    it('fileAllCaps calls back that error', function(done) {
        foo.fileAllCaps('../simple', function(err, files) {
            assert.equal(err, readdirError);
            assert.equal(files, null);
            done();
        });
    });
});
