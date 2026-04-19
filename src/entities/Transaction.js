class Transaction {
  constructor(id, walletId, type, amount, currency, status = 'pending', description = '') {
    this.id = id;
    this.walletId = walletId;
    this.type = type; // 'deposit', 'withdrawal', 'transfer', 'exchange'
    this.amount = amount;
    this.currency = currency;
    this.status = status; // 'pending', 'completed', 'failed'
    this.description = description;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  complete() {
    this.status = 'completed';
    this.updatedAt = new Date();
  }

  fail(reason) {
    this.status = 'failed';
    this.failureReason = reason;
    this.updatedAt = new Date();
  }

  isPending() {
    return this.status === 'pending';
  }

  isCompleted() {
    return this.status === 'completed';
  }

  toJSON() {
    return {
      id: this.id,
      walletId: this.walletId,
      type: this.type,
      amount: this.amount,
      currency: this.currency,
      status: this.status,
      description: this.description,
      failureReason: this.failureReason,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export default Transaction;
