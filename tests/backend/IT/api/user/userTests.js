/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 06/10/16
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
const { rolesObj } = require('../../../../../src/models/userModel');
const securityService = require('../../../../../src/services/core/securityService');

const mocks = require('../../mocks');

/* ************************************* */
/* ********        TESTS        ******** */
/* ************************************* */

describe('[IT] [API] User', () => {
    let apiToken;
    const userId = '1';
    let userDaoFindByIdFail = false;
    let userDaoFindByIdHasResult = false;
    let userDaoFindByIdResult = null;
    let userDaoSaveFail = false;
    let userDaoSaveHasResult = false;
    let userDaoSaveResult = null;
    let userDaoFindAllWithPaginationFail = false;
    let userDaoFindAllWithPaginationHasResult = false;
    let userDaoFindAllWithPaginationResult = null;
    let userDaoCountAllFail = false;
    let userDaoCountAllHasResult = false;
    let userDaoCountAllResult = null;

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
            findById: () => new Promise((resolve, reject) => {
                if (userDaoFindByIdFail) {
                    reject();
                } else if (userDaoFindByIdHasResult) {
                    resolve(userDaoFindByIdResult);
                } else {
                    resolve();
                }
            }),
            save: item => new Promise((resolve, reject) => {
                if (userDaoSaveFail) {
                    reject();
                } else if (userDaoSaveHasResult) {
                    resolve(userDaoSaveResult);
                } else {
                    resolve(item);
                }
            }),
            findAllWithPagination: () => new Promise((resolve, reject) => {
                if (userDaoFindAllWithPaginationFail) {
                    reject();
                } else if (userDaoFindAllWithPaginationHasResult) {
                    resolve(userDaoFindAllWithPaginationResult);
                } else {
                    resolve();
                }
            }),
            countAll: () => new Promise((resolve, reject) => {
                if (userDaoCountAllFail) {
                    reject();
                } else if (userDaoCountAllHasResult) {
                    resolve(userDaoCountAllResult);
                } else {
                    resolve();
                }
            }),
        });

        const getConfigResult = configurationWrapper.DEFAULT_CONFIG;
        getConfigResult.CRASH_REPORTER_AUTH_JWT_SECRET = 'jwt_token';
        mockery.registerMock('../../wrapper/configurationWrapper', {
            getConfig: () => getConfigResult,
            CONSTANTS: configurationWrapper.CONSTANTS,
        });

        const apiSecurity = require('../../../../../src/api/core/apiSecurity');

        apiToken = apiSecurity.encode({
            id: userId,
        }, {
            expiresIn: '2 days',
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
        userDaoFindByIdFail = false;
        userDaoFindByIdHasResult = false;
        userDaoFindByIdResult = null;
        userDaoSaveFail = false;
        userDaoSaveHasResult = false;
        userDaoSaveResult = null;
        userDaoFindAllWithPaginationFail = false;
        userDaoFindAllWithPaginationHasResult = false;
        userDaoFindAllWithPaginationResult = null;
        userDaoCountAllFail = false;
        userDaoCountAllHasResult = false;
        userDaoCountAllResult = null;
    });

    describe('GET /users/current/', () => {
        it('should return 401 when no security token provided', (done) => {
            supertest(this.expressApp)
                .get('/api/v1/users/current/')
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

        it('should return 401 when user not found in database', (done) => {
            supertest(this.expressApp)
                .get('/api/v1/users/current/')
                .set('Authorization', `Bearer ${apiToken}`)
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

        it('should return 200 and user data when user is a local user', (done) => {
            // Mock data
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.admin,
                username: 'test',
                projects: [],
                local: {
                    hash: 'hash',
                    salt: 'salt',
                },
                github: {
                    accessToken: undefined,
                    id: undefined,
                    profileUrl: undefined,
                },
            };
            const transformedUser = {
                id: userId,
                role: rolesObj.admin,
                username: 'test',
                github: {},
            };

            supertest(this.expressApp)
                .get('/api/v1/users/current/')
                .set('Authorization', `Bearer ${apiToken}`)
                .expect(200)
                .end((err, result) => {
                    if (err) {
                        done(err);
                        return;
                    }

                    const resultBody = result.body;
                    assert.notDeepEqual(resultBody, userDaoFindByIdResult);
                    assert.deepEqual(resultBody, transformedUser);
                    done();
                });
        });

        it('should return 200 and user data when user is a github user', (done) => {
            // Mock data
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.admin,
                username: 'test',
                projects: [],
                local: {
                    hash: undefined,
                    salt: undefined,
                },
                github: {
                    accessToken: 'access-token',
                    id: 'id',
                    profileUrl: 'profile-url',
                },
            };
            const transformedUser = {
                id: userId,
                role: rolesObj.admin,
                username: 'test',
                github: {
                    id: 'id',
                    profileUrl: 'profile-url',
                },
            };

            supertest(this.expressApp)
                .get('/api/v1/users/current/')
                .set('Authorization', `Bearer ${apiToken}`)
                .expect(200)
                .end((err, result) => {
                    if (err) {
                        done(err);
                        return;
                    }

                    const resultBody = result.body;
                    assert.notDeepEqual(resultBody, userDaoFindByIdResult);
                    assert.deepEqual(resultBody, transformedUser);
                    done();
                });
        });
    });

    describe('PUT /users/current/password', () => {
        it('should return 401 when no security token provided', (done) => {
            supertest(this.expressApp)
                .put('/api/v1/users/current/password')
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

        it('should return 401 when user not found in database', (done) => {
            supertest(this.expressApp)
                .put('/api/v1/users/current/password')
                .set('Authorization', `Bearer ${apiToken}`)
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

        it('should return 403 when user is a github user', (done) => {
            // Mock data
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.admin,
                username: 'test',
                projects: [],
                local: {
                    hash: undefined,
                    salt: undefined,
                },
                github: {
                    accessToken: 'access-token',
                    id: 'id',
                    profileUrl: 'profile-url',
                },
            };

            supertest(this.expressApp)
                .put('/api/v1/users/current/password')
                .set('Authorization', `Bearer ${apiToken}`)
                .expect(403)
                .end((err, result) => {
                    if (err) {
                        done(err);
                        return;
                    }

                    const resultBody = result.body;
                    assert.equal('Forbidden', resultBody.reason);
                    done();
                });
        });

        it('should return 400 when no body', (done) => {
            // Mock data
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.admin,
                username: 'test',
                projects: [],
                local: {
                    hash: 'hash',
                    salt: 'salt',
                },
                github: {
                    accessToken: undefined,
                    id: undefined,
                    profileUrl: undefined,
                },
            };

            supertest(this.expressApp)
                .put('/api/v1/users/current/password')
                .set('Authorization', `Bearer ${apiToken}`)
                .expect(400)
                .end((err, result) => {
                    if (err) {
                        done(err);
                        return;
                    }

                    const resultBody = result.body;
                    assert.equal('Bad Request', resultBody.reason);
                    done();
                });
        });

        it('should return 400 when empty body', (done) => {
            // Mock data
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.admin,
                username: 'test',
                projects: [],
                local: {
                    hash: 'hash',
                    salt: 'salt',
                },
                github: {
                    accessToken: undefined,
                    id: undefined,
                    profileUrl: undefined,
                },
            };

            supertest(this.expressApp)
                .put('/api/v1/users/current/password')
                .set('Authorization', `Bearer ${apiToken}`)
                .send({})
                .expect(400)
                .end((err, result) => {
                    if (err) {
                        done(err);
                        return;
                    }

                    const resultBody = result.body;
                    assert.equal('Bad Request', resultBody.reason);
                    done();
                });
        });

        it('should return 400 when empty fields', (done) => {
            const body = {
                oldPassword: '',
                newPassword: '',
            };
            // Mock data
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.admin,
                username: 'test',
                projects: [],
                local: {
                    hash: 'hash',
                    salt: 'salt',
                },
                github: {
                    accessToken: undefined,
                    id: undefined,
                    profileUrl: undefined,
                },
            };

            supertest(this.expressApp)
                .put('/api/v1/users/current/password')
                .set('Authorization', `Bearer ${apiToken}`)
                .send(body)
                .expect(400)
                .end((err, result) => {
                    if (err) {
                        done(err);
                        return;
                    }

                    const resultBody = result.body;
                    assert.equal('Bad Request', resultBody.reason);
                    done();
                });
        });

        it('should return 400 when fields too short', (done) => {
            const body = {
                oldPassword: 'a',
                newPassword: 'a',
            };
            // Mock data
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.admin,
                username: 'test',
                projects: [],
                local: {
                    hash: 'hash',
                    salt: 'salt',
                },
                github: {
                    accessToken: undefined,
                    id: undefined,
                    profileUrl: undefined,
                },
            };

            supertest(this.expressApp)
                .put('/api/v1/users/current/password')
                .set('Authorization', `Bearer ${apiToken}`)
                .send(body)
                .expect(400)
                .end((err, result) => {
                    if (err) {
                        done(err);
                        return;
                    }

                    const resultBody = result.body;
                    assert.equal('Bad Request', resultBody.reason);
                    done();
                });
        });

        it('should return 403 when old password is wrong', (done) => {
            const body = {
                oldPassword: 'password2',
                newPassword: 'password2',
            };
            // Mock data
            const salt = securityService.generateSaltSync();
            securityService.generateHash('password', salt).then((hash) => {
                userDaoFindByIdHasResult = true;
                userDaoFindByIdResult = {
                    _id: userId,
                    role: rolesObj.admin,
                    username: 'test',
                    projects: [],
                    local: {
                        hash,
                        salt,
                    },
                    github: {
                        accessToken: undefined,
                        id: undefined,
                        profileUrl: undefined,
                    },
                };

                supertest(this.expressApp)
                    .put('/api/v1/users/current/password')
                    .set('Authorization', `Bearer ${apiToken}`)
                    .send(body)
                    .expect(403)
                    .end((err, result) => {
                        if (err) {
                            done(err);
                            return;
                        }

                        const resultBody = result.body;
                        assert.equal('Forbidden', resultBody.reason);
                        done();
                    });
            }).catch(done);
        });

        it('should return 200 when user change password', (done) => {
            const body = {
                oldPassword: 'password',
                newPassword: 'password2',
            };
            // Mock data
            const salt = securityService.generateSaltSync();
            securityService.generateHash('password', salt).then((hash) => {
                userDaoFindByIdHasResult = true;
                userDaoFindByIdResult = {
                    _id: userId,
                    role: rolesObj.admin,
                    username: 'test',
                    projects: [],
                    local: {
                        hash,
                        salt,
                    },
                    github: {
                        accessToken: undefined,
                        id: undefined,
                        profileUrl: undefined,
                    },
                };

                supertest(this.expressApp)
                    .put('/api/v1/users/current/password')
                    .set('Authorization', `Bearer ${apiToken}`)
                    .send(body)
                    .expect(200)
                    .end((err) => {
                        if (err) {
                            done(err);
                            return;
                        }

                        assert.notEqual(hash, userDaoFindByIdResult.local.hash);
                        assert.notEqual(salt, userDaoFindByIdResult.local.salt);
                        done();
                    });
            }).catch(done);
        });

        it('should return 500 when user save failed', (done) => {
            const body = {
                oldPassword: 'password',
                newPassword: 'password2',
            };
            // Mock data
            const salt = securityService.generateSaltSync();
            securityService.generateHash('password', salt).then((hash) => {
                userDaoFindByIdHasResult = true;
                userDaoFindByIdResult = {
                    _id: userId,
                    role: rolesObj.admin,
                    username: 'test',
                    projects: [],
                    local: {
                        hash,
                        salt,
                    },
                    github: {
                        accessToken: undefined,
                        id: undefined,
                        profileUrl: undefined,
                    },
                };
                userDaoSaveFail = true;

                supertest(this.expressApp)
                    .put('/api/v1/users/current/password')
                    .set('Authorization', `Bearer ${apiToken}`)
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
            }).catch(done);
        });
    });

    describe('GET /users/', () => {
        it('should return 401 when no security token provided', (done) => {
            supertest(this.expressApp)
                .get('/api/v1/users/')
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

        it('should return 401 when user not found in database', (done) => {
            supertest(this.expressApp)
                .get('/api/v1/users/')
                .set('Authorization', `Bearer ${apiToken}`)
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

        it('should return 403 when user is not administrator', (done) => {
            // Mock data
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.normal,
                username: 'test',
                projects: [],
                local: {
                    hash: 'hash',
                    salt: 'salt',
                },
                github: {
                    accessToken: undefined,
                    id: undefined,
                    profileUrl: undefined,
                },
            };

            supertest(this.expressApp)
                .get('/api/v1/users/')
                .set('Authorization', `Bearer ${apiToken}`)
                .expect(403)
                .end((err, result) => {
                    if (err) {
                        done(err);
                        return;
                    }

                    const resultBody = result.body;
                    assert.equal('Forbidden', resultBody.reason);
                    done();
                });
        });

        it('should return 200 when user is administrator', (done) => {
            // Mock data
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.admin,
                username: 'test',
                projects: [],
                local: {
                    hash: 'hash',
                    salt: 'salt',
                },
                github: {
                    accessToken: undefined,
                    id: undefined,
                    profileUrl: undefined,
                },
            };
            userDaoFindAllWithPaginationHasResult = true;
            userDaoFindAllWithPaginationResult = [{
                _id: userId,
                role: rolesObj.admin,
                username: 'test',
                projects: [],
                local: {
                    hash: 'hash',
                    salt: 'salt',
                },
                github: {
                    accessToken: undefined,
                    id: undefined,
                    profileUrl: undefined,
                },
            }, {
                _id: `${userId}1`,
                role: rolesObj.normal,
                username: 'test2',
                projects: [],
                local: {
                    hash: 'hash',
                    salt: 'salt',
                },
                github: {
                    accessToken: undefined,
                    id: undefined,
                    profileUrl: undefined,
                },
            }];
            userDaoCountAllHasResult = true;
            userDaoCountAllResult = userDaoFindAllWithPaginationResult.length;

            const transformedResult = [{
                id: userId,
                role: rolesObj.admin,
                username: 'test',
                github: {},
            }, {
                id: `${userId}1`,
                role: rolesObj.normal,
                username: 'test2',
                github: {},
            }];

            supertest(this.expressApp)
                .get('/api/v1/users/')
                .set('Authorization', `Bearer ${apiToken}`)
                .expect(200)
                .end((err, result) => {
                    if (err) {
                        done(err);
                        return;
                    }

                    const resultBody = result.body;
                    resultBody.items.forEach((item, index) => assert.deepEqual(item, transformedResult[index]));
                    assert.deepEqual(resultBody.total, userDaoCountAllResult);
                    done();
                });
        });

        it('should return 500 when findAllWithPagination is rejected', (done) => {
            // Mock data
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.admin,
                username: 'test',
                projects: [],
                local: {
                    hash: 'hash',
                    salt: 'salt',
                },
                github: {
                    accessToken: undefined,
                    id: undefined,
                    profileUrl: undefined,
                },
            };
            userDaoFindAllWithPaginationFail = true;
            userDaoCountAllHasResult = true;
            userDaoCountAllResult = 0;

            supertest(this.expressApp)
                .get('/api/v1/users/')
                .set('Authorization', `Bearer ${apiToken}`)
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

        it('should return 500 when countAll is rejected', (done) => {
            // Mock data
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.admin,
                username: 'test',
                projects: [],
                local: {
                    hash: 'hash',
                    salt: 'salt',
                },
                github: {
                    accessToken: undefined,
                    id: undefined,
                    profileUrl: undefined,
                },
            };
            userDaoFindAllWithPaginationHasResult = true;
            userDaoFindAllWithPaginationResult = [];
            userDaoCountAllFail = true;

            supertest(this.expressApp)
                .get('/api/v1/users/')
                .set('Authorization', `Bearer ${apiToken}`)
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
    });
});
