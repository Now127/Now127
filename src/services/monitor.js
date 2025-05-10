const { ethers } = require('ethers');
const axios = require('axios');
const { TOKENS } = require('../config/tokens');
const { classifyAddress } = require('./classify');
require('dotenv').config();

const provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`);

const { sendTelegramMessage } = require('../utils/notify');

async function monitor() {
  
await sendTelegramMessage(
  `*[${token.symbol}]* Transfer > $100k\n` +
  `Amount: ${amount.toLocaleString()} (~$${usdAmount.toLocaleString()})\n` +
  `From: [${fromLabel}](https://etherscan.io/address/${from})\n` +
  `To: [${toLabel}](https://etherscan.io/address/${to})\n` +
  `Tx: https://etherscan.io/tx/${event.log.transactionHash}`
);
}

// Получаем цены с CoinGecko
async function getPrices() {
  const res = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
    params: {
      ids: 'usd-coin,pepe,starknet',
      vs_currencies: 'usd'
    }
  });

  const prices = {
    PEPE: res.data['pepe'].usd,
    STRK: res.data['starknet'].usd
  };

  console.log('CoinGecko API response:', prices);
  return prices;
}

async function monitorTransfers() {
  const prices = await getPrices();

  for (const token of TOKENS) {
    const contract = new ethers.Contract(
      token.address,
      ['event Transfer(address indexed from, address indexed to, uint256 value)'],
      provider
    );

    contract.on('Transfer', (from, to, value, event) => {
      const amount = Number(value) / 10 ** token.decimals;
      const price = prices[token.symbol] || 0;
      const usdAmount = amount * price;

      if (usdAmount < 1) return;

      const fromLabel = classifyAddress(from);
      const toLabel = classifyAddress(to);

      console.log(`\n[${token.symbol}] Transfer > $100k`);
      console.log(`Amount: ${amount.toLocaleString()} (~$${usdAmount.toLocaleString()})`);
      console.log(`From: ${from} (${fromLabel})`);
      console.log(`To:   ${to} (${toLabel})`);
      console.log(`Tx:   https://etherscan.io/tx/${event.log.transactionHash}`);
      console.log('---');
    });
  }
}

module.exports = { monitorTransfers };