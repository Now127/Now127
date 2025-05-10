module.exports = {
    TOKENS: [
      {
        symbol: 'USDC',
        address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        decimals: 6
      },
      {
        symbol: 'PEPE',
        address: '0x6982508145454Ce325dDbE47a25d4ec3d2311933',
        decimals: 18
      },
      {
        symbol: 'STRK',
        address: '0xCa14007Eff0dB1f8135f4C25B34De49AB0d42766',
        decimals: 18
      }
    ],
    // Упрощённый список адресов централизованных бирж
    EXCHANGES: {
      binance: ['0x3f5CE5FBFe3E9af3971dD833D26BA9b5C936f0bE'],
      coinbase: ['0x503828976D22510aad0201ac7EC88293211D23Da']
    }
  }