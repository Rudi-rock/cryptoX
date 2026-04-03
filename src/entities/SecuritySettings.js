class SecuritySettings {
  constructor(id, userId, twoFactorEnabled = false, whitelistEnabled = false) {
    this.id = id;
    this.userId = userId;
    this.twoFactorEnabled = twoFactorEnabled;
    this.twoFactorMethod = null; // 'authenticator', 'sms', 'email'
    this.whitelistEnabled = whitelistEnabled;
    this.whitelistedAddresses = [];
    this.updatedAt = new Date();
  }

  enableTwoFactor(method) {
    this.twoFactorEnabled = true;
    this.twoFactorMethod = method;
    this.updatedAt = new Date();
  }

  disableTwoFactor() {
    this.twoFactorEnabled = false;
    this.twoFactorMethod = null;
    this.updatedAt = new Date();
  }

  addWhitelistedAddress(address) {
    this.whitelistedAddresses.push(address);
    this.updatedAt = new Date();
  }

  removeWhitelistedAddress(address) {
    this.whitelistedAddresses = this.whitelistedAddresses.filter(a => a !== address);
    this.updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      twoFactorEnabled: this.twoFactorEnabled,
      twoFactorMethod: this.twoFactorMethod,
      whitelistEnabled: this.whitelistEnabled,
      whitelistedAddresses: this.whitelistedAddresses,
      updatedAt: this.updatedAt,
    };
  }
}

export default SecuritySettings;
