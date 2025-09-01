const Product = require("../models/product");
const taxConfig = require("../config/tax");

// Disable multiple products
exports.disableProducts = (products) => {
  const bulkOptions = products.map((item) => ({
    updateOne: {
      filter: { _id: item._id },
      update: { isActive: false },
    },
  }));
  Product.bulkWrite(bulkOptions);
};

// Calculate tax amounts for an order
exports.caculateTaxAmount = function (order) {
  try {
    const taxRate = taxConfig.stateTaxRate; // e.g., 0.05 for 5%

    order.totalTax = 0;
    if (order.products && order.products.length > 0) {
      order.products.forEach((item) => {
        const price = item.purchasePrice ?? item?.product?.price ?? 0;
        const quantity = item.quantity ?? 0;

        // init safe defaults so we never add undefined
        item.totalTax = item.totalTax ?? 0;
        item.priceWithTax = item.priceWithTax ?? 0;

        item.totalPrice = price * quantity;
        item.purchasePrice = price;

        if (item.status !== "Cancelled") {
          if (item.product?.taxable && item.priceWithTax === 0) {
            // your original formula simplifies to price * taxRate
            const unitTax = price * taxRate;
            item.totalTax = parseFloat(Number((unitTax * quantity).toFixed(2)));
          }
          // always add the (now defined) totalTax
          order.totalTax += item.totalTax;
        }

        item.priceWithTax = parseFloat(
          Number((item.totalPrice + item.totalTax).toFixed(2))
        );
      });
    }

    const hasCancelledItems = order.products.filter(
      (i) => i.status === "Cancelled"
    );
    if (hasCancelledItems.length > 0) {
      order.total = this.caculateOrderTotal(order);
    }

    const currentTotal = this.caculateOrderTotal(order);
    if (currentTotal !== order.total) {
      order.total = currentTotal;
    }

    order.totalWithTax = order.total + order.totalTax;
    order.total = parseFloat(Number(order.total.toFixed(2)));
    order.totalTax = parseFloat(Number(order.totalTax.toFixed(2)));
    order.totalWithTax = parseFloat(Number(order.totalWithTax.toFixed(2)));
    return order;
  } catch {
    return order;
  }
};

// Sum non-cancelled items
exports.caculateOrderTotal = (order) => {
  const total = order.products
    .filter((item) => item.status !== "Cancelled")
    .reduce((sum, current) => sum + current.totalPrice, 0);
  return total;
};

// Per-item sales tax
exports.caculateItemsSalesTax = (items) => {
  const taxRate = taxConfig.stateTaxRate;

  const products = items.map((item) => {
    item.priceWithTax = 0;
    item.totalPrice = 0;
    item.totalTax = 0;
    item.purchasePrice = item.price;

    const price = item.purchasePrice;
    const quantity = item.quantity;
    item.totalPrice = parseFloat(Number((price * quantity).toFixed(2)));

    if (item.taxable) {
      const taxAmount = price * (taxRate / 100) * 100;
      item.totalTax = parseFloat(Number((taxAmount * quantity).toFixed(2)));
      item.priceWithTax = parseFloat(
        Number((item.totalPrice + item.totalTax).toFixed(2))
      );
    } else {
      // For non-taxable items: tax=0, priceWithTax equals totalPrice
      item.totalTax = 0;
      item.priceWithTax = item.totalPrice;
    }

    return item;
  });

  return products;
};

// Format orders + recompute tax
exports.formatOrders = function (orders) {
  const newOrders = orders.map((order) => ({
    _id: order._id,
    total: parseFloat(Number(order.total.toFixed(2))),
    created: order.created,
    products: order?.cart?.products,
  }));

  return newOrders.map((order) =>
    order?.products ? this.caculateTaxAmount(order) : order
  );
};
