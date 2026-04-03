class PriceAlert {
  constructor(id, userId, cryptocurrency, targetPrice, type = 'above', status = 'active') {
    this.id = id;
    this.userId = userId;
    this.cryptocurrency = cryptocurrency;
    this.targetPrice = targetPrice;
    this.type = type; // 'above' or 'below'
    this.status = status; // 'active', 'triggered', 'disabled'
    this.createdAt = new Date();
    this.triggeredAt = null;
  }

  trigger() {
    this.status = 'triggered';
    this.triggeredAt = new Date();
  }

  disable() {
    this.status = 'disabled';
  }

  isActive() {
    return this.status === 'active';
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      cryptocurrency: this.cryptocurrency,
      targetPrice: this.targetPrice,
      type: this.type,
      status: this.status,
      createdAt: this.createdAt,
      triggeredAt: this.triggeredAt,
    };
  }
}

export default PriceAlert;
