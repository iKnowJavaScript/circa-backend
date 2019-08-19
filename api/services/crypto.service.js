const crypto = require('crypto');
const cryptoCodeGenerator = () => {
  const generateCode = () => crypto.randomBytes(20).toString('hex');
  return {
    generateCode
  };
};

module.exports = cryptoCodeGenerator();
