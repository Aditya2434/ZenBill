import React, { useState, useRef, useEffect } from 'react';
import { Invoice, InvoiceStatus, CompanyProfile } from '../types';
import { View } from '../App';
import { PlusIcon, DownloadIcon, TrashIcon } from './icons';
import { InvoicePreview } from './InvoicePreview';

// FIX: Moved `declare` statements to the top level of the module.
// `declare` is not allowed inside a function block.
declare const html2canvas: any;
declare const jspdf: any;

interface InvoiceListProps {
  invoices: Invoice[];
  onEdit: (invoice: Invoice) => void;
  onDelete: (invoiceId: string) => void;
  setView: (view: View) => void;
  profile: CompanyProfile;
}

const StatusBadge: React.FC<{ status: InvoiceStatus }> = ({ status }) => {
  const baseClasses = 'px-2.5 py-0.5 text-xs font-medium rounded-full inline-flex items-center';
  const statusClasses = {
    [InvoiceStatus.Paid]: 'bg-green-100 text-green-800',
    [InvoiceStatus.Unpaid]: 'bg-yellow-100 text-yellow-800',
    [InvoiceStatus.Overdue]: 'bg-red-100 text-red-800',
    [InvoiceStatus.Draft]: 'bg-gray-100 text-gray-800',
  };

  return (
    <span className={`${baseClasses} ${statusClasses[status]}`}>
      {status}
    </span>
  );
};

// FIX: Added a helper function to calculate all invoice totals needed by InvoicePreview.
const calculateInvoiceTotals = (invoice: Invoice) => {
    const subtotal = invoice.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const cgstAmount = subtotal * ((invoice.cgstRate || 0) / 100);
    const sgstAmount = subtotal * ((invoice.sgstRate || 0) / 100);
    const igstAmount = subtotal * ((invoice.igstRate || 0) / 100);
    const totalTax = cgstAmount + sgstAmount + igstAmount;
    const total = subtotal + totalTax;
    return { subtotal, cgstAmount, sgstAmount, igstAmount, totalTax, total };
};

export const InvoiceList: React.FC<InvoiceListProps> = ({ invoices, onEdit, onDelete, setView, profile }) => {
  const [downloadingInvoice, setDownloadingInvoice] = useState<Invoice | null>(null);
  const invoicePreviewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (downloadingInvoice && invoicePreviewRef.current) {
      const generatePdf = (invoice: Invoice) => {
        const elementToCapture = invoicePreviewRef.current;
        
        if (!elementToCapture) return;
        
        html2canvas(elementToCapture, { 
          scale: 2, // Higher scale for better quality
          useCORS: true,
          logging: false,
          width: elementToCapture.offsetWidth,
          height: elementToCapture.offsetHeight
        }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const { jsPDF } = jspdf;
            
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            
            const pdf = new jsPDF({
                orientation: canvasWidth > canvasHeight ? 'l' : 'p',
                unit: 'px',
                format: [canvasWidth, canvasHeight]
            });

            pdf.addImage(imgData, 'PNG', 0, 0, canvasWidth, canvasHeight);
            pdf.save(`Invoice-${invoice.invoiceNumber}.pdf`);

            setDownloadingInvoice(null);
        }).catch(err => {
            console.error("Error generating PDF", err);
            setDownloadingInvoice(null);
        });
      };
      
      // Use a short timeout to ensure the off-screen component has fully rendered before capturing.
      const timer = setTimeout(() => generatePdf(downloadingInvoice), 100);

      return () => clearTimeout(timer);
    }
  }, [downloadingInvoice]);

  const handleDownload = (invoice: Invoice) => {
    setDownloadingInvoice(invoice);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Invoices</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your invoices and track their status.</p>
        </div>
        <button 
          onClick={() => setView('create-invoice')}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Create Invoice
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Invoice #</th>
              <th scope="col" className="px-6 py-3">Client</th>
              <th scope="col" className="px-6 py-3">Issue Date</th>
              <th scope="col" className="px-6 py-3">Due Date</th>
              <th scope="col" className="px-6 py-3">Amount</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(invoice => (
              <tr key={invoice.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{invoice.invoiceNumber}</td>
                <td className="px-6 py-4">{invoice.client.name}</td>
                <td className="px-6 py-4">{invoice.issueDate}</td>
                <td className="px-6 py-4">{invoice.dueDate}</td>
                <td className="px-6 py-4 font-medium text-gray-800">₹{calculateInvoiceTotals(invoice).total.toLocaleString('en-IN')}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={invoice.status} />
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => handleDownload(invoice)} title="Download PDF" className="p-1 font-medium text-gray-500 hover:text-blue-600">
                    <DownloadIcon className="w-4 h-4" />
                  </button>
                  <button onClick={() => onEdit(invoice)} className="font-medium text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => onDelete(invoice.id)} className="font-medium text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* This is the off-screen component for PDF generation */}
      {downloadingInvoice && (
        <div style={{ position: 'absolute', left: '-9999px', top: 0, zIndex: -10 }}>
            <InvoicePreview ref={invoicePreviewRef} invoice={downloadingInvoice} profile={profile} {...calculateInvoiceTotals(downloadingInvoice)} />
        </div>
      )}
    </div>
  );
};
