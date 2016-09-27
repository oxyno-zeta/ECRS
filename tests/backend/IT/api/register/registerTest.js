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

const mocks = require('../../mocks');

/* ************************************* */
/* ********        TESTS        ******** */
/* ************************************* */

describe('[IT] [API] Register', () => {
    let saveFail = false;
    let findByUsernameWithLocalHashNotNullFail = false;
    let findByUsernameWithLocalHashNotNullHasResult = false;
    let findByUsernameWithLocalHashNotNullResult = null;

    before(() => {
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

    it('should return a 400 when empty body', (done) => {
        const body = {};
        supertest(this.expressApp)
            .post('/api/v1/register')
            .send(body)
            .expect(400)
            .end((err, result) => {
                if (err) {
                    done(err);
                }

                const resultBody = result.body;
                assert.equal('Bad Request', resultBody.reason);
                assert.isTrue(Object.prototype.hasOwnProperty.call(resultBody, 'errors'));
                assert.isArray(resultBody.errors);
                assert.lengthOf(resultBody.errors, 4);
                done();
            });
    });
});
