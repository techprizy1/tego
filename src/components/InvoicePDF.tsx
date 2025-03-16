import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, pdf, Image } from '@react-pdf/renderer';
import { InvoiceData } from '../types/invoice';
import { Download } from 'lucide-react';

Font.register({
  family: 'Helvetica'
});

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 12,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  logo: {
    width: 120,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Helvetica',
    color: '#1e40af',
    marginBottom: 4,
  },
  invoiceInfo: {
    color: '#6b7280',
    fontSize: 10,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica',
    color: '#374151',
    marginBottom: 8,
  },
  companyName: {
    fontSize: 16,
    fontFamily: 'Helvetica',
    color: '#111827',
    marginBottom: 4,
  },
  addressText: {
    color: '#4b5563',
    marginBottom: 2,
  },
  table: {
    display: 'table',
    width: '100%',
    marginVertical: 30,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    minHeight: 35,
    alignItems: 'center',
  },
  tableHeader: {
    backgroundColor: '#f9fafb',
  },
  tableHeaderText: {
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#6b7280',
  },
  tableCell: {
    flex: 1,
    padding: 8,
  },
  tableCellAmount: {
    flex: 1,
    padding: 8,
    textAlign: 'right',
  },
  tableCellDescription: {
    flex: 2,
  },
  totals: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  totalLabel: {
    width: 100,
    textAlign: 'right',
    paddingRight: 8,
    color: '#6b7280',
  },
  totalAmount: {
    width: 100,
    textAlign: 'right',
    color: '#111827',
  },
  grandTotal: {
    fontSize: 16,
    fontFamily: 'Helvetica',
    color: '#1e40af',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 10,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 20,
  },
});

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};

const InvoiceDocument = ({ data }: { data: InvoiceData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {data.company.logo && <Image style={styles.logo} src={data.company.logo} />}
          <Text style={styles.title}>TAX INVOICE</Text>
          <Text style={styles.invoiceInfo}>#{data.invoiceNumber}</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.invoiceInfo}>Issue Date: {data.date}</Text>
          <Text style={styles.invoiceInfo}>Due Date: {data.dueDate}</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FROM</Text>
          <Text style={styles.companyName}>{data.company.name}</Text>
          <Text style={styles.addressText}>{data.company.address}</Text>
          <Text style={styles.addressText}>{data.company.email}</Text>
          <Text style={styles.addressText}>{data.company.phone}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TO</Text>
          <Text style={styles.companyName}>{data.client.name}</Text>
          <Text style={styles.addressText}>{data.client.address}</Text>
          <Text style={styles.addressText}>{data.client.email}</Text>
          <Text style={styles.addressText}>State: {data.client.state}</Text>
        </View>
      </View>

      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, styles.tableHeaderText, styles.tableCellDescription]}>DESCRIPTION</Text>
          <Text style={[styles.tableCell, styles.tableHeaderText]}>QTY</Text>
          <Text style={[styles.tableCell, styles.tableHeaderText]}>PRICE</Text>
          <Text style={[styles.tableCell, styles.tableHeaderText]}>AMOUNT</Text>
          <Text style={[styles.tableCell, styles.tableHeaderText]}>TAX RATE</Text>
          {data.items[0]?.taxType === 'gst' ? (
            <>
              <Text style={[styles.tableCell, styles.tableHeaderText]}>CGST</Text>
              <Text style={[styles.tableCell, styles.tableHeaderText]}>SGST</Text>
            </>
          ) : (
            <Text style={[styles.tableCell, styles.tableHeaderText]}>IGST</Text>
          )}
          <Text style={[styles.tableCellAmount, styles.tableHeaderText]}>TOTAL</Text>
        </View>

        {data.items.map((item, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableCellDescription]}>{item.description}</Text>
            <Text style={styles.tableCell}>{item.quantity}</Text>
            <Text style={styles.tableCell}>{formatCurrency(item.price)}</Text>
            <Text style={styles.tableCell}>{formatCurrency(item.amount)}</Text>
            <Text style={styles.tableCell}>{item.taxRate}%</Text>
            {item.taxType === 'gst' ? (
              <>
                <Text style={styles.tableCell}>{formatCurrency(item.cgst || 0)}</Text>
                <Text style={styles.tableCell}>{formatCurrency(item.sgst || 0)}</Text>
              </>
            ) : (
              <Text style={styles.tableCell}>{formatCurrency(item.igst || 0)}</Text>
            )}
            <Text style={styles.tableCellAmount}>
              {formatCurrency(item.amount + item.totalTaxAmount)}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.totals}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal</Text>
          <Text style={styles.totalAmount}>{formatCurrency(data.subtotal)}</Text>
        </View>
        {data.items[0]?.taxType === 'gst' ? (
          <>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>CGST</Text>
              <Text style={styles.totalAmount}>{formatCurrency(data.cgstTotal)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>SGST</Text>
              <Text style={styles.totalAmount}>{formatCurrency(data.sgstTotal)}</Text>
            </View>
          </>
        ) : (
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>IGST</Text>
            <Text style={styles.totalAmount}>{formatCurrency(data.igstTotal)}</Text>
          </View>
        )}
        <View style={[styles.totalRow, { marginTop: 8 }]}>
          <Text style={[styles.totalLabel, styles.grandTotal]}>Total</Text>
          <Text style={[styles.totalAmount, styles.grandTotal]}>{formatCurrency(data.total)}</Text>
        </View>
      </View>

      <Text style={styles.footer}>
        Thank you for your business!
      </Text>
    </Page>
  </Document>
);

