/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 28/09/16
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
const securityService = require('../../../../../src/services/core/securityService');

const mocks = require('../../mocks');

/* ************************************* */
/* ********        TESTS        ******** */
/* ************************************* */
describe('[IT] [API] Login', () => {
    describe('Login URL enabled', () => {
        let findByUsernameWithLocalHashNotNullFail = false;
        let findByUsernameWithLocalHashNotNullHasResult = false;
        let findByUsernameWithLocalHashNotNullResult = null;
        const mockUserSalt = securityService.generateSaltSync();
        let mockUserObject = null;
        let mockUserInstance = null;

        before(() => {
            const configurationWrapper = require('../../../../../src/wrapper/configurationWrapper');

            mockery.enable({
                warnOnUnregistered: false,
                useCleanCache: true,
            });

            mockery.registerMock('./shared/logger', mocks.logger);
            mockery.registerMock('../shared/logger', mocks.logger);
            mockery.registerMock('../../shared/logger', mocks.logger);
            mockery.registerMock('../dao/userDao', {
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
            getConfigResult.CRASH_REPORTER_AUTH_JWT_SECRET = 'jwt_token';
            mockery.registerMock('../../wrapper/configurationWrapper', {
                getConfig: () => getConfigResult,
                CONSTANTS: configurationWrapper.CONSTANTS,
            });

            const server = require('../../../../../src/server');

            server.buildAppSync();
            this.expressApp = server.getApp();

            // Generate user data => same username/password
            return new Promise((resolve, reject) => {
                mockUserObject = {
                    username: 'test_user',
                    role: userModel.rolesObj.normal,
                    local: {
                        salt: mockUserSalt,
                        hash: null,
                    },
                };
                securityService.generateHash(mockUserObject.username, mockUserSalt).then((hash) => {
                    mockUserObject.local.hash = hash;

                    // Create user instance
                    mockUserInstance = new userModel.User(mockUserObject);

                    // Resolve promise
                    resolve();
                }).catch(reject);
            });
        });

        after(() => {
            mockery.disable();
            mockery.deregisterAll();
        });

        afterEach(() => {
            findByUsernameWithLocalHashNotNullFail = false;
            findByUsernameWithLocalHashNotNullHasResult = false;
            findByUsernameWithLocalHashNotNullResult = null;
        });

        it('should return a 400 when no body', (done) => {
            supertest(this.expressApp)
                .post('/api/v1/login')
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
                .post('/api/v1/login')
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
                .post('/api/v1/login')
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
                .post('/api/v1/login')
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
                .post('/api/v1/login')
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

        it('should return a 401 when user not found', (done) => {
            const body = {
                username: 'not_found',
                password: 'not_found',
            };
            supertest(this.expressApp)
                .post('/api/v1/login')
                .send(body)
                .expect(401)
                .end((err, result) => {
                    if (err) {
                        done(err);
                        return;
                    }

                    const resultBody = result.body;
                    assert.equal('Unauthorized', resultBody.reason);
                    done();
                });
        });

        it('should return a 500 when findByUsernameForLocal promise is rejected', (done) => {
            // Mock data
            findByUsernameWithLocalHashNotNullFail = true;

            const body = {
                username: 'not_found',
                password: 'not_found',
            };
            supertest(this.expressApp)
                .post('/api/v1/login')
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

        it('should return a 401 when good username but wrong password', (done) => {
            // Mock data
            findByUsernameWithLocalHashNotNullHasResult = true;
            findByUsernameWithLocalHashNotNullResult = mockUserInstance;

            const body = {
                username: mockUserObject.username,
                password: 'not_found',
            };
            supertest(this.expressApp)
                .post('/api/v1/login')
                .send(body)
                .expect(401)
                .end((err, result) => {
                    if (err) {
                        done(err);
                        return;
                    }

                    const resultBody = result.body;
                    assert.equal('Unauthorized', resultBody.reason);
                    done();
                });
        });

        it('should return a 200 when good username and password', (done) => {
            // Mock data
            findByUsernameWithLocalHashNotNullHasResult = true;
            findByUsernameWithLocalHashNotNullResult = mockUserInstance;

            const body = {
                username: mockUserObject.username,
                password: mockUserObject.username,
            };
            supertest(this.expressApp)
                .post('/api/v1/login')
                .send(body)
                .expect(200)
                .end((err, result) => {
                    if (err) {
                        done(err);
                        return;
                    }

                    const resultBody = result.body;
                    assert.isTrue(Object.prototype.hasOwnProperty.call(resultBody, 'id'));
                    assert.equal(resultBody.username, mockUserObject.username);
                    assert.equal(resultBody.role, mockUserObject.role);
                    assert.isFalse(Object.prototype.hasOwnProperty.call(resultBody, 'local'));
                    const cookies = result.headers['set-cookie'];
                    assert.lengthOf(cookies, 1);
                    assert.include(cookies[0], 'id_token');
                    done();
                });
        });
    });

    describe('Login URL disabled', () => {
        let findByUsernameWithLocalHashNotNullFail = false;
        let findByUsernameWithLocalHashNotNullHasResult = false;
        let findByUsernameWithLocalHashNotNullResult = null;
        const mockUserSalt = securityService.generateSaltSync();
        let mockUserObject = null;
        let mockUserInstance = null;

        before(() => {
            const configurationWrapper = require('../../../../../src/wrapper/configurationWrapper');

            mockery.enable({
                warnOnUnregistered: false,
                useCleanCache: true,
            });

            mockery.registerMock('./shared/logger', mocks.logger);
            mockery.registerMock('../shared/logger', mocks.logger);
            mockery.registerMock('../../shared/logger', mocks.logger);
            mockery.registerMock('../dao/userDao', {
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
            getConfigResult.CRASH_REPORTER_AUTH_JWT_SECRET = 'jwt_token';
            getConfigResult.CRASH_REPORTER_AUTH_LOCAL_AUTH_ENABLED = false;
            mockery.registerMock('../../wrapper/configurationWrapper', {
                getConfig: () => getConfigResult,
                CONSTANTS: configurationWrapper.CONSTANTS,
            });

            const server = require('../../../../../src/server');

            server.buildAppSync();
            this.expressApp = server.getApp();

            // Generate user data => same username/password
            return new Promise((resolve, reject) => {
                mockUserObject = {
                    username: 'test_user',
                    role: userModel.rolesObj.normal,
                    local: {
                        salt: mockUserSalt,
                        hash: null,
                    },
                };
                securityService.generateHash(mockUserObject.username, mockUserSalt).then((hash) => {
                    mockUserObject.local.hash = hash;

                    // Create user instance
                    mockUserInstance = new userModel.User(mockUserObject);

                    // Resolve promise
                    resolve();
                }).catch(reject);
            });
        });

        after(() => {
            mockery.disable();
            mockery.deregisterAll();
        });

        afterEach(() => {
            findByUsernameWithLocalHashNotNullFail = false;
            findByUsernameWithLocalHashNotNullHasResult = false;
            findByUsernameWithLocalHashNotNullResult = null;
        });

        it('should return a 404 when login is disabled', (done) => {
            supertest(this.expressApp)
                .post('/api/v1/login')
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
