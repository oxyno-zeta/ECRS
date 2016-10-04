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
const moment = require('moment');

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
    let projectDaoFindByIdFail = false;
    let projectDaoFindByIdHasResult = false;
    let projectDaoFindByIdResult = null;
    let projectDaoStatisticsNumberByVersionFail = false;
    let projectDaoStatisticsNumberByVersionHasResult = false;
    let projectDaoStatisticsNumberByVersionResult = null;
    let projectDaoGetAllVersionsFail = false;
    let projectDaoGetAllVersionsHasResult = false;
    let projectDaoGetAllVersionsResult = null;
    let projectDaoStatisticsNumberByDateFail = false;
    let projectDaoStatisticsNumberByDateHasResult = false;
    let projectDaoStatisticsNumberByDateResult = null;
    let projectDaoStatisticsNumberByVersionByDateFail = false;
    let projectDaoStatisticsNumberByVersionByDateHasResult = false;
    let projectDaoStatisticsNumberByVersionByDateResult = null;
    let projectDaoStatisticsNumberByVersionByDateAndStartDateFail = false;
    let projectDaoStatisticsNumberByVersionByDateAndStartDateHasResult = false;
    let projectDaoStatisticsNumberByVersionByDateAndStartDateResult = null;

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
            findById: () => new Promise((resolve, reject) => {
                if (projectDaoFindByIdFail) {
                    reject();
                } else if (projectDaoFindByIdHasResult) {
                    resolve(projectDaoFindByIdResult);
                } else {
                    resolve();
                }
            }),
            statisticsNumberByVersion: () => new Promise((resolve, reject) => {
                if (projectDaoStatisticsNumberByVersionFail) {
                    reject();
                } else if (projectDaoStatisticsNumberByVersionHasResult) {
                    resolve(projectDaoStatisticsNumberByVersionResult);
                } else {
                    resolve();
                }
            }),
            getAllVersions: () => new Promise((resolve, reject) => {
                if (projectDaoGetAllVersionsFail) {
                    reject();
                } else if (projectDaoGetAllVersionsHasResult) {
                    resolve(projectDaoGetAllVersionsResult);
                } else {
                    resolve();
                }
            }),
            statisticsNumberByDate: () => new Promise((resolve, reject) => {
                if (projectDaoStatisticsNumberByDateFail) {
                    reject();
                } else if (projectDaoStatisticsNumberByDateHasResult) {
                    resolve(projectDaoStatisticsNumberByDateResult);
                } else {
                    resolve();
                }
            }),
            statisticsNumberByVersionByDate: () => new Promise((resolve, reject)=> {
                if (projectDaoStatisticsNumberByVersionByDateFail) {
                    reject();
                } else if (projectDaoStatisticsNumberByVersionByDateHasResult) {
                    resolve(projectDaoStatisticsNumberByVersionByDateResult);
                } else {
                    resolve();
                }
            }),
            statisticsNumberByVersionByDateAndStartDate: () => new Promise((resolve, reject)=> {
                if (projectDaoStatisticsNumberByVersionByDateAndStartDateFail) {
                    reject();
                } else if (projectDaoStatisticsNumberByVersionByDateAndStartDateHasResult) {
                    resolve(projectDaoStatisticsNumberByVersionByDateAndStartDateResult);
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
        projectDaoFindByIdFail = false;
        projectDaoFindByIdHasResult = false;
        projectDaoFindByIdResult = null;
        projectDaoStatisticsNumberByVersionFail = false;
        projectDaoStatisticsNumberByVersionHasResult = false;
        projectDaoStatisticsNumberByVersionResult = null;
        projectDaoGetAllVersionsFail = false;
        projectDaoGetAllVersionsHasResult = false;
        projectDaoGetAllVersionsResult = null;
        projectDaoStatisticsNumberByDateFail = false;
        projectDaoStatisticsNumberByDateHasResult = false;
        projectDaoStatisticsNumberByDateResult = null;
        projectDaoStatisticsNumberByVersionByDateFail = false;
        projectDaoStatisticsNumberByVersionByDateHasResult = false;
        projectDaoStatisticsNumberByVersionByDateResult = null;
        projectDaoStatisticsNumberByVersionByDateAndStartDateFail = false;
        projectDaoStatisticsNumberByVersionByDateAndStartDateHasResult = false;
        projectDaoStatisticsNumberByVersionByDateAndStartDateResult = null;
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
                projects: [],
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
                projects: [],
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
                projects: [],
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
                projects: [],
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
                projects: [],
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
                projects: [],
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
                projects: [],
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
                projects: [],
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
                projects: [],
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
                projects: [],
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
                projects: [],
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

    describe('GET /projects/:id', () => {
        it('should return 401 when no security token provided', (done) => {
            const projectId = 'test';
            supertest(this.expressApp)
                .get(`/api/v1/projects/${projectId}`)
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
            const projectId = 'test';
            supertest(this.expressApp)
                .get(`/api/v1/projects/${projectId}`)
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

        it('should return 403 when user is not administrator and not in projects', (done) => {
            // Mock data
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.normal,
                username: 'test',
                projects: [],
            };

            const projectId = 'test';
            supertest(this.expressApp)
                .get(`/api/v1/projects/${projectId}`)
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

        it('should return 200 when user is not administrator and in projects', (done) => {
            // Mock data
            const projectId = 'test';
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.normal,
                username: 'test',
                projects: [projectId],
            };
            projectDaoFindByIdHasResult = true;
            projectDaoFindByIdResult = {
                _id: projectId,
                name: 'test',
            };

            supertest(this.expressApp)
                .get(`/api/v1/projects/${projectId}`)
                .set('Authorization', `Bearer ${apiToken}`)
                .expect(200)
                .end((err, result) => {
                    if (err) {
                        done(err);
                        return;
                    }

                    const resultBody = result.body;
                    assert.equal(projectDaoFindByIdResult.name, resultBody.name);
                    assert.equal(projectDaoFindByIdResult._id, resultBody.id);
                    done();
                });
        });

        it('should return 200 when user is administrator and not in projects', (done) => {
            // Mock data
            const projectId = 'test';
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.admin,
                username: 'test',
                projects: [],
            };
            projectDaoFindByIdHasResult = true;
            projectDaoFindByIdResult = {
                _id: projectId,
                name: 'test',
            };

            supertest(this.expressApp)
                .get(`/api/v1/projects/${projectId}`)
                .set('Authorization', `Bearer ${apiToken}`)
                .expect(200)
                .end((err, result) => {
                    if (err) {
                        done(err);
                        return;
                    }

                    const resultBody = result.body;
                    assert.equal(projectDaoFindByIdResult.name, resultBody.name);
                    assert.equal(projectDaoFindByIdResult._id, resultBody.id);
                    done();
                });
        });

        it('should return 404 with user administrator when project not found', (done) => {
            // Mock data
            const projectId = 'test';
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.admin,
                username: 'test',
                projects: [],
            };

            supertest(this.expressApp)
                .get(`/api/v1/projects/${projectId}`)
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
        });

        it('should return 500 with user administrator when find project is rejected', (done) => {
            // Mock data
            const projectId = 'test';
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.admin,
                username: 'test',
                projects: [],
            };
            projectDaoFindByIdFail = true;

            supertest(this.expressApp)
                .get(`/api/v1/projects/${projectId}`)
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

    describe('GET /projects/:id/statistics/number/version', () => {
        it('should return 401 when no security token provided', (done) => {
            const projectId = 'test';
            supertest(this.expressApp)
                .get(`/api/v1/projects/${projectId}/statistics/number/version`)
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
            const projectId = 'test';
            supertest(this.expressApp)
                .get(`/api/v1/projects/${projectId}/statistics/number/version`)
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

        it('should return 403 when user is not administrator and not in projects', (done) => {
            // Mock data
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.normal,
                username: 'test',
                projects: [],
            };

            const projectId = 'test';
            supertest(this.expressApp)
                .get(`/api/v1/projects/${projectId}/statistics/number/version`)
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

        it('should return 200 when user is not administrator and in projects', (done) => {
            // Mock data
            const projectId = 'test';
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.normal,
                username: 'test',
                projects: [projectId],
            };
            projectDaoFindByIdHasResult = true;
            projectDaoFindByIdResult = {
                _id: projectId,
                name: 'test',
            };
            projectDaoStatisticsNumberByVersionHasResult = true;
            projectDaoStatisticsNumberByVersionResult = {
                '1.0.0': 4,
            };

            supertest(this.expressApp)
                .get(`/api/v1/projects/${projectId}/statistics/number/version`)
                .set('Authorization', `Bearer ${apiToken}`)
                .expect(200)
                .end((err, result) => {
                    if (err) {
                        done(err);
                        return;
                    }

                    const resultBody = result.body;
                    let key;
                    for (key in projectDaoStatisticsNumberByVersionResult) {
                        if (Object.prototype.hasOwnProperty.call(projectDaoStatisticsNumberByVersionResult, key)) {
                            assert.equal(projectDaoStatisticsNumberByVersionResult[key], resultBody[key]);
                        }
                    }
                    done();
                });
        });

        it('should return 404 with user administrator when project not found', (done) => {
            // Mock data
            const projectId = 'test';
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.admin,
                username: 'test',
                projects: [],
            };

            supertest(this.expressApp)
                .get(`/api/v1/projects/${projectId}/statistics/number/version`)
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
        });

        it('should return 500 with user administrator when find project is rejected', (done) => {
            // Mock data
            const projectId = 'test';
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.admin,
                username: 'test',
                projects: [],
            };
            projectDaoFindByIdFail = true;

            supertest(this.expressApp)
                .get(`/api/v1/projects/${projectId}/statistics/number/version`)
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

        it('should return 500 with user administrator when statisticsNumberByVersion is rejected', (done) => {
            // Mock data
            const projectId = 'test';
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.admin,
                username: 'test',
                projects: [],
            };
            projectDaoFindByIdHasResult = true;
            projectDaoFindByIdResult = {
                _id: projectId,
                name: 'test',
            };
            projectDaoStatisticsNumberByVersionFail = true;

            supertest(this.expressApp)
                .get(`/api/v1/projects/${projectId}/statistics/number/version`)
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

    describe('GET /projects/:id/versions', () => {
        it('should return 401 when no security token provided', (done) => {
            const projectId = 'test';
            supertest(this.expressApp)
                .get(`/api/v1/projects/${projectId}/versions`)
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
            const projectId = 'test';
            supertest(this.expressApp)
                .get(`/api/v1/projects/${projectId}/versions`)
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

        it('should return 403 when user is not administrator and not in projects', (done) => {
            // Mock data
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.normal,
                username: 'test',
                projects: [],
            };

            const projectId = 'test';
            supertest(this.expressApp)
                .get(`/api/v1/projects/${projectId}/versions`)
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

        it('should return 200 when user is not administrator and in projects', (done) => {
            // Mock data
            const projectId = 'test';
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.normal,
                username: 'test',
                projects: [projectId],
            };
            projectDaoFindByIdHasResult = true;
            projectDaoFindByIdResult = {
                _id: projectId,
                name: 'test',
            };
            projectDaoGetAllVersionsHasResult = true;
            projectDaoGetAllVersionsResult = [
                '1.0.0',
            ];

            supertest(this.expressApp)
                .get(`/api/v1/projects/${projectId}/versions`)
                .set('Authorization', `Bearer ${apiToken}`)
                .expect(200)
                .end((err, result) => {
                    if (err) {
                        done(err);
                        return;
                    }

                    const resultBody = result.body;
                    assert.deepEqual(projectDaoGetAllVersionsResult, resultBody);
                    done();
                });
        });

        it('should return 404 with user administrator when project not found', (done) => {
            // Mock data
            const projectId = 'test';
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.admin,
                username: 'test',
                projects: [],
            };

            supertest(this.expressApp)
                .get(`/api/v1/projects/${projectId}/versions`)
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
        });

        it('should return 500 with user administrator when find project is rejected', (done) => {
            // Mock data
            const projectId = 'test';
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.admin,
                username: 'test',
                projects: [],
            };
            projectDaoFindByIdFail = true;

            supertest(this.expressApp)
                .get(`/api/v1/projects/${projectId}/versions`)
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

        it('should return 500 with user administrator when getAllVersions is rejected', (done) => {
            // Mock data
            const projectId = 'test';
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.admin,
                username: 'test',
                projects: [],
            };
            projectDaoFindByIdHasResult = true;
            projectDaoFindByIdResult = {
                _id: projectId,
                name: 'test',
            };
            projectDaoGetAllVersionsFail = true;

            supertest(this.expressApp)
                .get(`/api/v1/projects/${projectId}/versions`)
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

    describe('GET /projects/:id/statistics/number/date', () => {
        it('should return 401 when no security token provided', (done) => {
            const projectId = 'test';
            supertest(this.expressApp)
                .get(`/api/v1/projects/${projectId}/statistics/number/date`)
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
            const projectId = 'test';
            supertest(this.expressApp)
                .get(`/api/v1/projects/${projectId}/statistics/number/date`)
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

        it('should return 400 when startDate is not provided', (done) => {
            // Mock data
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.normal,
                username: 'test',
                projects: [],
            };

            const projectId = 'test';
            supertest(this.expressApp)
                .get(`/api/v1/projects/${projectId}/statistics/number/date`)
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

        it('should return 403 when user is not administrator and not in projects', (done) => {
            // Mock data
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.normal,
                username: 'test',
                projects: [],
            };

            const projectId = 'test';
            supertest(this.expressApp)
                .get(`/api/v1/projects/${projectId}/statistics/number/date`)
                .query({
                    startDate: new Date().getTime(),
                })
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

        it('should return 200 when user is not administrator and in projects', (done) => {
            // Mock data
            const projectId = 'test';
            const date = moment(new Date()).millisecond(0).second(0).minute(0)
                .hours(0)
                .toDate()
                .getTime();
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.normal,
                username: 'test',
                projects: [projectId],
            };
            projectDaoFindByIdHasResult = true;
            projectDaoFindByIdResult = {
                _id: projectId,
                name: 'test',
            };
            projectDaoStatisticsNumberByDateHasResult = true;
            projectDaoStatisticsNumberByDateResult = {};
            projectDaoStatisticsNumberByDateResult[date] = 4;

            supertest(this.expressApp)
                .get(`/api/v1/projects/${projectId}/statistics/number/date`)
                .query({
                    startDate: new Date().getTime(),
                })
                .set('Authorization', `Bearer ${apiToken}`)
                .expect(200)
                .end((err, result) => {
                    if (err) {
                        done(err);
                        return;
                    }

                    const resultBody = result.body;
                    let key;
                    for (key in projectDaoStatisticsNumberByDateResult) {
                        if (Object.prototype.hasOwnProperty.call(projectDaoStatisticsNumberByDateResult, key)) {
                            assert.equal(projectDaoStatisticsNumberByDateResult[key], resultBody[key]);
                        }
                    }
                    done();
                });
        });

        it('should return 404 with user administrator when project not found', (done) => {
            // Mock data
            const projectId = 'test';
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.admin,
                username: 'test',
                projects: [],
            };

            supertest(this.expressApp)
                .get(`/api/v1/projects/${projectId}/statistics/number/date`)
                .query({
                    startDate: new Date().getTime(),
                })
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
        });

        it('should return 500 with user administrator when find project is rejected', (done) => {
            // Mock data
            const projectId = 'test';
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.admin,
                username: 'test',
                projects: [],
            };
            projectDaoFindByIdFail = true;

            supertest(this.expressApp)
                .get(`/api/v1/projects/${projectId}/statistics/number/date`)
                .query({
                    startDate: new Date().getTime(),
                })
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

        it('should return 500 with user administrator when statisticsNumberByDate is rejected', (done) => {
            // Mock data
            const projectId = 'test';
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.admin,
                username: 'test',
                projects: [],
            };
            projectDaoFindByIdHasResult = true;
            projectDaoFindByIdResult = {
                _id: projectId,
                name: 'test',
            };
            projectDaoStatisticsNumberByDateFail = true;

            supertest(this.expressApp)
                .get(`/api/v1/projects/${projectId}/statistics/number/date`)
                .query({
                    startDate: new Date().getTime(),
                })
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

    describe('GET /projects/:id/statistics/number/version/date', () => {
        it('should return 401 when no security token provided', (done) => {
            const projectId = 'test';
            supertest(this.expressApp)
                .get(`/api/v1/projects/${projectId}/statistics/number/version/date`)
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
            const projectId = 'test';
            supertest(this.expressApp)
                .get(`/api/v1/projects/${projectId}/statistics/number/version/date`)
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

        it('should return 400 when versions is not provided', (done) => {
            // Mock data
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.normal,
                username: 'test',
                projects: [],
            };

            const projectId = 'test';
            supertest(this.expressApp)
                .get(`/api/v1/projects/${projectId}/statistics/number/version/date`)
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

        it('should return 400 when startDate is a boolean', (done) => {
            // Mock data
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.normal,
                username: 'test',
                projects: [],
            };

            const projectId = 'test';
            supertest(this.expressApp)
                .get(`/api/v1/projects/${projectId}/statistics/number/version/date`)
                .set('Authorization', `Bearer ${apiToken}`)
                .query({
                    versions: ['1.0.0'],
                    startDate: true,
                })
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

        it('should return 400 when startDate is a string', (done) => {
            // Mock data
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.normal,
                username: 'test',
                projects: [],
            };

            const projectId = 'test';
            supertest(this.expressApp)
                .get(`/api/v1/projects/${projectId}/statistics/number/version/date`)
                .set('Authorization', `Bearer ${apiToken}`)
                .query({
                    versions: ['1.0.0'],
                    startDate: 'test',
                })
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

        it('should return 400 when startDate is an Object', (done) => {
            // Mock data
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.normal,
                username: 'test',
                projects: [],
            };

            const projectId = 'test';
            supertest(this.expressApp)
                .get(`/api/v1/projects/${projectId}/statistics/number/version/date`)
                .set('Authorization', `Bearer ${apiToken}`)
                .query({
                    versions: ['1.0.0'],
                    startDate: {
                        test: 'test',
                    },
                })
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

        it('should return 403 when user is not administrator and not in projects', (done) => {
            // Mock data
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.normal,
                username: 'test',
                projects: [],
            };

            const projectId = 'test';
            supertest(this.expressApp)
                .get(`/api/v1/projects/${projectId}/statistics/number/version/date`)
                .query({
                    versions: ['1.0.0'],
                })
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

        it('should return 200 when user is not administrator and in projects with statisticsNumberByVersionByDate',
            (done) => {
                // Mock data
                const projectId = 'test';
                userDaoFindByIdHasResult = true;
                userDaoFindByIdResult = {
                    _id: userId,
                    role: rolesObj.normal,
                    username: 'test',
                    projects: [projectId],
                };
                projectDaoFindByIdHasResult = true;
                projectDaoFindByIdResult = {
                    _id: projectId,
                    name: 'test',
                };
                projectDaoStatisticsNumberByVersionByDateHasResult = true;
                projectDaoStatisticsNumberByVersionByDateResult = {
                    '1.0.4': {
                        1474149600000: 2,
                    },
                    '1.0.5': {
                        1474149600000: 1,
                        1475532000000: 1,
                    },
                };

                supertest(this.expressApp)
                    .get(`/api/v1/projects/${projectId}/statistics/number/version/date`)
                    .query({
                        versions: ['1.0.0'],
                    })
                    .set('Authorization', `Bearer ${apiToken}`)
                    .expect(200)
                    .end((err, result) => {
                        if (err) {
                            done(err);
                            return;
                        }

                        const resultBody = result.body;
                        assert.deepEqual(projectDaoStatisticsNumberByVersionByDateResult, resultBody);
                        done();
                    });
            });

        it('should return 200 when user is not administrator and in projects with ' +
            'statisticsNumberByVersionByDateAndStartDate',
            (done) => {
                // Mock data
                const projectId = 'test';
                const date = moment(new Date()).millisecond(0).second(0).minute(0)
                    .hours(0)
                    .toDate()
                    .getTime();
                userDaoFindByIdHasResult = true;
                userDaoFindByIdResult = {
                    _id: userId,
                    role: rolesObj.normal,
                    username: 'test',
                    projects: [projectId],
                };
                projectDaoFindByIdHasResult = true;
                projectDaoFindByIdResult = {
                    _id: projectId,
                    name: 'test',
                };
                projectDaoStatisticsNumberByVersionByDateAndStartDateHasResult = true;
                projectDaoStatisticsNumberByVersionByDateAndStartDateResult = {
                    '1.0.4': {
                        1474149600000: 2,
                    },
                    '1.0.5': {
                        1474149600000: 1,
                        1475532000000: 1,
                    },
                };

                supertest(this.expressApp)
                    .get(`/api/v1/projects/${projectId}/statistics/number/version/date`)
                    .query({
                        versions: ['1.0.0'],
                        startDate: date,
                    })
                    .set('Authorization', `Bearer ${apiToken}`)
                    .expect(200)
                    .end((err, result) => {
                        if (err) {
                            done(err);
                            return;
                        }

                        const resultBody = result.body;
                        assert.deepEqual(projectDaoStatisticsNumberByVersionByDateAndStartDateResult, resultBody);
                        done();
                    });
            });

        it('should return 404 with user administrator when project not found', (done) => {
            // Mock data
            const projectId = 'test';
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.admin,
                username: 'test',
                projects: [],
            };

            supertest(this.expressApp)
                .get(`/api/v1/projects/${projectId}/statistics/number/version/date`)
                .query({
                    versions: ['1.0.0'],
                })
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
        });

        it('should return 500 with user administrator when find project is rejected', (done) => {
            // Mock data
            const projectId = 'test';
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.admin,
                username: 'test',
                projects: [],
            };
            projectDaoFindByIdFail = true;

            supertest(this.expressApp)
                .get(`/api/v1/projects/${projectId}/statistics/number/version/date`)
                .query({
                    versions: ['1.0.0'],
                })
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

        it('should return 500 with user administrator when statisticsNumberByVersionByDate is rejected', (done) => {
            // Mock data
            const projectId = 'test';
            userDaoFindByIdHasResult = true;
            userDaoFindByIdResult = {
                _id: userId,
                role: rolesObj.admin,
                username: 'test',
                projects: [],
            };
            projectDaoFindByIdHasResult = true;
            projectDaoFindByIdResult = {
                _id: projectId,
                name: 'test',
            };
            projectDaoStatisticsNumberByVersionByDateFail = true;

            supertest(this.expressApp)
                .get(`/api/v1/projects/${projectId}/statistics/number/version/date`)
                .query({
                    versions: ['1.0.0'],
                })
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

        it('should return 500 with user administrator when statisticsNumberByVersionByDateAndStartDate is rejected',
            (done) => {
                // Mock data
                const projectId = 'test';
                const date = moment(new Date()).millisecond(0).second(0).minute(0)
                    .hours(0)
                    .toDate()
                    .getTime();
                userDaoFindByIdHasResult = true;
                userDaoFindByIdResult = {
                    _id: userId,
                    role: rolesObj.admin,
                    username: 'test',
                    projects: [],
                };
                projectDaoFindByIdHasResult = true;
                projectDaoFindByIdResult = {
                    _id: projectId,
                    name: 'test',
                };
                projectDaoStatisticsNumberByVersionByDateAndStartDateFail = true;

                supertest(this.expressApp)
                    .get(`/api/v1/projects/${projectId}/statistics/number/version/date`)
                    .query({
                        versions: ['1.0.0'],
                        startDate: date,
                    })
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
