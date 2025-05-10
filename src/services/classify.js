const { EXCHANGES } = require('../config/tokens');

function classifyAddress(address) {
  for (const [exchange, addresses] of Object.entries(EXCHANGES)) {
    if (addresses.map(a => a.toLowerCase()).includes(address.toLowerCase())) {
      return exchange;
    }
  }
  return 'unknown';
}

module.exports = { classifyAddress };