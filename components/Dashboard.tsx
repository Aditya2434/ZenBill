import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Invoice, InvoiceStatus } from '../types';
import { View } from '../App';
import { PlusIcon, DocumentIcon } from './icons';

interface DashboardProps {
  invoices: Invoice[];
  setView: (view: View) => void;
}

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center">
    <div className="bg-blue-100 text-blue-600 rounded-full p-3 mr-4">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

const indianCurrencyFormatter = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(0)}k`;
    return `₹${value}`;
};

export const Dashboard: React.FC<DashboardProps> = ({ invoices, setView }) => {
  const totalInvoices = invoices.length;
  const pendingPayments = invoices.filter(inv => inv.status === InvoiceStatus.Unpaid || inv.status === InvoiceStatus.Overdue).length;
  const paidInvoices = invoices.filter(inv => inv.status === InvoiceStatus.Paid).length;
  const totalRevenue = invoices
    .filter(inv => inv.status === InvoiceStatus.Paid)
    .reduce((sum, inv) => {
      const subtotal = inv.items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
      const cgst = subtotal * ((inv.cgstRate || 0) / 100);
      const sgst = subtotal * ((inv.sgstRate || 0) / 100);
      const igst = subtotal * ((inv.igstRate || 0) / 100);
      return sum + subtotal + cgst + sgst + igst;
    }, 0);

  const chartData = [
    { name: 'Jan', revenue: 400000 },
    { name: 'Feb', revenue: 300000 },
    { name: 'Mar', revenue: 500000 },
    { name: 'Apr', revenue: 450000 },
    { name: 'May', revenue: 600000 },
    { name: 'Jun', revenue: 550000 },
    { name: 'Jul', revenue: totalRevenue },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-gray-500 mt-1">Here's a summary of your business activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString('en-IN')}`} icon={<DocumentIcon className="w-6 h-6" />} />
        <StatCard title="Total Invoices" value={String(totalInvoices)} icon={<DocumentIcon className="w-6 h-6" />} />
        <StatCard title="Pending Payments" value={String(pendingPayments)} icon={<DocumentIcon className="w-6 h-6" />} />
        <StatCard title="Paid Invoices" value={String(paidInvoices)} icon={<DocumentIcon className="w-6 h-6" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="font-semibold text-lg text-gray-800 mb-4">Revenue Overview</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={indianCurrencyFormatter} />
                <Tooltip cursor={{ fill: 'rgba(239, 246, 255, 0.5)' }} formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}/>
                <Legend iconSize={10} wrapperStyle={{ fontSize: "14px" }}/>
                <Bar dataKey="revenue" fill="#3B82F6" name="Revenue" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col">
          <h3 className="font-semibold text-lg text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-4">
             <button onClick={() => setView('create-invoice')} className="w-full inline-flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <PlusIcon className="w-5 h-5 mr-2" />
                Create New Invoice
            </button>
             <button onClick={() => setView('create-quotation')} className="w-full inline-flex items-center justify-center px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <DocumentIcon className="w-5 h-5 mr-2" />
                Generate Quotation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};