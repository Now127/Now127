const axios = require('axios');

async function fetchUnlockSchedule(symbol) {
  try {
    const res = await axios.get(`https://llama.airforce/api/unlocks/starknet`);
    const events = res.data.unlocks || [];

    const formatted = events.map(e => ({
      timestamp: Math.floor(new Date(e.date).getTime() / 1000),
      amount: Number(e.amount),
      label: e.category,
      address: e.address || 'unknown'
    }));

    return formatted;
  } catch (err) {
    console.error(`Ошибка загрузки данных с TokenUnlocks для ${symbol}:`, err.message);
    return [];
  }
}

module.exports = { fetchUnlockSchedule };