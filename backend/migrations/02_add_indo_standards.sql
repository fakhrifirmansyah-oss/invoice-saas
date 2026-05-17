-- Migration 02: Upgrade Invoice Table for Indonesian Enterprise Standards

-- Menambahkan NPWP Perusahaan dan NPWP Klien
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS company_npwp VARCHAR(50);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS client_npwp VARCHAR(50);

-- Menambahkan kolom Pajak (PPN 11%)
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS tax_rate DECIMAL(5,2) DEFAULT 11.00;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS tax_amount DECIMAL(15,2) DEFAULT 0.00;

-- Menambahkan syarat pembayaran dan jatuh tempo
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS due_date TIMESTAMP;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS payment_terms VARCHAR(100);

-- Menambahkan kolom materai otomatis jika transaksi > 5 Juta
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS requires_materai BOOLEAN DEFAULT FALSE;

-- Menambahkan kolom teks terbilang
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS total_in_words TEXT;
