import * as CryptoJS from 'crypto-js';

const secretKey = '8ROXBnp1CRddnNpTAU4bhH1EJq1WLqS2';

async function encryptPayload(payload) {
  const iv = CryptoJS.lib.WordArray.random(64);

  const parsedkey = CryptoJS.enc.Utf8.parse(secretKey);
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(payload), parsedkey, {
    iv: iv,
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return {data: encrypted.toString(), iv: iv.toString()};
}

// Function to decrypt a response
function decryptResponse(response) {
  let keys = CryptoJS.enc.Utf8.parse(secretKey);
  let base64 = CryptoJS.enc.Base64.parse(response.data);
  let src = CryptoJS.enc.Base64.stringify(base64);
  let decrypt = CryptoJS.AES.decrypt(src, keys, {
    iv: CryptoJS.enc.Utf8.parse(response.iv),
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return JSON.parse(decrypt.toString(CryptoJS.enc.Utf8));
}

export {encryptPayload, decryptResponse};