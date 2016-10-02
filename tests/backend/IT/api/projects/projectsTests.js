/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 01/10/16
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
describe('[IT] [API] Projects', () => {
    let apiToken;
    const userId = '1';
    let userDaoFindByIdFail = false;
    let userDaoFindByIdHasResult = false;
    let userDaoFindByIdResult = null;
    let projectDaoFindAllFail = false;
    let projectDaoFindAllHasResult = false;
    let projectDaoFindAllResult = null;
    let projectDaoFindByIdsFail = false;
    let projectDaoFindByIdsHasResult = false;
    let projectDaoFindByIdsResult = null;
    let projectDaoFindByNameFail = false;
    let projectDaoFindByNameHasResult = false;
    let projectDaoFindByNameResult = null;
    let projectDaoSaveFail = false;
    let projectDaoSaveHasResult = false;
    let projectDaoSaveResult = null;
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
        mockery.registerMock('../dao/projectDao', {
            save: () => new Promise((resolve, reject) => {
                if (projectDaoSaveFail) {
                    reject();
                } else if (projectDaoSaveHasResult) {
                    resolve(projectDaoSaveResult);
                } else {
                    resolve();
                }
            }),
            findAll: () => new Promise((resolve, reject) => {
                if (projectDaoFindAllFail) {
                    reject();
                } else if (projectDaoFindAllHasResult) {
                    resolve(projectDaoFindAllResult);
                } else {
                    resolve();
                }
            }),
            findByIds: () => new Promise((resolve, reject) => {
                if (projectDaoFindByIdsFail) {
                    reject();
                } else if (projectDaoFindByIdsHasResult) {
                    resolve(projectDaoFindByIdsResult);
                } else {
                    resolve();
                }
            }),
            findByName: () => new Promise((resolve, reject) => {
                if (projectDaoFindByNameFail) {
                    reject();
                } else if (projectDaoFindByNameHasResult) {
                    resolve(projectDaoFindByNameResult);
                } else {
                    resolve();
                }
            }),
            deleteById: () => new Promise((resolve, reject) => {
                resolve();
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
        projectDaoFindAllFail = false;
        projectDaoFindAllHasResult = false;
        projectDaoFindAllResult = null;
        projectDaoFindByIdsFail = false;
        projectDaoFindByIdsHasResult = false;
        projectDaoFindByIdsResult = null;
        projectDaoFindByNameFail = false;
        projectDaoFindByNameHasResult = false;
        projectDaoFindByNameResult = null;
        projectDaoSaveFail = false;
        projectDaoSaveHasResult = false;
        projectDaoSaveResult = null;
        userDaoSaveFail = false;
        userDaoSaveHasResult = false;
        userDaoSaveResult = null;
    });

    describe('GET /projects', () => {
        it('should return 401 when no security token provided', (done) => {
            supertest(this.expressApp)
                .get('/api/v1/projects/')
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
                .get('/api/v1/projects/')
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

        it('should return 200 and list of all projects when user is administrator', (done) => {
            // Mock data
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.admin,
                username: 'test',
            };
            projectDaoFindAllHasResult = true;
            projectDaoFindAllResult = [{
                _id: 'test',
                name: 'test',
            }];

            supertest(this.expressApp)
                .get('/api/v1/projects/')
                .set('Authorization', `Bearer ${apiToken}`)
                .expect(200)
                .end((err, result) => {
                    if (err) {
                        done(err);
                        return;
                    }

                    const resultBody = result.body;
                    assert.isArray(resultBody);
                    assert.lengthOf(resultBody, 1);
                    const item = resultBody[0];
                    assert.equal(item.id, projectDaoFindAllResult[0]._id);
                    assert.equal(item.name, projectDaoFindAllResult[0].name);
                    done();
                });
        });

        it('should return 500 when user is administrator and get all projects failed', (done) => {
            // Mock data
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.admin,
                username: 'test',
            };
            projectDaoFindAllFail = true;

            supertest(this.expressApp)
                .get('/api/v1/projects/')
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

        it('should return 200 and list of all projects user when user is not administrator', (done) => {
            // Mock data
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.normal,
                username: 'test',
            };
            projectDaoFindByIdsHasResult = true;
            projectDaoFindByIdsResult = [{
                _id: 'test',
                name: 'test',
            }];

            supertest(this.expressApp)
                .get('/api/v1/projects/')
                .set('Authorization', `Bearer ${apiToken}`)
                .expect(200)
                .end((err, result) => {
                    if (err) {
                        done(err);
                        return;
                    }

                    const resultBody = result.body;
                    assert.isArray(resultBody);
                    assert.lengthOf(resultBody, 1);
                    const item = resultBody[0];
                    assert.equal(item.id, projectDaoFindByIdsResult[0]._id);
                    assert.equal(item.name, projectDaoFindByIdsResult[0].name);
                    done();
                });
        });

        it('should return 500 when user is not administrator and get list projects failed', (done) => {
            // Mock data
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.admin,
                username: 'test',
            };
            projectDaoFindByIdsFail = true;

            supertest(this.expressApp)
                .get('/api/v1/projects/')
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

    describe('POST /projects', () => {
        it('should return 401 when no security token provided', (done) => {
            supertest(this.expressApp)
                .post('/api/v1/projects/')
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
                .post('/api/v1/projects/')
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
            };

            supertest(this.expressApp)
                .post('/api/v1/projects/')
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
            };

            supertest(this.expressApp)
                .post('/api/v1/projects/')
                .send({})
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

        it('should return 400 when empty name', (done) => {
            // Mock data
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.admin,
                username: 'test',
            };
            const body = {
                name: '',
            };

            supertest(this.expressApp)
                .post('/api/v1/projects/')
                .send(body)
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

        it('should return 400 when name is only spaces', (done) => {
            // Mock data
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.admin,
                username: 'test',
            };
            const body = {
                name: '  ',
            };

            supertest(this.expressApp)
                .post('/api/v1/projects/')
                .send(body)
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

        it('should return 400 when projectUrl is not an url', (done) => {
            // Mock data
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.admin,
                username: 'test',
            };
            const body = {
                projectUrl: 'test',
            };

            supertest(this.expressApp)
                .post('/api/v1/projects/')
                .send(body)
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

        it('should return 409 when project already exists', (done) => {
            // Mock data
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.admin,
                username: 'test',
            };
            const body = {
                name: 'test',
                projectUrl: 'http://test.fr',
            };
            projectDaoFindByNameHasResult = true;
            projectDaoFindByNameResult = {
                id: 'test',
            };

            supertest(this.expressApp)
                .post('/api/v1/projects/')
                .send(body)
                .set('Authorization', `Bearer ${apiToken}`)
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

        it('should return 500 when findByName is rejected', (done) => {
            // Mock data
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.admin,
                username: 'test',
            };
            const body = {
                name: 'test',
                projectUrl: 'http://test.fr',
            };
            projectDaoFindByNameFail = true;

            supertest(this.expressApp)
                .post('/api/v1/projects/')
                .send(body)
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

        it('should return 201 when project is created (with project url)', (done) => {
            // Mock data
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.admin,
                username: 'test',
                projects: [],
            };
            const body = {
                name: 'test',
                projectUrl: 'http://test.fr',
            };

            supertest(this.expressApp)
                .post('/api/v1/projects/')
                .send(body)
                .set('Authorization', `Bearer ${apiToken}`)
                .expect(201)
                .end((err, result) => {
                    if (err) {
                        done(err);
                        return;
                    }

                    const resultBody = result.body;
                    assert.equal(body.name, resultBody.name);
                    assert.equal(body.projectUrl, resultBody.projectUrl);
                    assert.isString(resultBody.id);
                    done();
                });
        });

        it('should return 201 when project is created (without project url)', (done) => {
            // Mock data
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.admin,
                username: 'test',
                projects: [],
            };
            const body = {
                name: 'test',
            };

            supertest(this.expressApp)
                .post('/api/v1/projects/')
                .send(body)
                .set('Authorization', `Bearer ${apiToken}`)
                .expect(201)
                .end((err, result) => {
                    if (err) {
                        done(err);
                        return;
                    }

                    const resultBody = result.body;
                    assert.equal(body.name, resultBody.name);
                    assert.equal(body.projectUrl, resultBody.projectUrl);
                    assert.isString(resultBody.id);
                    done();
                });
        });

        it('should return 500 when save user data', (done) => {
            // Mock data
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.admin,
                username: 'test',
                projects: [],
            };
            const body = {
                name: 'test',
                projectUrl: 'http://test.fr',
            };
            userDaoSaveFail = true;

            supertest(this.expressApp)
                .post('/api/v1/projects/')
                .send(body)
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

        it('should return 500 when save project data', (done) => {
            // Mock data
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.admin,
                username: 'test',
                projects: [],
            };
            const body = {
                name: 'test',
                projectUrl: 'http://test.fr',
            };
            projectDaoSaveFail = true;

            supertest(this.expressApp)
                .post('/api/v1/projects/')
                .send(body)
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
