/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const { State } = require('../src/');
const markdown = require('../src/markdown');
const html = require('../src/html');

const PARSERS = {
    '.md':       markdown,
    '.markdown': markdown,
    '.mdown':    markdown,
    '.html':     html
};

/**
 * Fail with an error message
 * @param  {String} msg
 */
function fail(msg) {
    console.log('error:', msg);
    process.exit(1);
}

/**
 * Deserialize a file
 * @param  {String} filePath
 * @return {Document}
 */
function deserialize(filePath) {
    const ext = path.extname(filePath);
    const parser = PARSERS[ext];

    if (!parser) {
        throw new Error('Can\'t parse this file');
    }

    const content = fs.readFileSync(filePath, { encoding: 'utf8' });
    const state = State.create(parser);

    return state.deserializeToDocument(content);
}

/**
 * Execute a transformation over file
 * @param  {Function} fn [description]
 * @return {[type]}      [description]
 */
function transform(fn) {
    if (process.argv.length < 3) {
        fail('no input file');
    }

    const filePath = path.join(process.cwd(), process.argv[2]);
    const document = deserialize(filePath);

    fn(document);
}

module.exports = {
    deserialize,
    transform
};
