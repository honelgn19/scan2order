import { z } from "zod";

export const OrderItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number().int().min(1),
});

export const OrderSchema = z.object({
  tableNumber: z.string(),
  orderId: z.string().optional(),
  items: z.array(OrderItemSchema).min(1),
  total: z.number(),
  status: z.string().optional(),
  paymentMethod: z.string().optional(),
  paymentStatus: z.string().optional(),
  customerName: z.string().optional(),
});

export type OrderInput = z.infer<typeof OrderSchema>;
export const parseOrder = (data: unknown) => OrderSchema.parse(data);

export const MenuItemSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  price: z.number(),
  category: z.string(),
  fasting: z.string().optional(),
  available: z.boolean().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
});

export const UserSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(["Admin", "Kitchen", "Waiter", "Customer"]).optional(),
  status: z.enum(["Active", "Inactive"]).optional(),
  joinDate: z.string().optional(),
});

export const PaymentSchema = z.object({
  id: z.string().optional(),
  transactionId: z.string(),
  orderId: z.string(),
  tableNumber: z.string(),
  customerName: z.string().optional(),
  amount: z.number(),
  paymentMethod: z.string().optional(),
  status: z.string().optional(),
  timestamp: z.any().optional(),
});

export const parseMenuItem = (d: unknown) => MenuItemSchema.parse(d);
export const parseUser = (d: unknown) => UserSchema.parse(d);
export const parsePayment = (d: unknown) => PaymentSchema.parse(d);

export const TableSchema = z.object({
  id: z.string().optional(),
  number: z.string(),
  capacity: z.number().int().min(1),
  status: z.enum(["Available", "Occupied", "Reserved", "Cleaning"]),
  qrCode: z.string().optional(),
  currentSession: z
    .object({
      customerName: z.string().optional(),
      startedAt: z.any().optional(),
      guests: z.number().int().optional(),
    })
    .nullable()
    .optional(),
  createdAt: z.any().optional(),
  updatedAt: z.any().optional(),
});

export const parseTable = (d: unknown) => TableSchema.parse(d);
export const parseTablePartial = (d: unknown) => TableSchema.partial().parse(d);
