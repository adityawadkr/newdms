import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const invitation = sqliteTable("invitation", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  role: text("role").notNull(),
  token: text("token").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  inviterId: text("inviter_id").notNull().references(() => user.id),
  status: text("status").notNull().default("pending"), // pending, accepted
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const vehicle = sqliteTable("vehicle", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  vin: text("vin").notNull(),
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  category: text("category").notNull(),
  color: text("color"),
  price: integer("price").notNull(),
  stock: integer("stock").notNull().default(0),
  reorderPoint: integer("reorder_point").notNull().default(0),
  location: text("location").notNull().default("Stockyard"), // Stockyard, Showroom
  daysInStock: integer("days_in_stock").notNull().default(0),
  costPrice: integer("cost_price").notNull().default(0),
  status: text("status").notNull().default("in_stock"), // in_stock, reserved, sold
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
});

export const leads = sqliteTable('leads', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  source: text('source').notNull(),
  status: text('status').notNull(),
  vehicleInterest: text("vehicle_interest"),
  temperature: text("temperature").default("Cold"),
  score: integer("score").default(0),
  nextAction: text("next_action"),
  nextActionDate: text("next_action_date"),
  lastContacted: text("last_contacted"),
  financeStatus: text("finance_status"),
  lostReason: text("lost_reason"),
  assignedTo: text("assigned_to").references(() => user.id),
  createdAt: integer('created_at').notNull(),
});

export const testDrives = sqliteTable('test_drives', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  leadId: integer('lead_id').references(() => leads.id, { onDelete: 'cascade' }),
  assignedTo: text("assigned_to").references(() => user.id),
  customerName: text('customer_name').notNull(),
  vehicle: text('vehicle').notNull(),
  date: text('date').notNull(),
  time: text('time').notNull(),
  duration: integer("duration").default(30), // in minutes
  status: text('status').notNull(), // Scheduled, In Progress, Completed, Cancelled
  notes: text('notes'),
  feedback: text("feedback"),
  rating: integer("rating"),
  licenseImage: text("license_image"),
  createdAt: integer('created_at').notNull(),
});

export const quotations = sqliteTable('quotations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  number: text('number').notNull().unique(),
  leadId: integer('lead_id').references(() => leads.id),
  customer: text('customer').notNull(),
  vehicle: text('vehicle').notNull(), // Kept for backward compatibility/display
  // New Fields for Live Deal Desk
  model: text('model'),
  variant: text('variant'),
  color: text('color'),
  exShowroomPrice: integer('ex_showroom_price').default(0),
  registrationAmount: integer('registration_amount').default(0),
  insuranceAmount: integer('insurance_amount').default(0),
  insuranceType: text('insurance_type').default("1yr"), // 1yr, 3yr, ZeroDep
  accessoriesAmount: integer('accessories_amount').default(0),
  accessoriesData: text('accessories_data'), // JSON string of selected bundles
  discountAmount: integer('discount_amount').default(0),
  approvalStatus: text('approval_status').default("Approved"), // Approved, Pending, Rejected

  lineItems: text('line_items').notNull(), // JSON string (Legacy/General items)
  subtotal: integer('subtotal').notNull(),
  tax: integer('tax').notNull(),
  total: integer('total').notNull(),
  validUntil: text('valid_until'),
  pdfUrl: text('pdf_url'),
  status: text('status').notNull().default("Draft"), // Draft, Sent, Accepted, Rejected
  createdAt: integer('created_at').notNull(),
});

export const bookings = sqliteTable('bookings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  leadId: integer('lead_id').references(() => leads.id),
  quotationId: integer('quotation_id').references(() => quotations.id),
  customer: text('customer').notNull(),
  vehicle: text('vehicle').notNull(),
  quotationNo: text('quotation_no').notNull(),
  bookingAmount: integer('booking_amount').notNull(),
  paymentStatus: text('payment_status').notNull().default("Pending"), // Pending, Partial, Paid
  paymentMode: text('payment_mode'), // Cash, Card, UPI, Transfer
  deliveryDate: text('delivery_date'),
  receiptUrl: text('receipt_url'),
  status: text('status').notNull().default("Confirmed"),
  createdAt: integer('created_at').notNull(),
});

export const appointments = sqliteTable('appointments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  customer: text('customer').notNull(),
  vehicle: text('vehicle').notNull(),
  date: text('date').notNull(),
  serviceType: text('service_type').notNull(),
  status: text('status').notNull(),
  createdAt: integer('created_at').notNull(),
});

export const jobCards = sqliteTable('job_cards', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  jobNo: text('job_no').notNull().unique(),
  appointmentId: integer('appointment_id').references(() => appointments.id, { onDelete: 'set null' }),
  technician: text('technician').notNull(),
  partsUsed: text('parts_used'), // Legacy field, kept for compatibility
  partsData: text('parts_data'), // JSON string: [{ partId, quantity, price, name }]
  laborCharges: integer('labor_charges').default(0),
  totalAmount: integer('total_amount').default(0),
  invoiceStatus: text('invoice_status').default("Pending"), // Pending, Generated, Paid
  notes: text('notes'),
  status: text('status').notNull(),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
  createdAt: integer('created_at').notNull(),
});

