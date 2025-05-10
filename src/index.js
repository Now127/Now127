const { monitorTransfers } = require('./services/monitor');
const { checkUnlocks } = require('./services/unlocks');
const { TOKENS } = require('./config/tokens');
const axios = require('axios');
const { sendTelegramMessage } = require('./src/utils/notify');

async function getPrices() {
  const res = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
    params: {
      ids: 'usd-coin,pepe,starknet',
      vs_currencies: 'usd'
    }
  });

  return {
    PEPE: res.data['pepe'].usd,
    STRK: res.data['starknet'].usd
  };
}

(async () => {
  console.log('Запуск агента ончейн-мониторинга...');
  const prices = await getPrices();
  monitorTransfers(prices); // передай цены в монитор
  await checkUnlocks(TOKENS.find(t => t.symbol === 'STRK'), prices);
})();

async function runAgentLoop() {
  while (true) {
    try {
      await main(); // твоя логика мониторинга
    } catch (err) {
      console.error('Ошибка агента:', err.message);
    }

    await new Promise(r => setTimeout(r, 60000)); // повторять каждые 60 сек
  }
}

runAgentLoop();