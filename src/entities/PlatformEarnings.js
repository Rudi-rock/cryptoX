class PlatformEarnings {
  constructor(id, userId, totalEarnings = 0, earningMethod = 'referral') {
    this.id = id;
    this.userId = userId;
    this.totalEarnings = totalEarnings;
    this.earningMethod = earningMethod; // 'referral', 'staking', 'cashback'
    this.earningBreakdown = {};
    this.lastUpdated = new Date();
  }

  addEarnings(amount, method) {
    this.totalEarnings += amount;
    if (!this.earningBreakdown[method]) {
      this.earningBreakdown[method] = 0;
    }
    this.earningBreakdown[method] += amount;
    this.lastUpdated = new Date();
  }

  getEarningsForMethod(method) {
    return this.earningBreakdown[method] || 0;
  }

  getTotalEarnings() {
    return this.totalEarnings;
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      totalEarnings: this.totalEarnings,
      earningMethod: this.earningMethod,
      earningBreakdown: this.earningBreakdown,
      lastUpdated: this.lastUpdated,
    };
  }
}

export default PlatformEarnings;
