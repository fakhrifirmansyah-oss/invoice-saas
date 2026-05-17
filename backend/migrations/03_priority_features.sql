-- Migration 03: Priority 1 Features — Invoice Number, Edit, Search, Overdue
-- Run: psql $DATABASE_URL -f migrations/03_priority_features.sql

-- Auto invoice number (INV-0001, INV-0002, ...)
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS invoice_number VARCHAR(20);

-- Create sequence for invoice numbers per user
CREATE SEQUENCE IF NOT EXISTS invoice_number_seq START 1;

-- Backfill existing invoices
UPDATE invoices SET invoice_number = 'INV-' || LPAD(id::TEXT, 4, '0') WHERE invoice_number IS NULL;

-- Make invoice_number unique
CREATE UNIQUE INDEX IF NOT EXISTS idx_invoices_number ON invoices(invoice_number);

-- Notes field
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS notes TEXT;

-- Client phone (for WhatsApp)
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS client_phone VARCHAR(30);

-- Overdue: status can now be 'unpaid', 'paid', 'overdue', 'cancelled'
-- due_date already added in migration 02

-- Add updated_at
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_invoices_updated_at ON invoices;
CREATE TRIGGER update_invoices_updated_at
    BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
