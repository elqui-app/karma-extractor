var path = require('path');
var chai = require('chai');
var expect = chai.expect;
var extractor = require('../src/extract');
var minimatch = require("minimatch")


var indexBasic = path.join(__dirname, 'html/index.basic.html');

var indexComplete = path.join(__dirname, 'html/index.complete.html');

describe('basic', function () {
    describe('async', function () {
        describe('without options', function () {

            var err='';
            var infos='';

            before(function (done) {
                extractor.extract(indexBasic, function (nErr, nInfos) {
                    err = nErr;
                    infos = nInfos;
                    done();
                });
            });

            it('no error', function(done) {
                expect(err).to.be.null;
                done();
            });

            it('good appName', function (done) {
                expect(infos).to.have.property('appName');
                expect(infos.appName).to.be.equal('generatePassword');
                done();
            });

            it('all script files', function (done) {
                expect(infos).to.have.property('files');
                expect(infos.files).to.have.lengthOf(4);
                expect(infos.files).to.contain('scripts/app.js');
                expect(infos.files).to.contain('scripts/generate-password.js');
                expect(infos.files).to.contain('scripts/password.js');
                expect(infos.files).to.contain('scripts/modal.js');
                done();
            });
        });


        describe('with ignore option (string, begin with "scripts/")', function () {

            var err='';
            var infos='';

            before(function (done) {
                extractor.extract(indexBasic, {ignore: 'scripts/*'}, function (nErr, nInfos) {
                    err = nErr;
                    infos = nInfos;
                    done();
                });
            });

            it('no error', function(done) {
                expect(err).to.be.null;
                done();
            });

            it('good appName', function (done) {
                expect(infos).to.have.property('appName');
                expect(infos.appName).to.be.equal('generatePassword');
                done();
            });

            it('all script files', function (done) {
                expect(infos).to.have.property('files');
                expect(infos.files).to.be.empty;
                done();
            });
        });

        describe('with ignore option (array, contains "password")', function () {

            var err='';
            var infos='';

            before(function (done) {
                extractor.extract(indexBasic, {ignore: ['*password*']}, function (nErr, nInfos) {
                    err = nErr;
                    infos = nInfos;
                    done();
                });
            });

            it('no error', function(done) {
                expect(err).to.be.null;
                done();
            });

            it('good appName', function (done) {
                expect(infos).to.have.property('appName');
                expect(infos.appName).to.be.equal('generatePassword');
                done();
            });

            it('all script files', function (done) {
                expect(infos).to.have.property('files');
                expect(infos.files).to.have.lengthOf(2);
                // console.log(infos.files);
                expect(infos.files).to.contain('scripts/app.js');
                expect(infos.files).to.contain('scripts/modal.js');
                done();
            });
        });

        describe('with prefixes option ("scripts/" -> "../" )', function () {

            var err='';
            var infos='';

            before(function (done) {
                extractor.extract(indexBasic, {prefixes: {'scripts/':'../'}}, function (nErr, nInfos) {
                    err = nErr;
                    infos = nInfos;
                    done();
                });
            });

            it('no error', function(done) {
                expect(err).to.be.null;
                done();
            });

            it('good appName', function (done) {
                expect(infos).to.have.property('appName');
                expect(infos.appName).to.be.equal('generatePassword');
                done();
            });

            it('all script files', function (done) {
                expect(infos).to.have.property('files');
                expect(infos.files).to.have.lengthOf(4);
                // console.log(infos.files);
                expect(infos.files).to.contain('../app.js');
                expect(infos.files).to.contain('../generate-password.js');
                expect(infos.files).to.contain('../password.js');
                expect(infos.files).to.contain('../modal.js');
                done();
            });
        });

    });

    describe('sync', function () {
        describe('without options', function () {
            var infos='';

            it('start sync', function (done) {
                // expect(function () {
                    infos = extractor.extractSync(indexBasic);

                // }).to.not.throw(/.*/);
                done();

            });

            it('good appName', function (done) {
                expect(infos).to.have.property('appName');
                expect(infos.appName).to.be.equal('generatePassword');
                done();
            });

            it('all script files', function (done) {
                expect(infos).to.have.property('files');
                expect(infos.files).to.have.lengthOf(4);
                expect(infos.files).to.contain('scripts/app.js');
                expect(infos.files).to.contain('scripts/generate-password.js');
                expect(infos.files).to.contain('scripts/password.js');
                expect(infos.files).to.contain('scripts/modal.js');
                done();
            });
        });


        describe('with ignore option (string, begin with "scripts/")', function () {

            var infos='';

            it('start sync', function (done) {
                infos = extractor.extractSync(indexBasic, {ignore: 'scripts/*'});
                done();

            });

            it('good appName', function (done) {
                expect(infos).to.have.property('appName');
                expect(infos.appName).to.be.equal('generatePassword');
                done();
            });

            it('all script files', function (done) {
                expect(infos).to.have.property('files');
                expect(infos.files).to.be.empty;
                done();
            });
        });

        describe('with ignore option (array, contains "password")', function () {

            var infos='';

            it('start sync', function (done) {
                infos = extractor.extractSync(indexBasic, {ignore: ['*password*']});

                done();

            });

            it('good appName', function (done) {
                expect(infos).to.have.property('appName');
                expect(infos.appName).to.be.equal('generatePassword');
                done();
            });

            it('all script files', function (done) {
                expect(infos).to.have.property('files');
                expect(infos.files).to.have.lengthOf(2);
                // console.log(infos.files);
                expect(infos.files).to.contain('scripts/app.js');
                expect(infos.files).to.contain('scripts/modal.js');
                done();
            });
        });

        describe('with prefixes option ("scripts/" -> "../" )', function () {

            var infos='';

            it('start sync', function (done) {
                infos = extractor.extractSync(indexBasic, {prefixes: {'scripts/':'../'}});
                done();
            });

            it('good appName', function (done) {
                expect(infos).to.have.property('appName');
                expect(infos.appName).to.be.equal('generatePassword');
                done();
            });

            it('all script files', function (done) {
                expect(infos).to.have.property('files');
                expect(infos.files).to.have.lengthOf(4);
                // console.log(infos.files);
                expect(infos.files).to.contain('../app.js');
                expect(infos.files).to.contain('../generate-password.js');
                expect(infos.files).to.contain('../password.js');
                expect(infos.files).to.contain('../modal.js');
                done();
            });
        });

    });
});