export const InvoicePDF = ({ data }: { data: InvoiceData }) => {
  const downloadPDF = async () => {
    const blob = await pdf(<InvoiceDocument data={data} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice-${data.invoiceNumber}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
        <h3 className="text-xl font-semibold">Tax Invoice Preview</h3>
        <button
          onClick={downloadPDF}
          className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start border-b border-gray-200 pb-6 mb-6">
          <div>
            {data.company.logo && (
              <img src={data.company.logo} alt="Company Logo" className="h-12 mb-4 object-contain" />
            )}
            <h1 className="text-3xl font-bold text-blue-600">TAX INVOICE</h1>
            <p className="text-gray-500">#{data.invoiceNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-500">Issue Date: {data.date}</p>
            <p className="text-gray-500">Due Date: {data.dueDate}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-sm font-semibold text-gray-600 mb-2">FROM</h2>
            <h3 className="text-lg font-semibold">{data.company.name}</h3>
            <p className="text-gray-600">{data.company.address}</p>
            <p className="text-gray-600">{data.company.email}</p>
            <p className="text-gray-600">{data.company.phone}</p>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-600 mb-2">TO</h2>
            <h3 className="text-lg font-semibold">{data.client.name}</h3>
            <p className="text-gray-600">{data.client.address}</p>
            <p className="text-gray-600">{data.client.email}</p>
            <p className="text-gray-600">State: {data.client.state}</p>
          </div>
        </div>

        <div className="overflow-x-auto mb-8">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">DESCRIPTION</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">QTY</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">PRICE</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">AMOUNT</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">TAX RATE</th>
                {data.items[0]?.taxType === 'gst' ? (
                  <>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">CGST</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">SGST</th>
                  </>
                ) : (
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">IGST</th>
                )}
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, i) => (
                <tr key={i} className="border-b border-gray-200">
                  <td className="py-3 px-4">{item.description}</td>
                  <td className="py-3 px-4">{item.quantity}</td>
                  <td className="py-3 px-4">{formatCurrency(item.price)}</td>
                  <td className="py-3 px-4">{formatCurrency(item.amount)}</td>
                  <td className="py-3 px-4">{item.taxRate}%</td>
                  {item.taxType === 'gst' ? (
                    <>
                      <td className="py-3 px-4">{formatCurrency(item.cgst || 0)}</td>
                      <td className="py-3 px-4">{formatCurrency(item.sgst || 0)}</td>
                    </>
                  ) : (
                    <td className="py-3 px-4">{formatCurrency(item.igst || 0)}</td>
                  )}
                  <td className="py-3 px-4 text-right">
                    {formatCurrency(item.amount + item.totalTaxAmount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-end space-y-2">
            <div className="w-64">
              <div className="flex justify-between py-1">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatCurrency(data.subtotal)}</span>
              </div>
              {data.items[0]?.taxType === 'gst' ? (
                <>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">CGST</span>
                    <span>{formatCurrency(data.cgstTotal)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">SGST</span>
                    <span>{formatCurrency(data.sgstTotal)}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">IGST</span>
                  <span>{formatCurrency(data.igstTotal)}</span>
                </div>
              )}
              <div className="flex justify-between py-2 text-lg font-bold text-blue-600">
                <span>Total</span>
                <span>{formatCurrency(data.total)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-gray-500 text-sm mt-8 pt-4 border-t border-gray-200">
          Thank you for your business!
        </div>
      </div>
    </div>
  );
};