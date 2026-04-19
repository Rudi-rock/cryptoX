class KYCVerification {
  constructor(id, userId, status = 'pending', documentType = null, documentNumber = null) {
    this.id = id;
    this.userId = userId;
    this.status = status; // 'pending', 'approved', 'rejected'
    this.documentType = documentType; // 'passport', 'driving_license', 'national_id', etc.
    this.documentNumber = documentNumber;
    this.submittedAt = new Date();
    this.verifiedAt = null;
    this.rejectionReason = null;
  }

  approve() {
    this.status = 'approved';
    this.verifiedAt = new Date();
  }

  reject(reason) {
    this.status = 'rejected';
    this.rejectionReason = reason;
    this.verifiedAt = new Date();
  }

  isPending() {
    return this.status === 'pending';
  }

  isApproved() {
    return this.status === 'approved';
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      status: this.status,
      documentType: this.documentType,
      documentNumber: this.documentNumber,
      submittedAt: this.submittedAt,
      verifiedAt: this.verifiedAt,
      rejectionReason: this.rejectionReason,
    };
  }
}

export default KYCVerification;
