// API base URL
export const API_URL = process.env.API_URL || "/api";

// WebSocket URL based on the environment
export const SOCKET_URL =
  window.location.host.indexOf("localhost") >= 0
    ? "http://127.0.0.1:3000"
    : window.location.host;

// User roles
export const ROLES = {
  Admin: "ROLE ADMIN",
  Member: "ROLE MEMBER",
  Merchant: "ROLE MERCHANT",
};

// Cart constants
export const CART_ITEMS = "cart_items";
export const CART_TOTAL = "cart_total";
export const CART_ID = "cart_id";

// Cart item statuses
export const CART_ITEM_STATUS = {
  Processing: "Processing",
  Shipped: "Shipped",
  Delivered: "Delivered",
  Cancelled: "Cancelled",
  Not_processed: "Not processed",
};

// Merchant statuses
export const MERCHANT_STATUS = {
  Rejected: "Rejected",
  Approved: "Approved",
  Waiting_Approval: "Waiting Approval",
};

// Review statuses
export const REVIEW_STATUS = {
  Rejected: "Rejected",
  Approved: "Approved",
  Waiting_Approval: "Waiting Approval",
};

// Email providers
export const EMAIL_PROVIDER = {
  Email: "Email",
  Google: "Google",
  Facebook: "Facebook",
};
