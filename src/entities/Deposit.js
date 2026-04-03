class Deposit {
  constructor(id, userId, walletId, amount, method, status = 'pending', reference = '') {
    this.id = id;
    this.userId = userId;
    this.walletId = walletId;
    this.amount = amount;
    this.method = method; // 'bank_transfer', 'card', 'upi', etc.
    this.status = status; // 'pending', 'completed', 'failed'
    this.reference = reference;
    this.createdAt = new Date();
    this.completedAt = null;
  }

  complete() {
    this.status = 'completed';
    this.completedAt = new Date();
  }

  fail(reason) {
    this.status = 'failed';
    this.failureReason = reason;
  }

  isPending() {
    return this.status === 'pending';
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      walletId: this.walletId,
      amount: this.amount,
      method: this.method,
      status: this.status,
      reference: this.reference,
      failureReason: this.failureReason,
      createdAt: this.createdAt,
      completedAt: this.completedAt,
    };
  }
}

export default Deposit;
