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
            save: () => new Promise((resolve, reject) => {
                if (userDaoSaveFail) {
                    reject();
                } else if (userDaoSaveHasResult) {
                    resolve(userDaoSaveResult);
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
});
