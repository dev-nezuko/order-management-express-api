/**
 * Domain types for the Order Management System
 */

/** Customer tier levels */
export type CustomerTier = "standard" | "premium";

/** Product categories */
export type ProductCategory = "book" | "electronics" | "clothing";

/** Order status values */
export type OrderStatus = "pending" | "paid" | "shipped" | "cancelled";

/** Customer entity */
export interface Customer {
  id: string;
  name: string;
  tier: CustomerTier;
}

/** Product entity */
export interface Product {
  id: string;
  name: string;
  priceCents: number;
  category: ProductCategory;
}

/** Order line item (stored in order) */
export interface OrderLine {
  productId: string;
  quantity: number;
}

/** Order entity */
export interface Order {
  id: string;
  customerId: string;
  lines: OrderLine[];
  status: OrderStatus;
  createdAt: string;
}

/** Hydrated order line with product details */
export interface HydratedOrderLine {
  product: Product;
  quantity: number;
  lineTotalCents: number;
}

/** Fully hydrated order view for API responses */
export interface HydratedOrder {
  order: {
    id: string;
    status: OrderStatus;
    createdAt: string;
  };
  customer: Customer;
  lines: HydratedOrderLine[];
  totalCents: number;
}

/** Order summary for customer summary response */
export interface OrderSummary {
  id: string;
  status: OrderStatus;
  totalCents: number;
}

/** Statistics for customer summary */
export interface CustomerStats {
  totalOrders: number;
  totalSpendCents: number;
  ordersByStatus: Record<OrderStatus, number>;
}

/** Full customer summary response */
export interface CustomerSummary {
  customer: Customer;
  orders: OrderSummary[];
  stats: CustomerStats;
}

/** Paginated response wrapper */
export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
}

/** Request body for creating an order */
export interface CreateOrderRequest {
  customerId: string;
  lines: {
    productId: string;
    quantity: number;
  }[];
}

/** Query parameters for listing orders */
export interface OrdersQueryParams {
  status?: OrderStatus;
  customerId?: string;
  page?: number;
  pageSize?: number;
}

