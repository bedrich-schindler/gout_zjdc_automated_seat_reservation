import { list } from '../src/list.mjs';
import fs from 'node:fs';

(async () => {
    const artistNameArg = process.argv.find((arg) => arg.includes('--artist-name='));
    if (!artistNameArg) {
        console.error('Missing --artist-name argument.');
        process.exit(1);
    }

    const artistName = artistNameArg.split('=')[1];
    if (!artistName) {
        console.error('Invalid --artist-name argument.');
        process.exit(1);
    }

    const artistCodeArg = process.argv.find((arg) => arg.includes('--artist-code='));
    if (!artistCodeArg) {
        console.error('Missing --artist-code argument.');
        process.exit(1);
    }

    const artistCode = artistCodeArg.split('=')[1];
    if (!artistCode) {
        console.error('Invalid --artist-code argument.');
        process.exit(1);
    }

    const prioritizationFileArg = process.argv.find((arg) => arg.includes('--prioritization-file='));
    const prioritizationFile = prioritizationFileArg ? prioritizationFileArg.split('=')[1] : null;
    if (prioritizationFile) {
        if (!fs.existsSync(prioritizationFile)) {
            console.error(`File ${prioritizationFile} passed as --prioritization-file argument does not exist.`);
            process.exit(1);
        }

        try {
            const prioritizationFileContent = fs.readFileSync(prioritizationFile, 'utf8');
            JSON.parse(prioritizationFileContent);
        } catch (e) {
            console.error(`File ${prioritizationFile} passed as --prioritization-file argument is not valid JSON.`);
            process.exit(1);
        }
    }

    const numberOfSeatsToReserveArg = process.argv.find((arg) => arg.includes('--number-of-seats-to-reserve='));
    let numberOfSeatsToReserve = 2;
    if (numberOfSeatsToReserveArg) {
        numberOfSeatsToReserve = parseInt(numberOfSeatsToReserveArg.split('=')[1], 10);
        if (Number.isNaN(numberOfSeatsToReserve)) {
            console.error('Invalid --number-of-seats-to-reserve argument.');
            process.exit(1);
        }
    }

    const processResult = await list(artistName, artistCode, numberOfSeatsToReserve, prioritizationFile);
    process.exit(processResult ? 0 : 1);
})();
