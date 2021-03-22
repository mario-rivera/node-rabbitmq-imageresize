const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

/**
 * @param {Array<URL>} urls 
 * @param {string} outputDir 
 * 
 * @returns {Promise<string>}
 */
function* remoteImages(urls, outputDir) {

    for (const url of urls) {
        
        yield new Promise(async (resolve, reject) => {
            try {
                const outputPath = path.join(outputDir, path.basename(url.pathname));

                const response = await getImage(url);
                
                response
                    .pipe(sharp().resize(100, 100))
                    .pipe(fs.createWriteStream(outputPath));

                response.on('end', () => resolve(outputPath));
            } catch(e) {
                reject(e);
            }
            
        });
    }
}

/**
 * @param {string} url
 * @returns {http.IncomingMessage}
 */
function getImage(url)
{
    // console.log(url);
    const client = (url.protocol=="https") ? https : http;

    return new Promise((resolve, reject) => {
        client.get(url, (res) => {

            if (res.statusCode !== 200) {
                reject(new Error(`${res.statusMessage} ${res.statusCode}: ${url.toString()}`));
            }

            resolve(res);

        }).on('error', reject);
    });
}



(async () => {
    const images = [
        new URL('http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg'),
        new URL('http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg'),
    ];

    try {
        const outputDir = path.join(__dirname, 'output');

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }

        for await (const result of remoteImages(images, outputDir)) {
            console.log(result);
        }
    } catch(e) {
        console.log(e.message);
    }
    
})();