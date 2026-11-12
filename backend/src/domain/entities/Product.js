const PRODUCT_STATUS = Object.freeze({
  ACTIVE: 'active',
  DRAFT: 'draft',
  ARCHIVED: 'archived',
});

class Product {
  constructor({
    id = null,
    vendorId,
    title,
    description = '',
    price,
    stock = 0,
    category,
    status = PRODUCT_STATUS.ACTIVE,
    createdAt = new Date(),
    updatedAt = new Date(),
  }) {
    this.id = id;
    this.vendorId = vendorId;
    this.title = title;
    this.description = description;
    this.price = Number(price);
    this.stock = Number(stock);
    this.category = category;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;

    this.validate();
  }

  validate() {
    if (!this.vendorId) {
      throw new Error('Product must belong to a vendor (vendorId is required)');
    }

    if (!this.title || typeof this.title !== 'string' || this.title.trim().length === 0) {
      throw new Error('Product title is required');
    }

    if (Number.isNaN(this.price) || this.price < 0) {
      throw new Error('Product price must be a non-negative number');
    }

    if (!Number.isInteger(this.stock) || this.stock < 0) {
      throw new Error('Product stock must be a non-negative integer');
    }

    if (!this.category || typeof this.category !== 'string' || this.category.trim().length === 0) {
      throw new Error('Product category is required');
    }

    if (!Object.values(PRODUCT_STATUS).includes(this.status)) {
      throw new Error(`Invalid product status: ${this.status}. Allowed: ${Object.values(PRODUCT_STATUS).join(', ')}`);
    }
  }

  isInStock() {
    return this.stock > 0 && this.status === PRODUCT_STATUS.ACTIVE;
  }

  decreaseStock(quantity) {
    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty <= 0) {
      throw new Error('Quantity to decrease must be a positive integer');
    }
    if (this.stock < qty) {
      throw new Error(`Insufficient stock for product "${this.title}". Available: ${this.stock}, requested: ${qty}`);
    }
    this.stock -= qty;
    this.updatedAt = new Date();
  }

  increaseStock(quantity) {
    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty <= 0) {
      throw new Error('Quantity to increase must be a positive integer');
    }
    this.stock += qty;
    this.updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      vendorId: this.vendorId,
      title: this.title,
      description: this.description,
      price: this.price,
      stock: this.stock,
      category: this.category,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = {
  Product,
  PRODUCT_STATUS,
};
