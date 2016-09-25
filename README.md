ECRS (Electron Crash Report Server)
===================================
[![GitHub release](https://img.shields.io/github/release/oxynozeta/ecrs.svg?maxAge=2592000)]() [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/oxyno-zeta/ECRS/master/LICENSE.md) [![Build Status](https://travis-ci.org/oxyno-zeta/ECRS.svg?branch=master)](https://travis-ci.org/oxyno-zeta/ECRS) [![Coverage Status](https://coveralls.io/repos/github/oxyno-zeta/ECRS/badge.svg)](https://coveralls.io/github/oxyno-zeta/ECRS)

# Docker
There is some docker image with ECRS :
* x64: [![Docker Pulls](https://img.shields.io/docker/pulls/oxynozeta/ecrs.svg?maxAge=2592000)](https://hub.docker.com/r/oxynozeta/ecrs/)
* raspberrypi: [![Docker Pulls](https://img.shields.io/docker/pulls/oxynozeta/rpi-ecrs.svg?maxAge=2592000)](https://hub.docker.com/r/oxynozeta/rpi-ecrs/)

# Description
Electron Crash Report Server to see crash report data, statistics and some others...

# Features
* Manage multiple projects on same server
* Publish your electron crash reports
* Download them
* Get some statistics
* Email on new crash report
* Everything configurable with environment variables 

# Screenshots
| Login | Administration | All Projects  |
|:-------------:|:-------:|:-------:|
|![Login](https://github.com/oxyno-zeta/ECRS/blob/master/.github/login.png)|![Administration](https://github.com/oxyno-zeta/ECRS/blob/master/.github/admin-users.png)|![All Projects](https://github.com/oxyno-zeta/ECRS/blob/master/.github/all-projects.png)|


| Crash Reports  | Statistics | 
|:-------------:|:-------:|
|![Crash Reports](https://github.com/oxyno-zeta/ECRS/blob/master/.github/crash-reports.png)|![Statistics](https://github.com/oxyno-zeta/ECRS/blob/master/.github/statistics.png)|

# Configuration
## Environment variables
### Server
* CRASH_REPORTER_PORT: Server port
* CRASH_REPORTER_LOG_LEVEL: Log level (Possible values: debug|info|error|warn)
* CRASH_REPORTER_URL: Server url for mails or code example (Ex: 'http://your-domain.com')

### Crash Reports
* CRASH_REPORTER_LOG_UPLOAD_DIR: Upload directory path when report is post (temporary)
* CRASH_REPORTER_LOG_APP_CRASH_DIR: Directory where are saved reports

### Database
* CRASH_REPORTER_DATABASE_URL: Database URL (Ex: mongodb://mongo:27017/crash-db)
* CRASH_REPORTER_DATABASE_LOGIN: Database login
* CRASH_REPORTER_DATABASE_PASSWORD: Database password

### Auth
* CRASH_REPORTER_AUTH_GITHUB_OAUTH_ENABLED: Enable Github authentication
* CRASH_REPORTER_AUTH_GITHUB_CLIENT_ID: Github Client id
* CRASH_REPORTER_AUTH_GITHUB_CLIENT_SECRET: Github Client secret
* CRASH_REPORTER_AUTH_JWT_SECRET: JWT Secret (Ex: Random "aqnzr0pD2c0yv1o*0{C6!99^aQ*1fk<4|*][4Jh2X*jK4)N2sXIY8Wxj/1YWGr>")
* CRASH_REPORTER_AUTH_LOCAL_AUTH_ENABLED: Enable Local Authentication
* CRASH_REPORTER_LOCAL_REGISTER_ENABLED: Enable Local Register

### Mail
* CRASH_REPORTER_MAIL_HOST: Mail Server host
* CRASH_REPORTER_MAIL_POOL: Enable Mail pool
* CRASH_REPORTER_MAIL_PORT: Mail Server port
* CRASH_REPORTER_MAIL_SECURE: Mail Server Secure (SSL)
* CRASH_REPORTER_MAIL_AUTH_USER: Mail Server Auth User
* CRASH_REPORTER_MAIL_AUTH_PASS: Mail Server Auth Password
* CRASH_REPORTER_MAIL_FROM: Mail From

# Roadmap
See ROADMAP.md

# Thanks
* My wife BH to support me doing this

# Author
* Oxyno-zeta (Havrileck Alexandre)

# License
MIT (See in License.md)

