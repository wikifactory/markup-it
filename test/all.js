const fs = require('fs');
const path = require('path');
const readMetadata = require('read-metadata');


function runTest(folder) {
    const files = fs.readDirSync(folder)
    const input = files.find(file => file.split('.')[0] === 'input')
    const output = files.find(file => file.split('.')[0] === 'output')

}


describe('MarkupIt', () => {
    const series = fs.readDirSync(__dirname)

    series.forEach(serie => {

        describe(serie, () => {
            const seriePath = path.resolve(__dirname, serie)
            const tests = fs.readDirSync(seriePath)

            tests.forEach(test => {
                it(test, () => {
                    const testPath = path.resolve(seriePath, test)
                    runTest(testPath)
                });
            });
        });
    });
});
