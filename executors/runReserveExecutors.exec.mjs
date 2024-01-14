import fs from 'node:fs';
import { spawn } from 'child_process';

const RESERVE_EXECUTOR_TEMPLATE_DIR = 'executors';
const ICONS = ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶', '🌽', '🥕', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕', '🥪', '🥙', '🧆', '🌮', '🌯', '🥗', '🥘', '🥫', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🍯', '🥛', '🍼', '☕️', '🍵', '🧃', '🥤', '🍶', '🍺', '🍻', '🥂', '🍷'];

(async () => {
    fs.readdirSync(RESERVE_EXECUTOR_TEMPLATE_DIR).forEach((file, index) => {
        if (file.endsWith('.reserve.exec.mjs')) {
            const fileEventName = file.split('.')[0];

            const child = spawn('node', [`executors/${file}`], {
                detached: true,
            });

            child.stdout.on('data', (data) => {
                console.log(`${ICONS[index]} ${fileEventName}: ${data}`);
            });
            child.stderr.on('data', (data) => {
                console.error(`${ICONS[index]} ${fileEventName}: ${data}`);
            });
        }

        index += 1;
    });
})();
