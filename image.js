const fs = require('fs');
const path = require('path');

const { container } = require('./kernel/container');

(async () => {
    const images = [
        new URL('http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg'),
        new URL('http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg'),
    ];

    /** @type {import('./src/Image/SimpleResizer')} */
    const resizer = container.get('Image/SimpleResizer');

    try {
        const outputDir = path.join(__dirname, 'output');

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }

        for (const url of images) {
            const writePath = path.join(outputDir, path.basename(url.pathname));

            let result = await resizer.resizeStreamFromUrl(url, fs.createWriteStream(writePath));

            console.log(result);
        }
    } catch(e) {
        console.log(e.message);
    }
    
})();