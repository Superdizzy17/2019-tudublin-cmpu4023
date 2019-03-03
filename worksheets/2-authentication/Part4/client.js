const axios = require("axios");
const argv = require("minimist")(process.argv.slice(2));
const CryptoJS = require("crypto-js");
const Base64 = require("crypto-js/enc-base64");

// Usage: node client.js -X METHOD -a KEY -s SECRET -d DATA URL

/*/ Make the http request to the specified url, including the authorization token
axios(argv._[0], {
    method: argv.X.toLowerCase(),
    headers: { "Content-type": "application/json", Authorization: token() },
    data: argv.d
})
    .then(res => console.log(res.status))
    .catch(error => console.log(error.response.status));
*/
    axios(argv._[0], {
        method: argv.X.toLowerCase(),
        headers: { Authorization: token() }, //"Content-type": "application/json", 
        data: {
            value : argv.d
        }
    }).then(function(res) {
        console.log(res.status)
        console.log(res.data)
    }).catch(error => console.log(error));

/*
 * Build an authorization token of the form:
 *     HMAC-SHA256 Key=KEY Signature=SIGNATURE
 * where the signature is a computed HMAC-SHA256 from the secret key
 * the the signed data includes the URL, DATA and ACCESS_KEY
 */
function token() {
    const data = `${argv._}${argv.d}${argv.a}`;

    console.log(argv.s);

    const signature = CryptoJS.HmacSHA256(data, argv.s);
    return `HMAC-SHA256 Key=${argv.a} Signature=${Base64.stringify(signature)}`;
}