class BankAccount {
  constructor(id, userId, bankName, accountNumber, accountHolder, ifsc, verified = false) {
    this.id = id;
    this.userId = userId;
    this.bankName = bankName;
    this.accountNumber = accountNumber;
    this.accountHolder = accountHolder;
    this.ifsc = ifsc;
    this.verified = verified;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  verify() {
    this.verified = true;
    this.updatedAt = new Date();
  }

  maskAccountNumber() {
    const last4 = this.accountNumber.slice(-4);
    return `****${last4}`;
  }

  isVerified() {
    return this.verified;
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      bankName: this.bankName,
      accountNumber: this.accountNumber,
      accountHolder: this.accountHolder,
      ifsc: this.ifsc,
      verified: this.verified,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export default BankAccount;
