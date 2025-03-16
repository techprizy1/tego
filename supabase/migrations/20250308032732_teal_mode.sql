/*
  # Create invoices table

  1. New Tables
    - `invoices`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `invoice_data` (jsonb) - Stores the complete invoice data
      - `user_id` (uuid) - References auth.users
      - `invoice_number` (text) - For easy reference
      - `total_amount` (numeric) - For sorting and filtering
      - `client_name` (text) - For searching

  2. Security
    - Enable RLS on `invoices` table
    - Add policy for authenticated users to manage their own invoices
*/

CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  invoice_data jsonb NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  invoice_number text NOT NULL,
  total_amount numeric NOT NULL,
  client_name text NOT NULL
);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own invoices"
  ON invoices
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX invoices_user_id_idx ON invoices(user_id);
CREATE INDEX invoices_client_name_idx ON invoices(client_name);