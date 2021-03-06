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
const { rolesObj, roles } = require('../../../../../src/models/userModel');
const securityService = require('../../../../../src/services/core/securityService');

const mocks = require('../../mocks');

/* ************************************* */
/* ********        TESTS        ******** */
/* ************************************* */

describe('[IT] [API] User', () => {
    let apiToken;
    const userId = '1';
    const userId2 = '2';
    let userDaoFindByIdFail = false;
    let userDaoFindByIdHasObjectResult = false;
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
    let userDaoFindOtherAdministratorFail = false;
    let userDaoFindOtherAdministratorHasResult = false;
    let userDaoFindOtherAdministratorResult = null;
    let projectDaoFindByIdHasObjectResult = false;
    let projectDaoFindByIdHasResult = false;
    let projectDaoFindByIdFail = false;
    let projectDaoFindByIdResult = null;
    let userDaoRemoveByIdFail = false;
    let projectDaoDeleteByIdFail = false;
    let userDaoFindByUsernameWithLocalHashNotNullFail = false;
    let userDaoFindByUsernameWithLocalHashNotNullHasResult = false;
    let userDaoFindByUsernameWithLocalHashNotNullResult = null;

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
            findById: id => new Promise((resolve, reject) => {
                if (userDaoFindByIdFail) {
                    reject();
                } else if (userDaoFindByIdHasObjectResult) {
                    resolve(userDaoFindByIdResult[id]);
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
            findOtherAdministrator: () => new Promise((resolve, reject) => {
                if (userDaoFindOtherAdministratorFail) {
                    reject();
                } else if (userDaoFindOtherAdministratorHasResult) {
                    resolve(userDaoFindOtherAdministratorResult);
                } else {
                    resolve();
                }
            }),
            removeById: () => new Promise((resolve, reject) => {
                if (userDaoRemoveByIdFail) {
                    reject();
                } else {
                    resolve();
                }
            }),
            findByUsernameWithLocalHashNotNull: () => new Promise((resolve, reject) => {
                if (userDaoFindByUsernameWithLocalHashNotNullFail) {
                    reject();
                } else if (userDaoFindByUsernameWithLocalHashNotNullHasResult) {
                    resolve(userDaoFindByUsernameWithLocalHashNotNullResult);
                } else {
                    resolve();
                }
            }),
        });
        mockery.registerMock('../dao/projectDao', {
            findById: id => new Promise((resolve, reject) => {
                if (projectDaoFindByIdFail) {
                    reject();
                } else if (projectDaoFindByIdHasObjectResult) {
                    resolve(projectDaoFindByIdResult[id]);
                } else if (projectDaoFindByIdHasResult) {
                    resolve(projectDaoFindByIdResult);
                } else {
                    resolve();
                }
            }),
            deleteById: () => new Promise((resolve, reject) => {
                if (projectDaoDeleteByIdFail) {
                    reject();
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
        userDaoFindByIdHasObjectResult = false;
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
        userDaoFindOtherAdministratorFail = false;
        userDaoFindOtherAdministratorHasResult = false;
        userDaoFindOtherAdministratorResult = null;
        projectDaoFindByIdHasObjectResult = false;
        projectDaoFindByIdHasResult = false;
        projectDaoFindByIdFail = false;
        projectDaoFindByIdResult = null;
        userDaoRemoveByIdFail = false;
        projectDaoDeleteByIdFail = false;
        userDaoFindByUsernameWithLocalHashNotNullFail = false;
        userDaoFindByUsernameWithLocalHashNotNullHasResult = false;
        userDaoFindByUsernameWithLocalHashNotNullResult = null;
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

    describe('PUT /users/:id/password', () => {
        it('should return 401 when no security token provided', (done) => {
            supertest(this.expressApp)
                .put(`/api/v1/users/${userId}/password`)
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
                .put(`/api/v1/users/${userId}/password`)
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
                .put(`/api/v1/users/${userId}/password`)
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
                .put(`/api/v1/users/${userId}/password`)
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
                .put(`/api/v1/users/${userId}/password`)
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
                .put(`/api/v1/users/${userId}/password`)
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

        it('should return 404 when user is not found in database', (done) => {
            const body = {
                newPassword: 'password2',
            };
            // Mock data
            const salt = securityService.generateSaltSync();
            securityService.generateHash('password', salt).then((hash) => {
                userDaoFindByIdHasObjectResult = true;
                userDaoFindByIdResult = {};
                userDaoFindByIdResult[userId] = {
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
                    .put(`/api/v1/users/${userId2}/password`)
                    .set('Authorization', `Bearer ${apiToken}`)
                    .send(body)
                    .expect(404)
                    .end((err, result) => {
                        if (err) {
                            done(err);
                            return;
                        }

                        const resultBody = result.body;
                        assert.equal('Not Found', resultBody.reason);
                        done();
                    });
            }).catch(done);
        });

        it('should return 403 when user is a github user', (done) => {
            const body = {
                newPassword: 'password2',
            };
            // Mock data
            const salt = securityService.generateSaltSync();
            securityService.generateHash('password', salt).then((hash) => {
                userDaoFindByIdHasObjectResult = true;
                userDaoFindByIdResult = {};
                userDaoFindByIdResult[userId] = {
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
                userDaoFindByIdResult[userId2] = {
                    _id: userId2,
                    role: rolesObj.admin,
                    username: 'test2',
                    projects: [],
                    local: {
                        hash: undefined,
                        salt: undefined,
                    },
                    github: {
                        accessToken: 'accessToken',
                        id: 'id',
                        profileUrl: 'profileUrl',
                    },
                };

                supertest(this.expressApp)
                    .put(`/api/v1/users/${userId2}/password`)
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

        it('should return 200 when user is a local user', (done) => {
            const body = {
                newPassword: 'password2',
            };
            // Mock data
            const salt = securityService.generateSaltSync();
            securityService.generateHash('password', salt).then((hash) => {
                userDaoFindByIdHasObjectResult = true;
                userDaoFindByIdResult = {};
                userDaoFindByIdResult[userId] = {
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
                userDaoFindByIdResult[userId2] = {
                    _id: userId2,
                    role: rolesObj.admin,
                    username: 'test2',
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
                const transformedResponse = {
                    id: userId2,
                    role: rolesObj.admin,
                    username: 'test2',
                    github: {},
                };

                supertest(this.expressApp)
                    .put(`/api/v1/users/${userId2}/password`)
                    .set('Authorization', `Bearer ${apiToken}`)
                    .send(body)
                    .expect(200)
                    .end((err, result) => {
                        if (err) {
                            done(err);
                            return;
                        }

                        const resultBody = result.body;
                        assert.notEqual(userDaoFindByIdResult[userId2].local.salt, salt);
                        assert.notEqual(userDaoFindByIdResult[userId2].local.hash, hash);
                        assert.deepEqual(transformedResponse, resultBody);
                        done();
                    });
            }).catch(done);
        });

        it('should return 500 when user save failed', (done) => {
            const body = {
                newPassword: 'password2',
            };
            // Mock data
            const salt = securityService.generateSaltSync();
            securityService.generateHash('password', salt).then((hash) => {
                userDaoFindByIdHasObjectResult = true;
                userDaoFindByIdResult = {};
                userDaoFindByIdResult[userId] = {
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
                userDaoFindByIdResult[userId2] = {
                    _id: userId2,
                    role: rolesObj.admin,
                    username: 'test2',
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
                    .put(`/api/v1/users/${userId2}/password`)
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

    describe('DELETE /users/:id/', () => {
        it('should return 401 when no security token provided', (done) => {
            supertest(this.expressApp)
                .delete(`/api/v1/users/${userId}/`)
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
                .delete(`/api/v1/users/${userId}/`)
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

        it('should return 404 when user is not found', (done) => {
            // Mock data
            const salt = securityService.generateSaltSync();
            securityService.generateHash('password', salt).then((hash) => {
                userDaoFindByIdHasObjectResult = true;
                userDaoFindByIdResult = {};
                userDaoFindByIdResult[userId] = {
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
                    .delete(`/api/v1/users/${userId2}/`)
                    .set('Authorization', `Bearer ${apiToken}`)
                    .expect(404)
                    .end((err, result) => {
                        if (err) {
                            done(err);
                            return;
                        }

                        const resultBody = result.body;
                        assert.equal('Not Found', resultBody.reason);
                        done();
                    });
            }).catch(done);
        });

        it('should return 403 when user is last administrator', (done) => {
            // Mock data
            const salt = securityService.generateSaltSync();
            securityService.generateHash('password', salt).then((hash) => {
                userDaoFindByIdHasObjectResult = true;
                userDaoFindByIdResult = {};
                userDaoFindByIdResult[userId] = {
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
                userDaoFindByIdResult[userId2] = {
                    _id: userId2,
                    role: rolesObj.admin,
                    username: 'test2',
                    projects: [],
                    local: {
                        hash: undefined,
                        salt: undefined,
                    },
                    github: {
                        accessToken: 'accessToken',
                        id: 'id',
                        profileUrl: 'profileUrl',
                    },
                };

                supertest(this.expressApp)
                    .delete(`/api/v1/users/${userId2}/`)
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
            }).catch(done);
        });

        it('should return 204 when want to remove an administrator', (done) => {
            // Mock data
            const salt = securityService.generateSaltSync();
            securityService.generateHash('password', salt).then((hash) => {
                userDaoFindByIdHasObjectResult = true;
                userDaoFindByIdResult = {};
                userDaoFindByIdResult[userId] = {
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
                userDaoFindByIdResult[userId2] = {
                    _id: userId2,
                    role: rolesObj.admin,
                    username: 'test2',
                    projects: ['project1'],
                    local: {
                        hash: undefined,
                        salt: undefined,
                    },
                    github: {
                        accessToken: 'accessToken',
                        id: 'id',
                        profileUrl: 'profileUrl',
                    },
                };
                userDaoFindOtherAdministratorHasResult = true;
                userDaoFindOtherAdministratorResult = {
                    _id: userId2,
                    role: rolesObj.admin,
                    username: 'test2',
                    projects: [],
                    local: {
                        hash: undefined,
                        salt: undefined,
                    },
                    github: {
                        accessToken: 'accessToken',
                        id: 'id',
                        profileUrl: 'profileUrl',
                    },
                };
                projectDaoFindByIdHasResult = true;
                projectDaoFindByIdResult = {
                    _id: 'project1',
                    name: 'project1',
                    crashLogList: [],
                };

                supertest(this.expressApp)
                    .delete(`/api/v1/users/${userId2}/`)
                    .set('Authorization', `Bearer ${apiToken}`)
                    .expect(204, done);
            }).catch(done);
        });

        it('should return 204 when want to remove a normal user', (done) => {
            // Mock data
            const salt = securityService.generateSaltSync();
            securityService.generateHash('password', salt).then((hash) => {
                userDaoFindByIdHasObjectResult = true;
                userDaoFindByIdResult = {};
                userDaoFindByIdResult[userId] = {
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
                userDaoFindByIdResult[userId2] = {
                    _id: userId2,
                    role: rolesObj.normal,
                    username: 'test2',
                    projects: ['project1'],
                    local: {
                        hash: undefined,
                        salt: undefined,
                    },
                    github: {
                        accessToken: 'accessToken',
                        id: 'id',
                        profileUrl: 'profileUrl',
                    },
                };
                projectDaoFindByIdHasResult = true;
                projectDaoFindByIdResult = {
                    _id: 'project1',
                    name: 'project1',
                    crashLogList: [],
                };

                supertest(this.expressApp)
                    .delete(`/api/v1/users/${userId2}/`)
                    .set('Authorization', `Bearer ${apiToken}`)
                    .expect(204, done);
            }).catch(done);
        });

        it('should return 500 when checkIsUserLastAdministrator is rejected', (done) => {
            // Mock data
            const salt = securityService.generateSaltSync();
            securityService.generateHash('password', salt).then((hash) => {
                userDaoFindByIdHasObjectResult = true;
                userDaoFindByIdResult = {};
                userDaoFindByIdResult[userId] = {
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
                userDaoFindByIdResult[userId2] = {
                    _id: userId2,
                    role: rolesObj.admin,
                    username: 'test2',
                    projects: [],
                    local: {
                        hash: undefined,
                        salt: undefined,
                    },
                    github: {
                        accessToken: 'accessToken',
                        id: 'id',
                        profileUrl: 'profileUrl',
                    },
                };
                userDaoFindOtherAdministratorFail = true;

                supertest(this.expressApp)
                    .delete(`/api/v1/users/${userId2}/`)
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
            }).catch(done);
        });

        it('should return 500 when userDao.removeById is rejected', (done) => {
            // Mock data
            const salt = securityService.generateSaltSync();
            securityService.generateHash('password', salt).then((hash) => {
                userDaoFindByIdHasObjectResult = true;
                userDaoFindByIdResult = {};
                userDaoFindByIdResult[userId] = {
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
                userDaoFindByIdResult[userId2] = {
                    _id: userId2,
                    role: rolesObj.normal,
                    username: 'test2',
                    projects: [],
                    local: {
                        hash: undefined,
                        salt: undefined,
                    },
                    github: {
                        accessToken: 'accessToken',
                        id: 'id',
                        profileUrl: 'profileUrl',
                    },
                };
                userDaoRemoveByIdFail = true;

                supertest(this.expressApp)
                    .delete(`/api/v1/users/${userId2}/`)
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
            }).catch(done);
        });
    });

    describe('POST /users/', () => {
        it('should return 401 when no security token provided', (done) => {
            supertest(this.expressApp)
                .post('/api/v1/users/')
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
                .post('/api/v1/users/')
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

        it('should return 403 when user not administrator', (done) => {
            const body = {
                username: '',
                password: '',
                role: '',
            };
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
                .post('/api/v1/users/')
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
        });

        it('should return 400 when empty fields', (done) => {
            const body = {
                username: '',
                password: '',
                role: '',
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
                .post('/api/v1/users/')
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
                username: 'a',
                password: 'a',
                role: rolesObj.normal,
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
                .post('/api/v1/users/')
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

        it('should return 400 when not an email but other fields ok', (done) => {
            const body = {
                username: 'username',
                password: 'password',
                role: rolesObj.normal,
                email: 't',
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
                .post('/api/v1/users/')
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

        it('should return 400 when fields are ok but role doesn\'t exists', (done) => {
            const body = {
                username: 'username',
                password: 'password',
                role: 'role',
                email: 'test@test.com',
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
                .post('/api/v1/users/')
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

        it('should return 409 when user already exists', (done) => {
            const body = {
                username: 'username',
                password: 'password',
                role: rolesObj.normal,
                email: 'test@test.com',
            };
            // Mock data
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.admin,
                username: body.username,
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
            userDaoFindByUsernameWithLocalHashNotNullHasResult = true;
            userDaoFindByUsernameWithLocalHashNotNullResult = {
                _id: userId2,
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
            };

            supertest(this.expressApp)
                .post('/api/v1/users/')
                .set('Authorization', `Bearer ${apiToken}`)
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

        it('should return 500 when userDao.findByUsernameWithLocalHashNotNull is rejected', (done) => {
            const body = {
                username: 'username',
                password: 'password',
                role: rolesObj.normal,
                email: 'test@test.com',
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
            userDaoFindByUsernameWithLocalHashNotNullFail = true;

            supertest(this.expressApp)
                .post('/api/v1/users/')
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
        });

        it('should return 201 when user is created', (done) => {
            const body = {
                username: 'username',
                password: 'password',
                role: rolesObj.normal,
                email: 'test@test.com',
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
                .post('/api/v1/users/')
                .set('Authorization', `Bearer ${apiToken}`)
                .send(body)
                .expect(201)
                .end((err, result) => {
                    if (err) {
                        done(err);
                        return;
                    }

                    const resultBody = result.body;
                    assert.equal(body.username, resultBody.username);
                    assert.equal(body.email, resultBody.email);
                    assert.equal(body.role, resultBody.role);
                    assert.isString(resultBody.id);
                    done();
                });
        });

        it('should return 201 when user is created', (done) => {
            const body = {
                username: 'username',
                password: 'password',
                role: rolesObj.normal,
                email: 'test@test.com',
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
            userDaoSaveFail = true;

            supertest(this.expressApp)
                .post('/api/v1/users/')
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
        });
    });

    describe('GET /users/roles', () => {
        it('should return 401 when no security token provided', (done) => {
            supertest(this.expressApp)
                .get('/api/v1/users/roles/')
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

        it('should return 200 when get list of roles', (done) => {
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
                .get('/api/v1/users/roles')
                .set('Authorization', `Bearer ${apiToken}`)
                .expect(200)
                .end((err, result) => {
                    if (err) {
                        done(err);
                        return;
                    }

                    const resultBody = result.body;
                    assert.isArray(resultBody);
                    assert.sameMembers(roles, resultBody);
                    done();
                });
        });
    });

    describe('PUT /users/:id/', () => {
        it('should return 401 when no security token provided', (done) => {
            supertest(this.expressApp)
                .put(`/api/v1/users/${userId2}/`)
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
                .put(`/api/v1/users/${userId2}/`)
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
                .put(`/api/v1/users/${userId2}/`)
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
                .put(`/api/v1/users/${userId2}/`)
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
                role: '',
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
                .put(`/api/v1/users/${userId2}/`)
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

        it('should return 400 when good fields but not an email', (done) => {
            const body = {
                role: rolesObj.normal,
                email: 'test',
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
                .put(`/api/v1/users/${userId2}/`)
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

        it('should return 400 when role not valid', (done) => {
            const body = {
                role: 'test',
                email: 'test@test.com',
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
                .put(`/api/v1/users/${userId2}/`)
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

        it('should return 404 when user is not found in database', (done) => {
            const body = {
                role: rolesObj.admin,
                email: 'test@test.com',
            };
            // Mock data
            userDaoFindByIdHasObjectResult = true;
            userDaoFindByIdResult = {};
            userDaoFindByIdResult[userId] = {
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
                .put(`/api/v1/users/${userId2}/`)
                .set('Authorization', `Bearer ${apiToken}`)
                .send(body)
                .expect(404)
                .end((err, result) => {
                    if (err) {
                        done(err);
                        return;
                    }

                    const resultBody = result.body;
                    assert.equal('Not Found', resultBody.reason);
                    done();
                });
        });

        it('should return 403 when try to remove last administrator', (done) => {
            const body = {
                role: rolesObj.normal,
                email: 'test@test.com',
            };
            // Mock data
            userDaoFindByIdHasObjectResult = true;
            userDaoFindByIdResult = {};
            userDaoFindByIdResult[userId] = {
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
            userDaoFindByIdResult[userId2] = {
                _id: userId2,
                role: rolesObj.admin,
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
            };
            userDaoFindOtherAdministratorHasResult = true;
            userDaoFindOtherAdministratorResult = null;

            supertest(this.expressApp)
                .put(`/api/v1/users/${userId2}/`)
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
        });

        it('should return 500 when userDao.findOtherAdministrator is rejected', (done) => {
            const body = {
                role: rolesObj.normal,
                email: 'test@test.com',
            };
            // Mock data
            userDaoFindByIdHasObjectResult = true;
            userDaoFindByIdResult = {};
            userDaoFindByIdResult[userId] = {
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
            userDaoFindByIdResult[userId2] = {
                _id: userId2,
                role: rolesObj.admin,
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
            };
            userDaoFindOtherAdministratorFail = true;

            supertest(this.expressApp)
                .put(`/api/v1/users/${userId2}/`)
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
        });

        it('should return 200 when update an administrator', (done) => {
            const body = {
                role: rolesObj.normal,
                email: 'test@test.com',
            };
            // Mock data
            userDaoFindByIdHasObjectResult = true;
            userDaoFindByIdResult = {};
            userDaoFindByIdResult[userId] = {
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
            userDaoFindByIdResult[userId2] = {
                _id: userId2,
                role: rolesObj.admin,
                username: 'test2',
                email: '',
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
            userDaoFindOtherAdministratorHasResult = true;
            userDaoFindOtherAdministratorResult = userDaoFindByIdResult[userId];

            supertest(this.expressApp)
                .put(`/api/v1/users/${userId2}/`)
                .set('Authorization', `Bearer ${apiToken}`)
                .send(body)
                .expect(200)
                .end((err, result) => {
                    if (err) {
                        done(err);
                        return;
                    }

                    const resultBody = result.body;
                    assert.equal(body.email, resultBody.email);
                    assert.equal(body.role, resultBody.role);
                    done();
                });
        });

        it('should return 200 when update a normal user', (done) => {
            const body = {
                role: rolesObj.admin,
                email: 'test@test.com',
            };
            // Mock data
            userDaoFindByIdHasObjectResult = true;
            userDaoFindByIdResult = {};
            userDaoFindByIdResult[userId] = {
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
            userDaoFindByIdResult[userId2] = {
                _id: userId2,
                role: rolesObj.normal,
                username: 'test2',
                email: '',
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
                .put(`/api/v1/users/${userId2}/`)
                .set('Authorization', `Bearer ${apiToken}`)
                .send(body)
                .expect(200)
                .end((err, result) => {
                    if (err) {
                        done(err);
                        return;
                    }

                    const resultBody = result.body;
                    assert.equal(body.email, resultBody.email);
                    assert.equal(body.role, resultBody.role);
                    done();
                });
        });

        it('should return 500 when userDao.save is rejected', (done) => {
            const body = {
                role: rolesObj.admin,
                email: 'test@test.com',
            };
            // Mock data
            userDaoFindByIdHasObjectResult = true;
            userDaoFindByIdResult = {};
            userDaoFindByIdResult[userId] = {
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
            userDaoFindByIdResult[userId2] = {
                _id: userId2,
                role: rolesObj.normal,
                username: 'test2',
                email: '',
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
            userDaoSaveFail = true;

            supertest(this.expressApp)
                .put(`/api/v1/users/${userId2}/`)
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
        });
    });

    describe('PUT /users/current/email', () => {
        it('should return 401 when no security token provided', (done) => {
            supertest(this.expressApp)
                .put('/api/v1/users/current/email')
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
                .put('/api/v1/users/current/email')
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
                .put('/api/v1/users/current/email')
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
                .put('/api/v1/users/current/email')
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
                email: '',
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
                .put('/api/v1/users/current/email')
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

        it('should return 400 when email is invalid', (done) => {
            const body = {
                email: 'a',
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
                .put('/api/v1/users/current/email')
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

        it('should return 200 when user is updated', (done) => {
            const body = {
                email: 'test@test.com',
            };
            // Mock data
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.admin,
                username: 'test',
                email: '',
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
                .put('/api/v1/users/current/email')
                .set('Authorization', `Bearer ${apiToken}`)
                .send(body)
                .expect(200)
                .end((err, result) => {
                    if (err) {
                        done(err);
                        return;
                    }

                    const resultBody = result.body;
                    assert.equal(body.email, resultBody.email);
                    done();
                });
        });

        it('should return 500 when userDao.save is rejected', (done) => {
            const body = {
                email: 'test@test.com',
            };
            // Mock data
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.admin,
                username: 'test',
                email: '',
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
            userDaoSaveFail = true;

            supertest(this.expressApp)
                .put('/api/v1/users/current/email')
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
        });
    });
});
