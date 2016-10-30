const fs = require('fs');
const path = require('path');
const expect = require('expect');
const readMetadata = require('read-metadata');
const Slate = require('slate');

const MarkupIt = require('../src/');
const markdown = require('../src/markdown');

function readFileInput(fileName) {
    const ext = path.extname(fileName);
    const content = fs.readFileSync(fileName, { encoding: 'utf8' });

    switch (ext) {
    case '.md':
        const state = MarkupIt.State.create(markdown);
        const doc = state.deserialize(content);

        return Slate.Raw.serialize(Slate.State.create(doc));
    case '.yaml':
        return readMetadata.sync(fileName);
    }
}

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

    const input = readFileInput(path.resolve(folder, inputName));
    const output = readFileOutput(path.resolve(folder, outputName));

    expect(input).toEqual(output);
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
