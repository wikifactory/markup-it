const fs = require('fs');
const path = require('path');
const expect = require('expect');
const readMetadata = require('read-metadata');
const Slate = require('slate');

const MarkupIt = require('../src/');
const markdown = require('../src/markdown');

/**
 * Read a file input to a state.
 * @param  {String} filePath
 * @return {RawState} state
 */
function readFileInput(filePath) {
    const ext = path.extname(filePath);
    const content = fs.readFileSync(filePath, { encoding: 'utf8' });

    switch (ext) {
    case '.md':
        const parser = MarkupIt.State.create(markdown);
        const doc = parser.deserialize(content);
        const state = Slate.State.create(doc);
        return Slate.Raw.serialize(state, { terse: true });
    case '.yaml':
        return readMetadata.sync(filePath);
    }
}

/**
 * Convert an input state to an output
 * @param  {RawState} input
 * @param  {String} outputExt
 * @return {Mixed}
 */
function convertFor(input, outputExt) {
    switch (outputExt) {
    case '.md':
        input = Slate.Raw.deserialize(input, { terse: true });
        const state = MarkupIt.State.create(markdown);
        return state.serialize(input);
    case '.yaml':
        return input;
    }
}

/**
 * Read an output file
 * @param  {String} filePath
 * @return {Mixed}
 */
function readFileOutput(fileName) {
    const ext = path.extname(fileName);
    const content = fs.readFileSync(fileName, { encoding: 'utf8' });

    switch (ext) {
    case '.md':
        return content;
    case '.yaml':
        return readMetadata.sync(fileName);
    }
}

function runTest(folder) {
    const files = fs.readdirSync(folder);
    const inputName = files.find(file => file.split('.')[0] === 'input');
    const outputName = files.find(file => file.split('.')[0] === 'output');

    // Read the input
    const inputFile = path.resolve(folder, inputName);
    const input = readFileInput(inputFile);

    // Read the expected output
    const outputFile = path.resolve(folder, outputName);
    const outputExt = path.extname(outputName);
    const expectedOutput = readFileOutput(outputFile);

    // Convert the input
    const output = convertFor(input, outputExt);

    expect(output).toEqual(expectedOutput);
}

describe('MarkupIt', () => {
    const series = fs.readdirSync(__dirname);

    series.forEach(serie => {

        describe(serie, () => {
            const seriePath = path.resolve(__dirname, serie);
            if (!fs.lstatSync(seriePath).isDirectory()) {
                return;
            }

            const tests = fs.readdirSync(seriePath);
            tests.forEach(test => {
                const testPath = path.resolve(seriePath, test);

                if (!fs.lstatSync(testPath).isDirectory()) {
                    return;
                }

                it(test, () => {
                    runTest(testPath);
                });
            });
        });
    });
});
