import { useState, useCallback } from 'react';
import { Invoice, InvoiceStatus, Client, CompanyProfile } from '../types';

const initialClients: Client[] = [
  { id: 'cli-1', name: 'Innovate LLC', email: 'contact@innovate.com', address: '123 Tech Park, Silicon Valley', gstin: '27AADCB1234F1Z5', state: 'California', stateCode: 'CA' },
  { id: 'cli-2', name: 'Solutions Inc.', email: 'accounts@solutions.inc', address: '456 Business Ave, New York', gstin: '36AAFCS5678F1Z5', state: 'New York', stateCode: 'NY' },
  { id: 'cli-3', name: 'Creative Co.', email: 'billing@creative.co', address: '789 Design St, Los Angeles', gstin: '06AABCC2345F1Z3', state: 'California', stateCode: 'CA' },
];

export const getFinancialYearString = (date: Date): string => {
    const currentMonth = date.getMonth();
    let financialYearStart;
    if (currentMonth >= 3) { // April (month 3) or later
        financialYearStart = date.getFullYear();
    } else { // Jan, Feb, March
        financialYearStart = date.getFullYear() - 1;
    }
    const financialYearEnd = financialYearStart + 1;
    return `${String(financialYearStart).slice(-2)}-${String(financialYearEnd).slice(-2)}`;
}

export const getHighestInvoiceNumber = (existingInvoices: Invoice[], prefix: string): number => {
    if (!prefix) return 0;
    const yearInvoices = existingInvoices.filter(inv => inv.invoiceNumber.startsWith(prefix));
    
    const lastNumber = yearInvoices
        .map(inv => parseInt(inv.invoiceNumber.split('/')[2], 10))
        .filter(num => !isNaN(num))
        .sort((a, b) => b - a)[0] || 0;
        
    return lastNumber;
};


export const generateNextInvoiceNumber = (existingInvoices: Invoice[], companyProfile: CompanyProfile): string => {
    const acronym = companyProfile.companyAcronym || companyProfile.companyName.split(' ').map(word => word[0]).join('').toUpperCase();
    const financialYearString = getFinancialYearString(new Date());
    const prefix = `${acronym}/${financialYearString}/`;

    const lastNumber = getHighestInvoiceNumber(existingInvoices, prefix);

    const nextNumber = (lastNumber + 1).toString().padStart(3, '0');
    return `${prefix}${nextNumber}`;
};


const currentFY = getFinancialYearString(new Date());

const initialInvoices: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: `CN/${currentFY}/001`,
    client: initialClients[0],
    issueDate: '2024-07-15',
    dueDate: '2024-08-14',
    status: InvoiceStatus.Paid,
    items: [
      { id: 'item-1', description: 'Web Development Services', hsnCode: '998314', uom: 'Hrs', quantity: 40, unitPrice: 100 },
      { id: 'item-2', description: 'Cloud Hosting (1 Year)', hsnCode: '998315', uom: 'Pcs', quantity: 1, unitPrice: 500 },
    ],
    cgstRate: 9,
    sgstRate: 9,
  },
  {
    id: 'inv-2',
    invoiceNumber: `CN/${currentFY}/002`,
    client: initialClients[1],
    issueDate: '2024-07-20',
    dueDate: '2024-08-19',
    status: InvoiceStatus.Unpaid,
    items: [
      { id: 'item-3', description: 'UX/UI Design Retainer', hsnCode: '998313', uom: 'Pcs', quantity: 1, unitPrice: 3000 },
    ],
    igstRate: 18,
  },
  {
    id: 'inv-3',
    invoiceNumber: `CN/${getFinancialYearString(new Date('2024-06-01'))}/001`,
    client: initialClients[2],
    issueDate: '2024-06-01',
    dueDate: '2024-07-01',
    status: InvoiceStatus.Overdue,
    items: [
      { id: 'item-4', description: 'Logo Design & Branding', hsnCode: '998313', uom: 'Pcs', quantity: 1, unitPrice: 2500 },
      { id: 'item-5', description: 'Business Cards (x500)', hsnCode: '490110', uom: 'Box', quantity: 1, unitPrice: 250 },
    ],
    cgstRate: 9,
    sgstRate: 9,
  },
  {
    id: 'inv-4',
    invoiceNumber: `CN/${currentFY}/003`,
    client: initialClients[0],
    issueDate: '2024-07-25',
    dueDate: '2024-08-24',
    status: InvoiceStatus.Draft,
    items: [
      { id: 'item-6', description: 'API Integration Consulting', hsnCode: '998314', uom: 'Hrs', quantity: 25, unitPrice: 150 },
    ],
    cgstRate: 9,
    sgstRate: 9,
  },
];

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);

  const addInvoice = useCallback((invoice: Omit<Invoice, 'id'>) => {
    const isDuplicate = invoices.some(inv => inv.invoiceNumber.toLowerCase() === invoice.invoiceNumber.toLowerCase());

    if (isDuplicate) {
        return false;
    }

    const newInvoice: Invoice = {
        ...invoice,
        id: `inv-${new Date().getTime()}`,
    };
    
    setInvoices(currentInvoices => 
        [newInvoice, ...currentInvoices]
        .sort((a, b) => b.issueDate.localeCompare(a.issueDate) || b.invoiceNumber.localeCompare(a.invoiceNumber))
    );
    return true;
  }, [invoices]);

  const updateInvoice = useCallback((updatedInvoice: Invoice) => {
    setInvoices(prev => prev.map(inv => inv.id === updatedInvoice.id ? updatedInvoice : inv));
  }, []);

  const deleteInvoice = useCallback((invoiceId: string) => {
    setInvoices(prev => prev.filter(inv => inv.id !== invoiceId));
  }, []);

  return { invoices, addInvoice, updateInvoice, deleteInvoice, clients: initialClients };
};