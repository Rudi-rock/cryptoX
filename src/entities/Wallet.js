class Wallet {
  constructor(id, userId, currency, balance = 0, address = null) {
    this.id = id;
    this.userId = userId;
    this.currency = currency;
    this.balance = balance;
    this.address = address;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  deposit(amount) {
    if (amount <= 0) throw new Error('Amount must be positive');
    this.balance += amount;
    this.updatedAt = new Date();
  }

  withdraw(amount) {
    if (amount <= 0) throw new Error('Amount must be positive');
    if (amount > this.balance) throw new Error('Insufficient balance');
    this.balance -= amount;
    this.updatedAt = new Date();
  }

  getBalance() {
    return this.balance;
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      currency: this.currency,
      balance: this.balance,
      address: this.address,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export default Wallet;
