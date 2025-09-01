jest.mock("../../models/product", () => ({ bulkWrite: jest.fn() }), {
  virtual: true,
});
jest.mock("../../config/tax", () => ({ stateTaxRate: 0.05 }), {
  virtual: true,
});

const Product = require("../../models/product");
const logic = require("../../utils/shop_logic");

describe("business logic (unit)", () => {
  beforeEach(() => jest.clearAllMocks());

  test("disableProducts() calls Product.bulkWrite with expected ops", () => {
    const products = [{ _id: "p1" }, { _id: "p2" }, { _id: "p3" }];
    logic.disableProducts(products);
    expect(Product.bulkWrite).toHaveBeenCalledTimes(1);
    expect(Product.bulkWrite.mock.calls[0][0]).toEqual([
      { updateOne: { filter: { _id: "p1" }, update: { isActive: false } } },
      { updateOne: { filter: { _id: "p2" }, update: { isActive: false } } },
      { updateOne: { filter: { _id: "p3" }, update: { isActive: false } } },
    ]);
  });

  test("caculateOrderTotal() sums only non-cancelled totalPrice", () => {
    const order = {
      products: [
        { status: "Active", totalPrice: 20 },
        { status: "Cancelled", totalPrice: 99 },
        { status: "Active", totalPrice: 5 },
      ],
    };
    expect(logic.caculateOrderTotal(order)).toBe(25);
  });

  test("caculateTaxAmount() (5%) computes per-item + order totals", () => {
    const order = {
      total: 0,
      totalTax: 0,
      products: [
        // priceWithTax undefined (should still compute)
        {
          status: "Active",
          quantity: 2,
          product: { price: 10, taxable: true },
        },
        // non-taxable
        {
          status: "Active",
          quantity: 4,
          product: { price: 5, taxable: false },
        },
      ],
    };
    const updated = logic.caculateTaxAmount(order);

    // item0: totalPrice 20; tax 1.0; priceWithTax 21.0
    expect(updated.products[0].totalPrice).toBe(20);
    expect(updated.products[0].totalTax).toBeCloseTo(1.0, 2);
    expect(updated.products[0].priceWithTax).toBeCloseTo(21.0, 2);

    // item1: totalPrice 20; no tax
    expect(updated.products[1].totalPrice).toBe(20);
    expect(updated.products[1].totalTax).toBe(0);
    expect(updated.products[1].priceWithTax).toBeCloseTo(20.0, 2);

    expect(updated.total).toBeCloseTo(40, 2);
    expect(updated.totalTax).toBeCloseTo(1, 2);
    expect(updated.totalWithTax).toBeCloseTo(41, 2);
  });

  test("caculateTaxAmount() ignores Cancelled items for order.total", () => {
    const order = {
      total: 999,
      totalTax: 0,
      products: [
        {
          status: "Active",
          quantity: 1,
          product: { price: 10, taxable: true },
        },
        {
          status: "Cancelled",
          quantity: 10,
          product: { price: 100, taxable: true },
        },
      ],
    };
    const updated = logic.caculateTaxAmount(order);
    expect(updated.total).toBeCloseTo(10.0, 2);
    expect(updated.totalTax).toBeCloseTo(0.5, 2);
    expect(updated.totalWithTax).toBeCloseTo(10.5, 2);
  });

  test("caculateItemsSalesTax() calculates per-item totals at 5%", () => {
    const items = [
      { price: 19.99, quantity: 3, taxable: true },
      { price: 5, quantity: 2, taxable: false },
    ];
    const out = logic.caculateItemsSalesTax(items);

    expect(out[0].totalPrice).toBeCloseTo(59.97, 2);
    expect(out[0].totalTax).toBeCloseTo(3.0, 2);
    expect(out[0].priceWithTax).toBeCloseTo(62.97, 2);

    expect(out[1].totalPrice).toBeCloseTo(10.0, 2);
    expect(out[1].totalTax).toBe(0);
    expect(out[1].priceWithTax).toBeCloseTo(10.0, 2);
  });

  test("caculateTaxAmount() handles empty products array", () => {
    const order = { total: 0, totalTax: 0, products: [] };
    const updated = logic.caculateTaxAmount(order);
    expect(updated.total).toBe(0);
    expect(updated.totalTax).toBe(0);
    expect(updated.totalWithTax).toBe(0);
  });
});
