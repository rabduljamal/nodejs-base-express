//encrypt
const Cryptr = require('cryptr');
const cryptr = new Cryptr('RAJ1411');
const moment = require('moment');

const encrypt = (obj) => {
  const encryptedString = cryptr.encrypt(obj);
  return encryptedString
}

const decrypt = (obj) => {
  const decryptedString = cryptr.decrypt(obj);
  return decryptedString
}

const UUID = (obj) => {
  return obj+"-"+moment().format('YYMMDDHH-mmssSSSS')
}

module.exports = {
  encrypt, decrypt, UUID
};