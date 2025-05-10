const { ethers } = require('ethers');
const { fetchUnlockSchedule } = require('./tokenUnlocks');
const { classifyAddress } = require('./classify');
require('dotenv').config();

const provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`);

async function checkUnlocks(tokenConfig, prices) {
  const unlocks = await fetchUnlockSchedule(tokenConfig.symbol);
  const now = Math.floor(Date.now() / 1000);

  const contract = new ethers.Contract(
    tokenConfig.address,
    ['function balanceOf(address) view returns (uint256)'],
    provider
  );

  for (const unlock of unlocks.filter(u => u.timestamp <= now)) {
    if (unlock.address === 'unknown') continue;

    const rawBalance = await contract.balanceOf(unlock.address);
    const amount = Number(rawBalance) / 10 ** tokenConfig.decimals;
    const usdValue = amount * prices[tokenConfig.symbol];

    const status = usdValue < unlock.amount * prices[tokenConfig.symbol] * 0.8
      ? 'likely moved'
      : 'likely held';

    const label = classifyAddress(unlock.address);

    console.log(`\n[${tokenConfig.symbol}] Unlock check: ${unlock.label}`);
    console.log(`Address: ${unlock.address} (${label})`);
    console.log(`Expected: ${unlock.amount.toLocaleString()} ${tokenConfig.symbol}`);
    console.log(`Actual:   ${amount.toLocaleString()} (~$${usdValue.toLocaleString()})`);
    console.log(`Status:   ${status}`);
    console.log('---');
  }
}

module.exports = { checkUnlocks };