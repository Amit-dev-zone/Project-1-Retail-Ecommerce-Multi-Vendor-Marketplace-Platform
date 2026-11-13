class ProductService {
  constructor({ productRepository }) {
    this.productRepository = productRepository;
  }

  async createProduct(vendorId, productData) {
    if (!vendorId) {
      const error = new Error('Vendor ID is required to create a product');
      error.statusCode = 400;
      throw error;
    }

    const product = await this.productRepository.create({
      ...productData,
      vendorId,
    });

    return product.toJSON();
  }

  async getProductById(id) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }
    return product.toJSON();
  }

  async getVendorProducts(vendorId, options = {}) {
    if (!vendorId) {
      const error = new Error('Vendor ID is required');
      error.statusCode = 400;
      throw error;
    }

    const products = await this.productRepository.findByVendorId(vendorId, options);
    return products.map((p) => p.toJSON());
  }

  async updateProduct(id, vendorId, updateData) {
    const updated = await this.productRepository.update(id, vendorId, updateData);
    if (!updated) {
      const error = new Error('Product not found or you do not have permission to edit this product');
      error.statusCode = 404;
      throw error;
    }
    return updated.toJSON();
  }

  async deleteProduct(id, vendorId) {
    const deleted = await this.productRepository.delete(id, vendorId);
    if (!deleted) {
      const error = new Error('Product not found or you do not have permission to delete this product');
      error.statusCode = 404;
      throw error;
    }
    return { success: true, message: 'Product deleted successfully' };
  }
}

module.exports = ProductService;
