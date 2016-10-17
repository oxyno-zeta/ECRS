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
describe('[IT] [API] Configuration', () => {
    before(() => {
        const configurationWrapper = require('../../../../../src/wrapper/configurationWrapper');

        mockery.enable({
            warnOnUnregistered: false,
            useCleanCache: true,
        });

        mockery.registerMock('./shared/logger', mocks.logger);
        mockery.registerMock('../shared/logger', mocks.logger);
        mockery.registerMock('../../shared/logger', mocks.logger);

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
