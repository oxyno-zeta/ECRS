/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 25/09/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const supertest = require('supertest');
const {
    assert,
    } = require('chai');
const mockery = require('mockery');
const userModel = require('../../../../../src/models/userModel');

const mocks = require('../../mocks');

/* ************************************* */
/* ********        TESTS        ******** */
/* ************************************* */

describe('[IT] [API] Register', () => {
    describe('Register URL enabled', () => {
        let saveFail = false;
        let findByUsernameWithLocalHashNotNullFail = false;
        let findByUsernameWithLocalHashNotNullHasResult = false;
        let findByUsernameWithLocalHashNotNullResult = null;

        before(() => {
            const configurationWrapper = require('../../../../../src/wrapper/configurationWrapper');

            mockery.enable({
                warnOnUnregistered: false,
                useCleanCache: true,
            });

            mockery.registerMock('./shared/logger', mocks.logger);
            mockery.registerMock('./api/core/apiSecurity', mocks.apiSecurity);
            mockery.registerMock('../shared/logger', mocks.logger);
            mockery.registerMock('../../shared/logger', mocks.logger);
            mockery.registerMock('../dao/userDao', {
                save: instance => new Promise((resolve, reject) => {
                    if (saveFail) {
                        reject();
                    } else {
                        resolve(instance);
                    }
                }),
                findByUsernameWithLocalHashNotNull: () => new Promise((resolve, reject) => {
                    if (findByUsernameWithLocalHashNotNullFail) {
                        reject();
                    } else if (findByUsernameWithLocalHashNotNullHasResult) {
                        resolve(findByUsernameWithLocalHashNotNullResult);
                    } else {
                        resolve(null);
                    }
                }),
            });
            mockery.registerMock('./mailService', {
                sendRegisterEmail: () => new Promise(resolve => resolve()),
            });

            const getConfigResult = configurationWrapper.DEFAULT_CONFIG;
            mockery.registerMock('../../wrapper/configurationWrapper', {
                getConfig: () => getConfigResult,
                CONSTANTS: configurationWrapper.CONSTANTS,
            });

            const server = require('../../../../../src/server');

            server.buildAppSync();
            this.expressApp = server.getApp();
        });

        after(() => {
            mockery.disable();
            mockery.deregisterAll();
        });

        afterEach(() => {
            saveFail = false;
            findByUsernameWithLocalHashNotNullFail = false;
            findByUsernameWithLocalHashNotNullHasResult = false;
            findByUsernameWithLocalHashNotNullResult = null;
        });

        it('should return a 400 when no body', (done) => {
            supertest(this.expressApp)
                .post('/api/v1/register')
                .expect(400)
                .end((err, result) => {
                    if (err) {
                        done(err);
                        return;
                    }

                    const resultBody = result.body;
                    assert.equal('Bad Request', resultBody.reason);
                    assert.isTrue(Object.prototype.hasOwnProperty.call(resultBody, 'errors'));
                    assert.isArray(resultBody.errors);
                    assert.lengthOf(resultBody.errors, 4);
                    done();
                });
        });

        it('should return a 400 when empty body', (done) => {
            const body = {};
            supertest(this.expressApp)
                .post('/api/v1/register')
                .send(body)
                .expect(400)
                .end((err, result) => {
                    if (err) {
                        done(err);
                        return;
                    }

                    const resultBody = result.body;
                    assert.equal('Bad Request', resultBody.reason);
                    assert.isTrue(Object.prototype.hasOwnProperty.call(resultBody, 'errors'));
                    assert.isArray(resultBody.errors);
                    assert.lengthOf(resultBody.errors, 4);
                    done();
                });
        });

        it('should return a 400 when no password', (done) => {
            const body = {
                username: 'length',
            };
            supertest(this.expressApp)
                .post('/api/v1/register')
                .send(body)
                .expect(400)
                .end((err, result) => {
                    if (err) {
                        done(err);
                        return;
                    }

                    const resultBody = result.body;
                    assert.equal('Bad Request', resultBody.reason);
                    assert.isTrue(Object.prototype.hasOwnProperty.call(resultBody, 'errors'));
                    assert.isArray(resultBody.errors);
                    assert.lengthOf(resultBody.errors, 2);
                    done();
                });
        });

        it('should return a 400 when no username', (done) => {
            const body = {
                password: 'length',
            };
            supertest(this.expressApp)
                .post('/api/v1/register')
                .send(body)
                .expect(400)
                .end((err, result) => {
                    if (err) {
                        done(err);
                        return;
                    }

                    const resultBody = result.body;
                    assert.equal('Bad Request', resultBody.reason);
                    assert.isTrue(Object.prototype.hasOwnProperty.call(resultBody, 'errors'));
                    assert.isArray(resultBody.errors);
                    assert.lengthOf(resultBody.errors, 2);
                    done();
                });
        });

        it('should return a 400 when username and password has not required minimum length', (done) => {
            const body = {
                username: 'l',
                password: 'l',
            };
            supertest(this.expressApp)
                .post('/api/v1/register')
                .send(body)
                .expect(400)
                .end((err, result) => {
                    if (err) {
                        done(err);
                        return;
                    }

                    const resultBody = result.body;
                    assert.equal('Bad Request', resultBody.reason);
                    assert.isTrue(Object.prototype.hasOwnProperty.call(resultBody, 'errors'));
                    assert.isArray(resultBody.errors);
                    assert.lengthOf(resultBody.errors, 2);
                    done();
                });
        });

        it('should return a 400 when email is not an email', (done) => {
            const body = {
                username: 'length',
                password: 'length',
                email: 'test',
            };
            supertest(this.expressApp)
                .post('/api/v1/register')
                .send(body)
                .expect(400)
                .end((err, result) => {
                    if (err) {
                        done(err);
                        return;
                    }

                    const resultBody = result.body;
                    assert.equal('Bad Request', resultBody.reason);
                    assert.isTrue(Object.prototype.hasOwnProperty.call(resultBody, 'errors'));
                    assert.isArray(resultBody.errors);
                    assert.lengthOf(resultBody.errors, 1);
                    done();
                });
        });

        it('should return a 409 when username already exists', (done) => {
            // Mock result for find in database
            findByUsernameWithLocalHashNotNullHasResult = true;
            findByUsernameWithLocalHashNotNullResult = {
                username: 'length',
            };

            const body = {
                username: 'length',
                password: 'length',
            };
            supertest(this.expressApp)
                .post('/api/v1/register')
                .send(body)
                .expect(409)
                .end((err, result) => {
                    if (err) {
                        done(err);
                        return;
                    }

                    const resultBody = result.body;
                    assert.equal('Conflict', resultBody.reason);
                    done();
                });
        });

        it('should return a 409 when username already exists and email provided', (done) => {
            // Mock result for find in database
            findByUsernameWithLocalHashNotNullHasResult = true;
            findByUsernameWithLocalHashNotNullResult = {
                username: 'length',
            };

            const body = {
                username: 'length',
                password: 'length',
                email: 'test@test.com',
            };
            supertest(this.expressApp)
                .post('/api/v1/register')
                .send(body)
                .expect(409)
                .end((err, result) => {
                    if (err) {
                        done(err);
                        return;
                    }

                    const resultBody = result.body;
                    assert.equal('Conflict', resultBody.reason);
                    done();
                });
        });

        it('should return a 500 when findByUsernameForLocal promise is rejected', (done) => {
            // Mock result for find in database
            findByUsernameWithLocalHashNotNullFail = true;

            const body = {
                username: 'length',
                password: 'length',
            };
            supertest(this.expressApp)
                .post('/api/v1/register')
                .send(body)
                .expect(500)
                .end((err, result) => {
                    if (err) {
                        done(err);
                        return;
                    }

                    const resultBody = result.body;
                    assert.equal('Internal Server Error', resultBody.reason);
                    done();
                });
        });

        it('should return a 500 when save promise is rejected', (done) => {
            // Mock result for find in database
            findByUsernameWithLocalHashNotNullHasResult = true;
            findByUsernameWithLocalHashNotNullResult = null;
            saveFail = true;

            const body = {
                username: 'length',
                password: 'length',
            };
            supertest(this.expressApp)
                .post('/api/v1/register')
                .send(body)
                .expect(500)
                .end((err, result) => {
                    if (err) {
                        done(err);
                        return;
                    }

                    const resultBody = result.body;
                    assert.equal('Internal Server Error', resultBody.reason);
                    done();
                });
        });

        it('should return a 201 when register succeed', (done) => {
            // Mock result for find in database
            findByUsernameWithLocalHashNotNullHasResult = true;
            findByUsernameWithLocalHashNotNullResult = null;

            const body = {
                username: 'length',
                password: 'length',
            };
            supertest(this.expressApp)
                .post('/api/v1/register')
                .send(body)
                .expect(201)
                .end((err, result) => {
                    if (err) {
                        done(err);
                        return;
                    }

                    const resultBody = result.body;
                    assert.equal(body.username, resultBody.username);
                    assert.equal(userModel.rolesObj.normal, resultBody.role);
                    done();
                });
        });
    });
    describe('Register URL disabled', () => {
        let saveFail = false;
        let findByUsernameWithLocalHashNotNullFail = false;
        let findByUsernameWithLocalHashNotNullHasResult = false;
        let findByUsernameWithLocalHashNotNullResult = null;

        before(() => {
            const configurationWrapper = require('../../../../../src/wrapper/configurationWrapper');

            mockery.enable({
                warnOnUnregistered: false,
                useCleanCache: true,
            });

            mockery.registerMock('./shared/logger', mocks.logger);
            mockery.registerMock('./api/core/apiSecurity', mocks.apiSecurity);
            mockery.registerMock('../shared/logger', mocks.logger);
            mockery.registerMock('../../shared/logger', mocks.logger);
            mockery.registerMock('../dao/userDao', {
                save: instance => new Promise((resolve, reject) => {
                    if (saveFail) {
                        reject();
                    } else {
                        resolve(instance);
                    }
                }),
                findByUsernameWithLocalHashNotNull: () => new Promise((resolve, reject) => {
                    if (findByUsernameWithLocalHashNotNullFail) {
                        reject();
                    } else if (findByUsernameWithLocalHashNotNullHasResult) {
                        resolve(findByUsernameWithLocalHashNotNullResult);
                    } else {
                        resolve(null);
                    }
                }),
            });
            mockery.registerMock('./mailService', {
                sendRegisterEmail: () => new Promise(resolve => resolve()),
            });

            const getConfigResult = configurationWrapper.DEFAULT_CONFIG;
            getConfigResult.CRASH_REPORTER_LOCAL_REGISTER_ENABLED = false;
            mockery.registerMock('../../wrapper/configurationWrapper', {
                getConfig: () => getConfigResult,
                CONSTANTS: configurationWrapper.CONSTANTS,
            });

            const server = require('../../../../../src/server');

            server.buildAppSync();
            this.expressApp = server.getApp();
        });

        after(() => {
            mockery.disable();
            mockery.deregisterAll();
        });

        afterEach(() => {
            saveFail = false;
            findByUsernameWithLocalHashNotNullFail = false;
            findByUsernameWithLocalHashNotNullHasResult = false;
            findByUsernameWithLocalHashNotNullResult = null;
        });

        it('should return a 404 when register is disabled', (done) => {
            supertest(this.expressApp)
                .post('/api/v1/register')
                .expect(404)
                .end((err, result) => {
                    if (err) {
                        done(err);
                        return;
                    }
                    done();
                });
        });
    });
});
