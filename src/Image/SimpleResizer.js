const http = require('http');
const https = require('https');
const sharp = require('sharp');

class SimpleResizer
{
    /**
     * @param {URL} url 
     * @param {import('stream').Writable} url
     * 
     * @returns {Promise<boolean>}
     */
    resizeStreamFromUrl(url, writeableStream)
    {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await this.getImage(url);
                
                response
                    .pipe(sharp().resize(100, 100))
                    .pipe(writeableStream);

                writeableStream.on('finish', () => resolve(true));
            } catch(e) {
                reject(e);
            }
        });
    }

    /**
     * @param {string} url
     * @returns {Promise<http.IncomingMessage>}
     */
    getImage(url)
    {
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
}

module.exports = {
    SimpleResizer: SimpleResizer
};