export const deliveries = sqliteTable('deliveries', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  bookingId: integer('booking_id').references(() => bookings.id),
  pdiStatus: text('pdi_status').notNull().default("Pending"), // Pending, Passed, Failed
  checklist: text('checklist'), // JSON string: { keys: boolean, manual: boolean, ... }
  feedback: text('feedback'),
  handoverPhoto: text('handover_photo'),
  status: text('status').notNull().default("Scheduled"), // Scheduled, Completed
  deliveryDate: integer('delivery_date', { mode: "timestamp" }),
  createdAt: integer('created_at').notNull(),
});

export const serviceHistory = sqliteTable('service_history', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  customer: text('customer').notNull(),
  vehicle: text('vehicle').notNull(),
  jobNo: text('job_no').notNull(),
  date: text('date').notNull(),
  amount: text('amount').notNull(),
  createdAt: integer('created_at').notNull(),
});

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull().default(false),
  image: text("image"),
  role: text("role").notNull().default("user"),
  approved: integer("approved", { mode: "boolean" }).notNull().default(false), // Requires admin approval
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id),
  token: text("token").notNull().unique(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp" }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: "timestamp" }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const employees = sqliteTable('employees', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').references(() => user.id), // Optional link to user account
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone').notNull(),
  designation: text('designation').notNull(),
  department: text('department').notNull(),
  joiningDate: text('joining_date').notNull(),
  salary: integer('salary').notNull(),
  status: text('status').notNull().default("Active"), // Active, Inactive
  sickLeaveBalance: integer('sick_leave_balance').notNull().default(10),
  casualLeaveBalance: integer('casual_leave_balance').notNull().default(10),
  earnedLeaveBalance: integer('earned_leave_balance').notNull().default(15),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const attendance = sqliteTable('attendance', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  employeeId: integer('employee_id').references(() => employees.id),
  date: text('date').notNull(),
  checkIn: text('check_in'),
  checkOut: text('check_out'),
  status: text('status').notNull(), // Present, Absent, Late, Half-Day
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const leaveRequests = sqliteTable('leave_requests', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  employeeId: integer('employee_id').references(() => employees.id),
  type: text('type').notNull(), // Sick, Casual, Earned
  startDate: text('start_date').notNull(),
  endDate: text('end_date').notNull(),
  reason: text('reason'),
  status: text('status').notNull().default("Pending"), // Pending, Approved, Rejected
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const payroll = sqliteTable('payroll', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  employeeId: integer('employee_id').references(() => employees.id),
  month: text('month').notNull(), // e.g., "2023-10"
  basicSalary: integer('basic_salary').notNull(),
  allowances: integer('allowances').default(0),
  deductions: integer('deductions').default(0),
  netSalary: integer('net_salary').notNull(),
  status: text('status').notNull().default("Pending"), // Paid, Pending
  paymentDate: text('payment_date'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const spareParts = sqliteTable('spare_parts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  sku: text('sku').notNull().unique(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  stock: integer('stock').notNull().default(0),
  reorderPoint: integer('reorder_point').notNull().default(5),
  location: text('location'),
  costPrice: integer('cost_price').default(0),
  sellingPrice: integer('selling_price').default(0),
  supplier: text('supplier'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// POSH (Prevention of Sexual Harassment) Complaints - Female Employees Only
export const poshComplaints = sqliteTable('posh_complaints', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  complaintNo: text('complaint_no').notNull().unique(),
  complainantId: text('complainant_id').references(() => user.id),
  complainantName: text('complainant_name').notNull(),
  complainantEmail: text('complainant_email').notNull(),
  respondentName: text('respondent_name').notNull(),
  incidentDate: text('incident_date').notNull(),
  incidentLocation: text('incident_location').notNull(),
  description: text('description').notNull(),
  witnesses: text('witnesses'), // comma separated
  evidence: text('evidence'), // file URLs
  status: text('status').notNull().default("Submitted"), // Submitted, Under Review, Investigation, Resolved, Closed
  resolution: text('resolution'),
  confidential: integer('confidential', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ============================================
// SYSTEM INTEGRATION TABLES
// ============================================

// Notifications - In-app notification system
export const notifications = sqliteTable('notifications', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').references(() => user.id).notNull(),
  type: text('type').notNull(), // lead, quotation, booking, delivery, service, hr, posh, system
  title: text('title').notNull(),
  message: text('message').notNull(),
  link: text('link'), // URL to navigate when clicked
  entityType: text('entity_type'), // lead, quotation, booking, job_card, etc.
  entityId: integer('entity_id'), // ID of related entity
  read: integer('read', { mode: 'boolean' }).notNull().default(false),
  emailSent: integer('email_sent', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// Activity Log - Audit trail for all actions
export const activityLog = sqliteTable('activity_log', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').references(() => user.id),
  userName: text('user_name'), // Denormalized for easy display
  action: text('action').notNull(), // created, updated, deleted, completed, sent, etc.
  entityType: text('entity_type').notNull(), // lead, quotation, booking, job_card, vehicle, etc.
  entityId: integer('entity_id').notNull(),
  entityName: text('entity_name'), // Human readable identifier (e.g., "QT-2024-0001")
  details: text('details'), // JSON string with additional context
  ipAddress: text('ip_address'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});