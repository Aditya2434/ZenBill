import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { InvoiceList } from './components/InvoiceList';
import { InvoiceForm } from './components/InvoiceForm';
import { Profile } from './components/Profile';
import { ClientManager } from './components/ClientManager';
import { ProductManager } from './components/ProductManager';
import { useInvoices } from './hooks/useInvoices';
import { useProfile } from './hooks/useProfile';
import { useClients } from './hooks/useClients';
import { useProducts } from './hooks/useProducts';
import { Invoice } from './types';

export type View = 'dashboard' | 'invoices' | 'create-invoice' | 'edit-invoice' | 'create-quotation' | 'settings' | 'clients' | 'products';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [invoiceToEdit, setInvoiceToEdit] = useState<Invoice | null>(null);
  const { invoices, addInvoice, updateInvoice, deleteInvoice } = useInvoices();
  const { profile, updateProfile } = useProfile();
  const { clients, addClient, updateClient, deleteClient } = useClients();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();

  const handleSetView = useCallback((view: View) => {
    setCurrentView(view);
  }, []);

  const handleEditInvoice = (invoice: Invoice) => {
    setInvoiceToEdit(invoice);
    setCurrentView('edit-invoice');
  };

  const handleAddInvoice = useCallback((invoice: Omit<Invoice, 'id'>): boolean => {
    return addInvoice(invoice);
  }, [addInvoice]);

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard invoices={invoices} setView={handleSetView} />;
      case 'invoices':
        return <InvoiceList invoices={invoices} onEdit={handleEditInvoice} onDelete={deleteInvoice} setView={handleSetView} profile={profile} />;
      case 'create-invoice':
        return <InvoiceForm addInvoice={handleAddInvoice} setView={handleSetView} profile={profile} invoices={invoices} clients={clients} products={products} />;
      case 'edit-invoice':
        return invoiceToEdit ? <InvoiceForm existingInvoice={invoiceToEdit} updateInvoice={updateInvoice} setView={handleSetView} profile={profile} invoices={invoices} clients={clients} products={products} /> : <InvoiceList invoices={invoices} onEdit={handleEditInvoice} onDelete={deleteInvoice} setView={handleSetView} profile={profile} />;
      case 'create-quotation':
        return (
            <div className="text-center p-8 bg-white rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">Generate Quotation</h2>
                <p className="text-gray-500 mt-2">This feature is under construction and will be available soon!</p>
            </div>
        );
      case 'clients':
        return <ClientManager clients={clients} addClient={addClient} updateClient={updateClient} deleteClient={deleteClient} />;
      case 'products':
        return <ProductManager products={products} addProduct={addProduct} updateProduct={updateProduct} deleteProduct={deleteProduct} />;
      case 'settings':
        return <Profile profile={profile} updateProfile={updateProfile} />;
      default:
        return <Dashboard invoices={invoices} setView={handleSetView} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      <Sidebar currentView={currentView} setView={handleSetView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setView={handleSetView} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6 md:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;