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

const mocks = require('../../mocks');

/* ************************************* */
/* ********        TESTS        ******** */
/* ************************************* */
describe('[IT] [API] Crash log', () => {
    let projectDaoFindByIdFail = false;
    let projectDaoFindByIdHasResult = false;
    let projectDaoFindByIdResult = null;
    let projectDaoSaveFail = false;
    let projectDaoSaveHasResult = true;
    let projectDaoSaveResult = null;
    let crashLogDaoSaveFail = false;
    let crashLogDaoSaveHasResult = false;
    let crashLogDaoSaveResult = null;
    let userDaoFindByProjectIdFail = false;
    let userDaoFindByProjectIdHasResult = false;
    let userDaoFindByProjectIdResult = null;

    before(() => {
        const configurationWrapper = require('../../../../../src/wrapper/configurationWrapper');

        mockery.enable({
            warnOnUnregistered: false,
            useCleanCache: true,
        });

        mockery.registerMock('./shared/logger', mocks.logger);
        mockery.registerMock('../shared/logger', mocks.logger);
        mockery.registerMock('../../shared/logger', mocks.logger);
        mockery.registerMock('../dao/projectDao', {
            findById: () => new Promise((resolve, reject) => {
                if (projectDaoFindByIdFail) {
                    reject();
                } else if (projectDaoFindByIdHasResult) {
                    resolve(projectDaoFindByIdResult);
                } else {
                    resolve();
                }
            }),
            save: item => new Promise((resolve, reject) => {
                if (projectDaoSaveFail) {
                    reject();
                } else if (projectDaoSaveHasResult) {
                    resolve(projectDaoSaveResult);
                } else {
                    resolve(item);
                }
            }),
        });
        mockery.registerMock('../dao/crashLogDao', {
            save: item => new Promise((resolve, reject) => {
                if (crashLogDaoSaveFail) {
                    reject();
                } else if (crashLogDaoSaveHasResult) {
                    resolve(crashLogDaoSaveResult);
                } else {
                    resolve(item);
                }
            }),
        });
        mockery.registerMock('../dao/userDao', {
            findByProjectId: () => new Promise((resolve, reject) => {
                if (userDaoFindByProjectIdFail) {
                    reject();
                } else if (userDaoFindByProjectIdHasResult) {
                    resolve(userDaoFindByProjectIdResult);
                } else {
                    resolve(null);
                }
            }),
        });
        mockery.registerMock('./mailService', {
            sendNewCrashLogEmail: () => new Promise(resolve => resolve()),
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
    });

    after(() => {
        mockery.disable();
        mockery.deregisterAll();
    });

    afterEach(() => {
        projectDaoFindByIdFail = false;
        projectDaoFindByIdHasResult = false;
        projectDaoFindByIdResult = null;
        projectDaoSaveFail = false;
        projectDaoSaveHasResult = true;
        projectDaoSaveResult = null;
        crashLogDaoSaveFail = false;
        crashLogDaoSaveHasResult = false;
        crashLogDaoSaveResult = null;
        userDaoFindByProjectIdFail = false;
        userDaoFindByProjectIdHasResult = false;
        userDaoFindByProjectIdResult = null;
    });

    it('should return 400 when no body', (done) => {
        supertest(this.expressApp)
            .post('/api/v1/crash-logs/projects/test')
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
        supertest(this.expressApp)
            .post('/api/v1/crash-logs/projects/test')
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

    it('should return 404 when project not found', (done) => {
        // Mock results
        projectDaoFindByIdHasResult = true;
        projectDaoFindByIdResult = null;

        supertest(this.expressApp)
            .post('/api/v1/crash-logs/projects/test')
            .field('ver', '1.0.0')
            .field('platform', 'win32')
            .field('process_type', 'renderer')
            .field('guid', '5e1286fc-da97-479e-918b-6bfb0c3d1c72')
            .field('_version', '1.0.0')
            .field('_productName', 'name')
            .field('prod', 'name')
            .field('_companyName', 'name')
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

    it('should return 500 when findById on project is rejected', (done) => {
        // Mock results
        projectDaoFindByIdFail = true;

        supertest(this.expressApp)
            .post('/api/v1/crash-logs/projects/test')
            .field('ver', '1.0.0')
            .field('platform', 'win32')
            .field('process_type', 'renderer')
            .field('guid', '5e1286fc-da97-479e-918b-6bfb0c3d1c72')
            .field('_version', '1.0.0')
            .field('_productName', 'name')
            .field('prod', 'name')
            .field('_companyName', 'name')
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

    it('should return 201 when Crash log is saved but no user for this project', (done) => {
        // Mock results
        projectDaoFindByIdHasResult = true;
        projectDaoFindByIdResult = {
            _id: 'test',
            crashLogList: [],
        };

        supertest(this.expressApp)
            .post('/api/v1/crash-logs/projects/test')
            .field('ver', '1.0.0')
            .field('platform', 'win32')
            .field('process_type', 'renderer')
            .field('guid', '5e1286fc-da97-479e-918b-6bfb0c3d1c72')
            .field('_version', '1.0.0')
            .field('_productName', 'name')
            .field('prod', 'name')
            .field('_companyName', 'name')
            .expect(201)
            .end((err, result) => {
                if (err) {
                    done(err);
                    return;
                }

                const resultBody = result.body;
                assert.isString(resultBody);
                done();
            });
    });

    it('should return 201 when Crash log is saved with user for this project but no email', (done) => {
        // Mock results
        projectDaoFindByIdHasResult = true;
        projectDaoFindByIdResult = {
            _id: 'test',
            crashLogList: [],
        };
        userDaoFindByProjectIdHasResult = true;
        userDaoFindByProjectIdResult = {
            username: 'test',
            email: null,
        };

        supertest(this.expressApp)
            .post('/api/v1/crash-logs/projects/test')
            .field('ver', '1.0.0')
            .field('platform', 'win32')
            .field('process_type', 'renderer')
            .field('guid', '5e1286fc-da97-479e-918b-6bfb0c3d1c72')
            .field('_version', '1.0.0')
            .field('_productName', 'name')
            .field('prod', 'name')
            .field('_companyName', 'name')
            .expect(201)
            .end((err, result) => {
                if (err) {
                    done(err);
                    return;
                }

                const resultBody = result.body;
                assert.isString(resultBody);
                done();
            });
    });

    it('should return 201 when Crash log is saved with user for this project but empty email', (done) => {
        // Mock results
        projectDaoFindByIdHasResult = true;
        projectDaoFindByIdResult = {
            _id: 'test',
            crashLogList: [],
        };
        userDaoFindByProjectIdHasResult = true;
        userDaoFindByProjectIdResult = {
            username: 'test',
            email: '',
        };

        supertest(this.expressApp)
            .post('/api/v1/crash-logs/projects/test')
            .field('ver', '1.0.0')
            .field('platform', 'win32')
            .field('process_type', 'renderer')
            .field('guid', '5e1286fc-da97-479e-918b-6bfb0c3d1c72')
            .field('_version', '1.0.0')
            .field('_productName', 'name')
            .field('prod', 'name')
            .field('_companyName', 'name')
            .expect(201)
            .end((err, result) => {
                if (err) {
                    done(err);
                    return;
                }

                const resultBody = result.body;
                assert.isString(resultBody);
                done();
            });
    });

    it('should return 201 when Crash log is saved with user for this project but empty email', (done) => {
        // Mock results
        projectDaoFindByIdHasResult = true;
        projectDaoFindByIdResult = {
            _id: 'test',
            crashLogList: [],
        };
        userDaoFindByProjectIdHasResult = true;
        userDaoFindByProjectIdResult = {
            username: 'test',
            email: 'test@test.fr',
        };

        supertest(this.expressApp)
            .post('/api/v1/crash-logs/projects/test')
            .field('ver', '1.0.0')
            .field('platform', 'win32')
            .field('process_type', 'renderer')
            .field('guid', '5e1286fc-da97-479e-918b-6bfb0c3d1c72')
            .field('_version', '1.0.0')
            .field('_productName', 'name')
            .field('prod', 'name')
            .field('_companyName', 'name')
            .expect(201)
            .end((err, result) => {
                if (err) {
                    done(err);
                    return;
                }

                const resultBody = result.body;
                assert.isString(resultBody);
                done();
            });
    });

    it('should return 500 when Crash log save is rejected', (done) => {
        // Mock results
        projectDaoFindByIdHasResult = true;
        projectDaoFindByIdResult = {
            _id: 'test',
            crashLogList: [],
        };
        crashLogDaoSaveFail = true;

        supertest(this.expressApp)
            .post('/api/v1/crash-logs/projects/test')
            .field('ver', '1.0.0')
            .field('platform', 'win32')
            .field('process_type', 'renderer')
            .field('guid', '5e1286fc-da97-479e-918b-6bfb0c3d1c72')
            .field('_version', '1.0.0')
            .field('_productName', 'name')
            .field('prod', 'name')
            .field('_companyName', 'name')
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

    it('should return 500 when Project save is rejected', (done) => {
        // Mock results
        projectDaoFindByIdHasResult = true;
        projectDaoFindByIdResult = {
            _id: 'test',
            crashLogList: [],
        };
        projectDaoSaveFail = true;

        supertest(this.expressApp)
            .post('/api/v1/crash-logs/projects/test')
            .field('ver', '1.0.0')
            .field('platform', 'win32')
            .field('process_type', 'renderer')
            .field('guid', '5e1286fc-da97-479e-918b-6bfb0c3d1c72')
            .field('_version', '1.0.0')
            .field('_productName', 'name')
            .field('prod', 'name')
            .field('_companyName', 'name')
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
