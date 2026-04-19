class ExchangeWallet {
  constructor(id, userId, exchange, apiKey, apiSecret = null, verified = false) {
    this.id = id;
    this.userId = userId;
    this.exchange = exchange; // 'binance', 'kraken', 'coinbase', etc.
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.verified = verified;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  verify() {
    this.verified = true;
    this.updatedAt = new Date();
  }

  maskApiKey() {
    const first4 = this.apiKey.slice(0, 4);
    const last4 = this.apiKey.slice(-4);
    return `${first4}****${last4}`;
  }

  isVerified() {
    return this.verified;
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      exchange: this.exchange,
      apiKey: this.apiKey,
      verified: this.verified,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export default ExchangeWallet;
