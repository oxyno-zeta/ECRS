/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 29/09/16
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

const mocks = require('../../mocks');

/* ************************************* */
/* ********        TESTS        ******** */
/* ************************************* */
describe('[IT] [API] Configuration', () => {
    let apiToken;
    const userId = '1';
    let userDaoFindByIdFail = false;
    let userDaoFindByIdHasObjectResult = false;
    let userDaoFindByIdHasResult = false;
    let userDaoFindByIdResult = null;
    let getConfigResult;

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
        });

        getConfigResult = configurationWrapper.DEFAULT_CONFIG;
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

    describe('GET configurations/public', () => {
        it('should get configuration', (done) => {
            supertest(this.expressApp)
                .get('/api/v1/configurations/public')
                .expect(200)
                .end((err, result) => {
                    if (err) {
                        done(err);
                        return;
                    }

                    const resultBody = result.body;
                    assert.isTrue(resultBody.auth.isGithubEnabled);
                    assert.isTrue(resultBody.auth.isLocalEnabled);
                    assert.isTrue(resultBody.isLocalRegisterEnabled);
                    assert.equal(resultBody.backendUrl, 'http://your-domain.com');
                    done();
                });
        });
    });

    describe('GET configurations/all', () => {
        it('should return 401 when no security token provided', (done) => {
            supertest(this.expressApp)
                .get('/api/v1/configurations/all/')
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
                .get('/api/v1/configurations/all/')
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
                .get('/api/v1/configurations/all/')
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

            supertest(this.expressApp)
                .get('/api/v1/configurations/all/')
                .set('Authorization', `Bearer ${apiToken}`)
                .expect(200)
                .end((err, result) => {
                    if (err) {
                        done(err);
                        return;
                    }

                    const resultBody = result.body;
                    assert.deepEqual(getConfigResult, resultBody);
                    done();
                });
        });
    });
});
