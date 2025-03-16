export interface CompanyProfile {
  name: string;
  address: string;
  email: string;
  phone: string;
  logo?: string;
  state: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
  amount: number;
  taxRate: number;
  taxType: 'gst' | 'igst';
  cgst?: number;
  sgst?: number;
  igst?: number;
  totalTaxAmount: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  company: CompanyProfile;
  client: {
    name: string;
    address: string;
    email: string;
    state: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  cgstTotal: number;
  sgstTotal: number;
  igstTotal: number;
  totalTax: number;
  total: number;
}