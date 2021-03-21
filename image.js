const http = require('http');
const https = require('https');

/**
 * @param {Array<string>} urls 
 */
async function* remoteImages(urls) {

    for (const url of urls) {
        try {
            yield await getImage(url);
        } catch(e) {
            console.log(e.message);
        }
    }
}

/**
 * @param {string} url 
 */
function getImage(url)
{
    url = new URL(url);
    const client = (url.protocol=="https") ? https : http;

    return new Promise((resolve, reject) => {
        client.get(url, (res) => {

            if (res.statusCode !== 200) {
                reject(new Error(`${res.statusMessage} ${res.statusCode}: ${url.toString()}`));
            }

            res.on('data', (d) => {
                // process.stdout.write(d);
            });

            res.on('end', () => {
                resolve('wege');
            });

        }).on('error', reject);
    });
}



(async () => {
    const images = [
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/Sintels.jpg',
    ];

    for await (const result of remoteImages(images)) {
        console.log(result);
    } 
})();