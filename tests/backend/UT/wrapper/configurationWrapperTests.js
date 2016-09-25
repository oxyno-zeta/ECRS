/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 25/09/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const path = require('path');
const {
    assert,
    } = require('chai');
const mockery = require('mockery');

/* ************************************* */
/* ********        TESTS        ******** */
/* ************************************* */

describe('configurationWrapper', () => {
    let DEFAULT = null;
    const DEFAULT_CONFIG = {
        CRASH_REPORTER_PORT: 2000,
        CRASH_REPORTER_LOG_LEVEL: 'info',
        CRASH_REPORTER_LOG_UPLOAD_DIR: path.join(process.cwd(), 'upload-logs/'),
        CRASH_REPORTER_LOG_APP_CRASH_DIR: path.join(process.cwd(), 'app-crash-logs/'),
        CRASH_REPORTER_DATABASE_URL: '',
        CRASH_REPORTER_DATABASE_LOGIN: '',
        CRASH_REPORTER_DATABASE_PASSWORD: '',
        CRASH_REPORTER_AUTH_GITHUB_OAUTH_ENABLED: true,
        CRASH_REPORTER_AUTH_GITHUB_CLIENT_ID: '',
        CRASH_REPORTER_AUTH_GITHUB_CLIENT_SECRET: '',
        CRASH_REPORTER_AUTH_JWT_SECRET: '',
        CRASH_REPORTER_AUTH_LOCAL_AUTH_ENABLED: true,
        CRASH_REPORTER_LOCAL_REGISTER_ENABLED: true,
        CRASH_REPORTER_URL: 'http://your-domain.com',
        CRASH_REPORTER_MAIL_HOST: '',
        CRASH_REPORTER_MAIL_POOL: false,
        CRASH_REPORTER_MAIL_PORT: 0,
        CRASH_REPORTER_MAIL_SECURE: false,
        CRASH_REPORTER_MAIL_AUTH_USER: '',
        CRASH_REPORTER_MAIL_AUTH_PASS: '',
        CRASH_REPORTER_MAIL_FROM: '',
    };

    before(() => {
        mockery.enable({
            warnOnUnregistered: false,
            useCleanCache: true,
        });

        mockery.registerMock('nconf', {
            env: () => {
            },
            argv: () => {
            },
            defaults: (value) => {
                DEFAULT = value;
            },
            get: key => DEFAULT[key],
        });

        this.configurationWrapper = require('../../../../src/wrapper/configurationWrapper');

        this.CONSTANTS = this.configurationWrapper.CONSTANTS;
    });

    after(() => {
        mockery.disable();
        mockery.deregisterAll();
    });

    describe('getConfig', () => {
        it('should return default configuration when nothing in environment', () => {
            const configuration = this.configurationWrapper.getConfig();
            let key;
            const CONSTANTS = this.CONSTANTS;
            for (key in CONSTANTS) {
                if (Object.prototype.hasOwnProperty.call(CONSTANTS, key)) {
                    const askedKey = CONSTANTS[key];
                    assert.deepEqual(DEFAULT_CONFIG[askedKey], configuration[askedKey]);
                }
            }
        });

        it('should fix log level if wrong provided', () => {
            // Inject wrong log level
            const CONSTANTS = this.CONSTANTS;
            DEFAULT[CONSTANTS.LOG_LEVEL] = 'test';

            const configuration = this.configurationWrapper.getConfig();
            assert.notDeepEqual(DEFAULT[CONSTANTS.LOG_LEVEL], configuration[CONSTANTS.LOG_LEVEL]);
            assert.deepEqual('info', configuration[CONSTANTS.LOG_LEVEL]);
        });

        it('should try to fix PORT if not integer (String)', () => {
            const CONSTANTS = this.CONSTANTS;
            DEFAULT[CONSTANTS.PORT] = 'test';

            const configuration = this.configurationWrapper.getConfig();
            assert.notDeepEqual(configuration[CONSTANTS.PORT], DEFAULT[CONSTANTS.PORT]);
            assert.isNaN(configuration[CONSTANTS.PORT]);
        });

        it('should try to fix PORT if not integer (Boolean)', () => {
            const CONSTANTS = this.CONSTANTS;
            DEFAULT[CONSTANTS.PORT] = true;

            const configuration = this.configurationWrapper.getConfig();
            assert.notDeepEqual(configuration[CONSTANTS.PORT], DEFAULT[CONSTANTS.PORT]);
            assert.isNaN(configuration[CONSTANTS.PORT]);
        });

        it('should try to fix PORT if not integer (Array)', () => {
            const CONSTANTS = this.CONSTANTS;
            DEFAULT[CONSTANTS.PORT] = [];

            const configuration = this.configurationWrapper.getConfig();
            assert.notDeepEqual(configuration[CONSTANTS.PORT], DEFAULT[CONSTANTS.PORT]);
            assert.isNaN(configuration[CONSTANTS.PORT]);
        });

        it('should try to fix PORT if not integer (Object)', () => {
            const CONSTANTS = this.CONSTANTS;
            DEFAULT[CONSTANTS.PORT] = {};

            const configuration = this.configurationWrapper.getConfig();
            assert.notDeepEqual(configuration[CONSTANTS.PORT], DEFAULT[CONSTANTS.PORT]);
            assert.isNaN(configuration[CONSTANTS.PORT]);
        });

        it('should try to fix PORT if not integer (Integer in String)', () => {
            const CONSTANTS = this.CONSTANTS;
            DEFAULT[CONSTANTS.PORT] = '1';

            const configuration = this.configurationWrapper.getConfig();
            assert.notDeepEqual(configuration[CONSTANTS.PORT], DEFAULT[CONSTANTS.PORT]);
            assert.deepEqual(configuration[CONSTANTS.PORT], 1);
        });

        it('should try to fix MAIL_PORT if not integer (String)', () => {
            const CONSTANTS = this.CONSTANTS;
            DEFAULT[CONSTANTS.MAIL_PORT] = 'test';

            const configuration = this.configurationWrapper.getConfig();
            assert.notDeepEqual(configuration[CONSTANTS.MAIL_PORT], DEFAULT[CONSTANTS.MAIL_PORT]);
            assert.isNaN(configuration[CONSTANTS.MAIL_PORT]);
        });

        it('should try to fix MAIL_PORT if not integer (Boolean)', () => {
            const CONSTANTS = this.CONSTANTS;
            DEFAULT[CONSTANTS.MAIL_PORT] = true;

            const configuration = this.configurationWrapper.getConfig();
            assert.notDeepEqual(configuration[CONSTANTS.MAIL_PORT], DEFAULT[CONSTANTS.MAIL_PORT]);
            assert.isNaN(configuration[CONSTANTS.MAIL_PORT]);
        });

        it('should try to fix MAIL_PORT if not integer (Array)', () => {
            const CONSTANTS = this.CONSTANTS;
            DEFAULT[CONSTANTS.MAIL_PORT] = [];

            const configuration = this.configurationWrapper.getConfig();
            assert.notDeepEqual(configuration[CONSTANTS.MAIL_PORT], DEFAULT[CONSTANTS.MAIL_PORT]);
            assert.isNaN(configuration[CONSTANTS.MAIL_PORT]);
        });

        it('should try to fix MAIL_PORT if not integer (Object)', () => {
            const CONSTANTS = this.CONSTANTS;
            DEFAULT[CONSTANTS.MAIL_PORT] = {};

            const configuration = this.configurationWrapper.getConfig();
            assert.notDeepEqual(configuration[CONSTANTS.MAIL_PORT], DEFAULT[CONSTANTS.MAIL_PORT]);
            assert.isNaN(configuration[CONSTANTS.MAIL_PORT]);
        });

        it('should try to fix MAIL_PORT if not integer (Integer in String)', () => {
            const CONSTANTS = this.CONSTANTS;
            DEFAULT[CONSTANTS.MAIL_PORT] = '1';

            const configuration = this.configurationWrapper.getConfig();
            assert.notDeepEqual(configuration[CONSTANTS.MAIL_PORT], DEFAULT[CONSTANTS.MAIL_PORT]);
            assert.deepEqual(configuration[CONSTANTS.MAIL_PORT], 1);
        });

        it('should try to fix MAIL_SECURE if not boolean (String)', () => {
            const CONSTANTS = this.CONSTANTS;
            DEFAULT[CONSTANTS.MAIL_SECURE] = 'test';

            const configuration = this.configurationWrapper.getConfig();
            assert.isNotOk(configuration[CONSTANTS.MAIL_SECURE]);
        });

        it('should try to fix MAIL_SECURE if not boolean (Array)', () => {
            const CONSTANTS = this.CONSTANTS;
            DEFAULT[CONSTANTS.MAIL_SECURE] = [];

            const configuration = this.configurationWrapper.getConfig();
            assert.isNotOk(configuration[CONSTANTS.MAIL_SECURE]);
        });

        it('should try to fix MAIL_SECURE if not boolean (Object)', () => {
            const CONSTANTS = this.CONSTANTS;
            DEFAULT[CONSTANTS.MAIL_SECURE] = {};

            const configuration = this.configurationWrapper.getConfig();
            assert.isNotOk(configuration[CONSTANTS.MAIL_SECURE]);
        });

        it('should try to fix MAIL_SECURE if not boolean (Integer (0))', () => {
            const CONSTANTS = this.CONSTANTS;
            DEFAULT[CONSTANTS.MAIL_SECURE] = 0;

            const configuration = this.configurationWrapper.getConfig();
            assert.isNotOk(configuration[CONSTANTS.MAIL_SECURE]);
        });

        it('should try to fix MAIL_SECURE if not boolean (Integer (1))', () => {
            const CONSTANTS = this.CONSTANTS;
            DEFAULT[CONSTANTS.MAIL_SECURE] = 1;

            const configuration = this.configurationWrapper.getConfig();
            assert.isNotOk(configuration[CONSTANTS.MAIL_SECURE]);
        });

        it('should try to fix MAIL_POOL if not boolean (String)', () => {
            const CONSTANTS = this.CONSTANTS;
            DEFAULT[CONSTANTS.MAIL_POOL] = 'test';

            const configuration = this.configurationWrapper.getConfig();
            assert.isNotOk(configuration[CONSTANTS.MAIL_POOL]);
        });

        it('should try to fix MAIL_POOL if not boolean (Array)', () => {
            const CONSTANTS = this.CONSTANTS;
            DEFAULT[CONSTANTS.MAIL_POOL] = [];

            const configuration = this.configurationWrapper.getConfig();
            assert.isNotOk(configuration[CONSTANTS.MAIL_POOL]);
        });

        it('should try to fix MAIL_POOL if not boolean (Object)', () => {
            const CONSTANTS = this.CONSTANTS;
            DEFAULT[CONSTANTS.MAIL_POOL] = {};

            const configuration = this.configurationWrapper.getConfig();
            assert.isNotOk(configuration[CONSTANTS.MAIL_POOL]);
        });

        it('should try to fix MAIL_POOL if not boolean (Integer (0))', () => {
            const CONSTANTS = this.CONSTANTS;
            DEFAULT[CONSTANTS.MAIL_POOL] = 0;

            const configuration = this.configurationWrapper.getConfig();
            assert.isNotOk(configuration[CONSTANTS.MAIL_POOL]);
        });

        it('should try to fix MAIL_POOL if not boolean (Integer (1))', () => {
            const CONSTANTS = this.CONSTANTS;
            DEFAULT[CONSTANTS.MAIL_POOL] = 1;

            const configuration = this.configurationWrapper.getConfig();
            assert.isNotOk(configuration[CONSTANTS.MAIL_POOL]);
        });

        it('should try to fix GITHUB_OAUTH_ENABLED if not boolean (String)', () => {
            const CONSTANTS = this.CONSTANTS;
            DEFAULT[CONSTANTS.GITHUB_OAUTH_ENABLED] = 'test';

            const configuration = this.configurationWrapper.getConfig();
            assert.isNotOk(configuration[CONSTANTS.GITHUB_OAUTH_ENABLED]);
        });

        it('should try to fix GITHUB_OAUTH_ENABLED if not boolean (Array)', () => {
            const CONSTANTS = this.CONSTANTS;
            DEFAULT[CONSTANTS.GITHUB_OAUTH_ENABLED] = [];

            const configuration = this.configurationWrapper.getConfig();
            assert.isNotOk(configuration[CONSTANTS.GITHUB_OAUTH_ENABLED]);
        });

        it('should try to fix GITHUB_OAUTH_ENABLED if not boolean (Object)', () => {
            const CONSTANTS = this.CONSTANTS;
            DEFAULT[CONSTANTS.GITHUB_OAUTH_ENABLED] = {};

            const configuration = this.configurationWrapper.getConfig();
            assert.isNotOk(configuration[CONSTANTS.GITHUB_OAUTH_ENABLED]);
        });

        it('should try to fix GITHUB_OAUTH_ENABLED if not boolean (Integer (0))', () => {
            const CONSTANTS = this.CONSTANTS;
            DEFAULT[CONSTANTS.GITHUB_OAUTH_ENABLED] = 0;

            const configuration = this.configurationWrapper.getConfig();
            assert.isNotOk(configuration[CONSTANTS.GITHUB_OAUTH_ENABLED]);
        });

        it('should try to fix GITHUB_OAUTH_ENABLED if not boolean (Integer (1))', () => {
            const CONSTANTS = this.CONSTANTS;
            DEFAULT[CONSTANTS.GITHUB_OAUTH_ENABLED] = 1;

            const configuration = this.configurationWrapper.getConfig();
            assert.isNotOk(configuration[CONSTANTS.GITHUB_OAUTH_ENABLED]);
        });

        it('should try to fix LOCAL_AUTH_ENABLED if not boolean (String)', () => {
            const CONSTANTS = this.CONSTANTS;
            DEFAULT[CONSTANTS.LOCAL_AUTH_ENABLED] = 'test';

            const configuration = this.configurationWrapper.getConfig();
            assert.isNotOk(configuration[CONSTANTS.LOCAL_AUTH_ENABLED]);
        });

        it('should try to fix LOCAL_AUTH_ENABLED if not boolean (Array)', () => {
            const CONSTANTS = this.CONSTANTS;
            DEFAULT[CONSTANTS.LOCAL_AUTH_ENABLED] = [];

            const configuration = this.configurationWrapper.getConfig();
            assert.isNotOk(configuration[CONSTANTS.LOCAL_AUTH_ENABLED]);
        });

        it('should try to fix LOCAL_AUTH_ENABLED if not boolean (Object)', () => {
            const CONSTANTS = this.CONSTANTS;
            DEFAULT[CONSTANTS.LOCAL_AUTH_ENABLED] = {};

            const configuration = this.configurationWrapper.getConfig();
            assert.isNotOk(configuration[CONSTANTS.LOCAL_AUTH_ENABLED]);
        });

        it('should try to fix LOCAL_AUTH_ENABLED if not boolean (Integer (0))', () => {
            const CONSTANTS = this.CONSTANTS;
            DEFAULT[CONSTANTS.LOCAL_AUTH_ENABLED] = 0;

            const configuration = this.configurationWrapper.getConfig();
            assert.isNotOk(configuration[CONSTANTS.LOCAL_AUTH_ENABLED]);
        });

        it('should try to fix LOCAL_AUTH_ENABLED if not boolean (Integer (1))', () => {
            const CONSTANTS = this.CONSTANTS;
            DEFAULT[CONSTANTS.LOCAL_AUTH_ENABLED] = 1;

            const configuration = this.configurationWrapper.getConfig();
            assert.isNotOk(configuration[CONSTANTS.LOCAL_AUTH_ENABLED]);
        });

        it('should try to fix LOCAL_REGISTER_ENABLED if not boolean (String)', () => {
            const CONSTANTS = this.CONSTANTS;
            DEFAULT[CONSTANTS.LOCAL_REGISTER_ENABLED] = 'test';

            const configuration = this.configurationWrapper.getConfig();
            assert.isNotOk(configuration[CONSTANTS.LOCAL_REGISTER_ENABLED]);
        });

        it('should try to fix LOCAL_REGISTER_ENABLED if not boolean (Array)', () => {
            const CONSTANTS = this.CONSTANTS;
            DEFAULT[CONSTANTS.LOCAL_REGISTER_ENABLED] = [];

            const configuration = this.configurationWrapper.getConfig();
            assert.isNotOk(configuration[CONSTANTS.LOCAL_REGISTER_ENABLED]);
        });

        it('should try to fix LOCAL_REGISTER_ENABLED if not boolean (Object)', () => {
            const CONSTANTS = this.CONSTANTS;
            DEFAULT[CONSTANTS.LOCAL_REGISTER_ENABLED] = {};

            const configuration = this.configurationWrapper.getConfig();
            assert.isNotOk(configuration[CONSTANTS.LOCAL_REGISTER_ENABLED]);
        });

        it('should try to fix LOCAL_REGISTER_ENABLED if not boolean (Integer (0))', () => {
            const CONSTANTS = this.CONSTANTS;
            DEFAULT[CONSTANTS.LOCAL_REGISTER_ENABLED] = 0;

            const configuration = this.configurationWrapper.getConfig();
            assert.isNotOk(configuration[CONSTANTS.LOCAL_REGISTER_ENABLED]);
        });

        it('should try to fix LOCAL_REGISTER_ENABLED if not boolean (Integer (1))', () => {
            const CONSTANTS = this.CONSTANTS;
            DEFAULT[CONSTANTS.LOCAL_REGISTER_ENABLED] = 1;

            const configuration = this.configurationWrapper.getConfig();
            assert.isNotOk(configuration[CONSTANTS.LOCAL_REGISTER_ENABLED]);
        });

        it('should fix BACKEND_URL by removing last \'/\'', () => {
            const CONSTANTS = this.CONSTANTS;
            DEFAULT[CONSTANTS.BACKEND_URL] = 'test/';

            const configuration = this.configurationWrapper.getConfig();
            assert.deepEqual('test', configuration[CONSTANTS.BACKEND_URL]);
        });
    });
});
