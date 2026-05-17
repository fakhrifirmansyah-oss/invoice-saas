-- Migration 04: Support Recurring Invoices & Complete Tax Fields
-- Run: node run-migration-04.js

ALTER TABLE invoices ADD COLUMN IF NOT EXISTS invoice_type VARCHAR(50) DEFAULT 'standard';
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS recurring_interval VARCHAR(50) DEFAULT 'none';
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS next_recurring_date TIMESTAMP;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS client_nik VARCHAR(20);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS tax_code VARCHAR(5) DEFAULT '01';

-- Let's make sure all columns from migration 02 are also explicitly safe-checked
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS company_npwp VARCHAR(50);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS client_npwp VARCHAR(50);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS tax_rate DECIMAL(5,2) DEFAULT 11.00;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS tax_amount DECIMAL(15,2) DEFAULT 0.00;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS due_date TIMESTAMP;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS payment_terms VARCHAR(100);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS requires_materai BOOLEAN DEFAULT FALSE;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS total_in_words TEXT;
