const axios = require('axios');
const { describe, it, expect } = require('@jest/globals');

// Конфигурация
const ARKHAM_API_BASE_URL = 'https://api.arkhamintelligence.com';
const ARKHAM_API_KEY = 'https://api.arkhamintelligence.com'; // Замените на ваш API-ключ
const STRK_TOKEN_ADDRESS = '0xCa14007Eff0dB1f8135f4C25B34De49AB0d42766'; // Замените на адрес контракта STRK
const CHAIN = 'starknet'; // Цепочка StarkNet

// Функция для получения держателей токена STRK
async function getStrkHolders(tokenAddress, chain) {
  try {
    const response = await axios.get(
      `${ARKHAM_API_BASE_URL}/token/holders/${chain}/${tokenAddress}`,
      {
        headers: {
          'API-Key': ARKHAM_API_KEY,
        },
      }
    );
    return response.data.holders; // Предполагаем, что API возвращает массив holders
  } catch (error) {
    throw new Error(`Failed to fetch STRK holders: ${error.message}`);
  }
}

// Тест
describe('STRK Token Holders API', () => {
  it('should fetch addresses holding STRK tokens', async () => {
    // Получаем держателей токена
    const holders = await getStrkHolders(STRK_TOKEN_ADDRESS, CHAIN);

    // Проверяем, что данные получены
    expect(holders).toBeDefined();
    expect(Array.isArray(holders)).toBe(true);
    expect(holders.length).toBeGreaterThan(0);

    // Проверяем, что каждый держатель имеет адрес
    holders.forEach((holder) => {
      expect(holder).toHaveProperty('address');
      expect(typeof holder.address).toBe('string');
      expect(holder.address).toMatch(/^0x[a-fA-F0-9]+$/); // Формат адреса
    });
  });

  it('should throw an error for invalid token address', async () => {
    // Проверяем обработку ошибки для некорректного адреса
    await expect(getStrkHolders('invalid_address', CHAIN)).rejects.toThrow(
      /Failed to fetch STRK holders/
    );
  });
});

// Дополнительная функция для получения исторических данных
async function getAddressHistory(address) {
  try {
    const response = await axios.get(
      `${ARKHAM_API_BASE_URL}/history/address/${address}`,
      {
        headers: {
          'API-Key': ARKHAM_API_KEY,
        },
      }
    );
    return response.data.history; // Предполагаем, что API возвращает массив history
  } catch (error) {
    throw new Error(`Failed to fetch address history: ${error.message}`);
  }
}

// Тест для исторических данных
describe('STRK Address History API', () => {
  it('should fetch historical data for STRK token contract', async () => {
    const history = await getAddressHistory(STRK_TOKEN_ADDRESS);

    // Проверяем, что данные получены
    expect(history).toBeDefined();
    expect(Array.isArray(history)).toBe(true);

    // Проверяем, что история содержит транзакции
    if (history.length > 0) {
      expect(history[0]).toHaveProperty('timestamp');
      expect(history[0]).toHaveProperty('transactionHash');
    }
  });
});