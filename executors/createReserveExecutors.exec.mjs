import fs from 'node:fs';

const RESERVE_EXECUTOR_TEMPLATE_PATH = 'executors/reserve.exec.template.mjs';

(async () => {
    const listFileArg = process.argv.find((arg) => arg.includes('--list-file='));
    if (!listFileArg) {
        console.error('Missing --list-file argument.');
        process.exit(1);
    }

    const listFile = listFileArg.split('=')[1];
    if (!listFile) {
        console.error('Invalid --list-file argument.');
        process.exit(1);
    }
    if (!fs.existsSync(listFile)) {
        console.error(`File ${listFile} passed as --list-file argument does not exist.`);
        process.exit(1);
    }

    let listFileContent;
    let listFileContentJson;
    try {
        listFileContent = fs.readFileSync(listFile, 'utf8');
        listFileContentJson = JSON.parse(listFileContent);
    } catch (e) {
        console.error(`File ${listFile} passed as --list-file argument is not valid JSON.`);
        process.exit(1);
    }

    if (!Array.isArray(listFileContentJson)) {
        console.error(`File ${listFile} passed as --list-file argument is not valid JSON array.`);
        process.exit(1);
    }

    const requiredFields = ['title', 'dateTime', 'linkName', 'linkCode'];
    for (const event of listFileContentJson) {
        for (const requiredField of requiredFields) {
            if (!event[requiredField]) {
                console.error(`Field ${requiredField} is missing in one of the events in ${listFile} passed as --list-file argument.`);
                process.exit(1);
            }
        }
    }

    let reserveExecutorTemplateContents;
    try {
        reserveExecutorTemplateContents = fs.readFileSync(RESERVE_EXECUTOR_TEMPLATE_PATH, 'utf8');
    } catch (e) {
        console.error(`Reserve executor template ${RESERVE_EXECUTOR_TEMPLATE_PATH} is missing.`);
        process.exit(1);
    }

    let id = 1;
    for (const event of listFileContentJson) {
        try {
            const reserveExecutorContents = reserveExecutorTemplateContents
                .replace('<EVENT_TITLE>', event.title)
                .replace('<EVENT_LINK_NAME>', event.linkName)
                .replace('<EVENT_LINK_CODE>', event.linkCode)
                .replace('<EVENT_DATETIME>', event.dateTime)
                .replace('\'<NUMBER_OF_SEATS_TO_RESERVE>\'', event.numberOfSeatsToReserve)
                .replace('\'<PRIORITIZATION_FILE_PATH>\'', event.prioritizationFilePath ? `'${event.prioritizationFilePath}'` : null)
                .replace('\'<INSTANCE_ID>\'', id);

            const reserveExecutorFileName = `executors/reserve-${id}-${event.linkName}-${event.linkCode}.reserve.exec.mjs`;
            fs.writeFileSync(reserveExecutorFileName, reserveExecutorContents);

            console.log(`Reserve executor for event ${event.title} (${event.linkName}/${event.linkCode}) written to ${reserveExecutorFileName}`);
        } catch (e) {
            console.error(`Error writing reserve executor for event ${event.title} (${event.linkName}-${event.linkCode})`);
            process.exit(1);
        }

        id += 1;
    }

    process.exit(0);
 })();
