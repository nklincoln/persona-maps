#!/usr/bin/env node
/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const argv = require('yargs')
    .option('p', {
        alias: 'port',
        demand: false,
        default: process.env.PORT || 8080,
        type: 'number',
        describe: 'The port to start persona-maps on'
    })
    .argv;

const cheerio = require('cheerio');
const express = require('express');
const isDocker = require('is-docker');
const opener = require('opener');
const path = require('path');

const app = express();

const dist = path.resolve(__dirname, 'dist');

app.use(express.static(dist));
app.all('/*', (req, res, next) => {
  res.sendFile('index.html', { root: dist });
});

app.listen(argv.port);

if (!isDocker()) {
    opener(`http://localhost:${argv.port}`);
}
