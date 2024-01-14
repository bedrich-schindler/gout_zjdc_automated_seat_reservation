import { reserve } from '../src/reserve.mjs';
import fs from 'node:fs';

const EVENT_TITLE = '<EVENT_TITLE>';
const EVENT_LINK_NAME = '<EVENT_LINK_NAME>';
const EVENT_LINK_CODE = '<EVENT_LINK_CODE>';
const EVENT_DATETIME = '<EVENT_DATETIME>';
const NUMBER_OF_SEATS_TO_RESERVE = '<NUMBER_OF_SEATS_TO_RESERVE>';
const PRIORITIZATION_FILE_PATH = '<PRIORITIZATION_FILE_PATH>';

(async () => {
    let prioritizationFileContentsJson = null;
    if (PRIORITIZATION_FILE_PATH) {
        let prioritizationFileContent;
        try {
            prioritizationFileContent = fs.readFileSync(PRIORITIZATION_FILE_PATH, 'utf8');
            prioritizationFileContentsJson = JSON.parse(prioritizationFileContent);
        } catch (e) {
            console.error(`Prioritization file ${PRIORITIZATION_FILE_PATH} is not valid JSON.`);
            process.exit(1);
        }
    }

    await reserve(
        EVENT_TITLE,
        EVENT_LINK_NAME,
        EVENT_LINK_CODE,
        EVENT_DATETIME,
        NUMBER_OF_SEATS_TO_RESERVE,
        prioritizationFileContentsJson,
    );
})();
