class Achievement {
  constructor(id, title, description, badge, unlockedAt = null) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.badge = badge;
    this.unlockedAt = unlockedAt;
  }

  isUnlocked() {
    return this.unlockedAt !== null;
  }

  unlock() {
    this.unlockedAt = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      badge: this.badge,
      unlockedAt: this.unlockedAt,
    };
  }
}

export default Achievement;