describe('complete', function () {
    describe('async', function () {

        describe('without options', function () {

            var err='';
            var infos='';

            before(function (done) {
                extractor.extract(indexComplete, function (nErr, nInfos) {
                    err = nErr;
                    infos = nInfos;
                    done();
                });
            });

            it('no error', function(done) {
                expect(err).to.be.null;
                done();
            });

            it('good appName', function (done) {
                expect(infos).to.have.property('appName');
                expect(infos.appName).to.be.equal('Complete');
                done();
            });

            it('all script files', function (done) {
                expect(infos).to.have.property('files');
                expect(infos.files).to.have.lengthOf(9);
                expect(infos.files).to.contain('https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0-beta1/jquery.min.js');
                expect(infos.files).to.contain('https://cdn.jsdelivr.net/semantic-ui/2.2.2/semantic.min.js');
                expect(infos.files).to.contain('https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.8/angular.min.js');
                expect(infos.files).to.contain('https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.8/angular-cookies.min.js');
                expect(infos.files).to.contain('bower_components/angular-cookies/angular-cookies.min.js');
                expect(infos.files).to.contain('scripts/app.js');
                expect(infos.files).to.contain('scripts/generate-password.js');
                expect(infos.files).to.contain('scripts/password.js');
                expect(infos.files).to.contain('scripts/modal.js');
                done();
            });
        });

/*
        describe('with ignore option (array, is "https")', function () {

            var err='';
            var infos='';

            before(function (done) {
                extractor.extract(indexComplete, {ignore: ['https://*']}, function (nErr, nInfos) {
                    err = nErr;
                    infos = nInfos;
                    done();
                });
            });

            it('no error', function(done) {
                expect(err).to.be.null;
                done();
            });

            it('good appName', function (done) {
                expect(infos).to.have.property('appName');
                expect(infos.appName).to.be.equal('Complete');
                done();
            });

            it('all script files', function (done) {
            expect(infos).to.have.property('files');
            console.log(infos.files);
            expect(infos.files).to.have.lengthOf(5);
            expect(infos.files).to.contain('bower_components/angular-cookies/angular-cookies.min.js');
            expect(infos.files).to.contain('scripts/app.js');
            expect(infos.files).to.contain('scripts/generate-password.js');
            expect(infos.files).to.contain('scripts/password.js');
            expect(infos.files).to.contain('scripts/modal.js');
                done();
            });
        });*/

        describe('with prefixes option ("bower_components/" -> "../" )', function () {

            var err='';
            var infos='';

            before(function (done) {
                extractor.extract(indexComplete, {prefixes: {'bower_components/':'../'}}, function (nErr, nInfos) {
                    err = nErr;
                    infos = nInfos;
                    done();
                });
            });

            it('no error', function(done) {
                expect(err).to.be.null;
                done();
            });

            it('good appName', function (done) {
                expect(infos).to.have.property('appName');
                expect(infos.appName).to.be.equal('Complete');
                done();
            });

            it('all script files', function (done) {
                expect(infos).to.have.property('files');
                expect(infos.files).to.have.lengthOf(9);
                expect(infos.files).to.contain('https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0-beta1/jquery.min.js');
                expect(infos.files).to.contain('https://cdn.jsdelivr.net/semantic-ui/2.2.2/semantic.min.js');
                expect(infos.files).to.contain('https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.8/angular.min.js');
                expect(infos.files).to.contain('https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.8/angular-cookies.min.js');
                expect(infos.files).to.contain('../angular-cookies/angular-cookies.min.js');
                expect(infos.files).to.contain('scripts/app.js');
                expect(infos.files).to.contain('scripts/generate-password.js');
                expect(infos.files).to.contain('scripts/password.js');
                expect(infos.files).to.contain('scripts/modal.js');
                done();
            });
        });

    });
});
