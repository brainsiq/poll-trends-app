const http = require('http');
const supertest = require('supertest');
const app = require('../../lib/app');

module.exports = supertest(http.createServer(app.callback()));
