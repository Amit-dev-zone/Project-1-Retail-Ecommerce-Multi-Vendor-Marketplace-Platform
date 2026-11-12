const mongoose = require('mongoose');
const { PRODUCT_STATUS } = require('../../domain/entities/Product');

const productSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Vendor ID is required for a product'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be non-negative'],
    },
    stock: {
      type: Number,
      required: [true, 'Stock count is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: Object.values(PRODUCT_STATUS),
        message: '{VALUE} is not a valid product status',
      },
      default: PRODUCT_STATUS.ACTIVE,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound index for vendor catalog queries
productSchema.index({ vendorId: 1, status: 1 });

const ProductModel = mongoose.models.Product || mongoose.model('Product', productSchema);

module.exports = ProductModel;
