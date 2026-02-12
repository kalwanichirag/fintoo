import CryptoJS from "crypto-js";

const commonEncode = {
  encrypt: function (text) {
    if (!text) return "";
    var hash = CryptoJS.enc.Latin1.parse("AAAAAAAAAAAAAAAA");
    // const hash = CryptoJS.SHA256("AAAAAAAAAAAAAAAA");
    var ciphertext = CryptoJS.AES.encrypt(text, hash, {
      mode: CryptoJS.mode.ECB,
    });
    return ciphertext?.toString();
  },
  decrypt: function (text) {
    if (!text) return "";
    var hash = CryptoJS.enc.Latin1.parse("AAAAAAAAAAAAAAAA");
    var ciphertext = CryptoJS.AES.decrypt(text, hash, {
      mode: CryptoJS.mode.ECB,
    });
    return ciphertext?.toString(CryptoJS.enc.Utf8);
  },
};
export default commonEncode;
