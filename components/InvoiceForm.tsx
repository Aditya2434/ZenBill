import React, { useState, useEffect, useMemo } from 'react';
import { Invoice, InvoiceItem, InvoiceStatus, Client, CompanyProfile } from '../types';
import { View } from '../App';
import { PlusIcon, TrashIcon } from './icons';
import { useInvoices, generateNextInvoiceNumber, getHighestInvoiceNumber } from '../hooks/useInvoices';

interface InvoiceFormProps {
  existingInvoice?: Invoice | null;
  addInvoice?: (invoice: Omit<Invoice, 'id'>) => boolean;
  updateInvoice?: (invoice: Invoice) => void;
  setView: (view: View) => void;
  profile: CompanyProfile;
  invoices: Invoice[];
}

function numberToWordsINR(num: number): string {
    const a = ['', 'ONE ', 'TWO ', 'THREE ', 'FOUR ', 'FIVE ', 'SIX ', 'SEVEN ', 'EIGHT ', 'NINE ', 'TEN ', 'ELEVEN ', 'TWELVE ', 'THIRTEEN ', 'FOURTEEN ', 'FIFTEEN ', 'SIXTEEN ', 'SEVENTEEN ', 'EIGHTEEN ', 'NINETEEN '];
    const b = ['', '', 'TWENTY ', 'THIRTY ', 'FORTY ', 'FIFTY ', 'SIXTY ', 'SEVENTY ', 'EIGHTY ', 'NINETY '];

    const [integerPartStr] = num.toFixed(2).split('.');
    let n = parseInt(integerPartStr, 10);
    
    if (n === 0) return 'ZERO RUPEES ONLY.';
    if (n > 999999999) return 'NUMBER TOO LARGE';

    const inWords = (num: number, s: string) => {
        let str = '';
        if (num > 19) {
            str += b[Math.floor(num / 10)] + a[num % 10];
        } else {
            str += a[num];
        }
        if (num !== 0) {
            str += s;
        }
        return str;
    };

    let res = '';
    res += inWords(Math.floor(n / 10000000), 'CRORE ');
    n %= 10000000;
    res += inWords(Math.floor(n / 100000), 'LAKH ');
    n %= 100000;
    res += inWords(Math.floor(n / 1000), 'THOUSAND ');
    n %= 1000;
    res += inWords(Math.floor(n / 100), 'HUNDRED ');
    n %= 100;
    if (n > 0 && res.trim() !== '') {
        res += 'AND ';
    }
    res += inWords(n, '');

    return res.trim().replace(/\s\s+/g, ' ') + ' RUPEES ONLY.';
}


const getTodayDateString = () => new Date().toISOString().split('T')[0];

const FormField = ({ label, name, value, onChange, fullWidth = false, type = "text", disabled, ...props }: {label: string, name: string, value: any, onChange: any, fullWidth?: boolean, type?: string, disabled?: boolean}) => (
    <div className={`flex items-center ${fullWidth ? 'w-full' : ''}`}>
        <label htmlFor={name} className="w-1/3 text-sm font-semibold">{label}</label>
        <span className="px-2">:</span>
        <input
            type={type}
            id={name}
            name={name}
            value={value || ''}
            onChange={onChange}
            disabled={disabled}
            className={`flex-grow p-1 border border-gray-300 text-sm bg-white text-gray-900 ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            {...props}
        />
    </div>
);

export const InvoiceForm: React.FC<InvoiceFormProps> = ({ existingInvoice, addInvoice, updateInvoice, setView, profile, invoices }) => {
  const emptyInvoice = useMemo(() => ({
      client: { id: '', name: '', email: '', address: '', gstin: '', state: '', stateCode: '' },
      items: [{ id: `item-${Date.now()}`, description: '', quantity: 1, unitPrice: 0, hsnCode: '', uom: '' }],
      issueDate: getTodayDateString(),
      dueDate: getTodayDateString(),
      status: InvoiceStatus.Draft,
      shippingDetails: { name: '', address: '', gstin: '', state: '', stateCode: '' },
      transportMode: '',
      vehicleNo: '',
      dateOfSupply: getTodayDateString(),
      placeOfSupply: '',
      orderNo: '',
      taxPayableOnReverseCharge: false,
      cgstRate: 9,
      sgstRate: 9,
      igstRate: 0,
      grLrNo: '',
      eWayBillNo: '',
      bankDetails: profile.defaultBankDetails,
      termsAndConditions: '1. Goods once sold will not be taken back.\n2. Interest @18% p.a. will be charged if the payment is not made within the stipulated time.',
      jurisdiction: 'DURGAPUR',
  }), [profile]);

  const [invoice, setInvoice] = useState<Omit<Invoice, 'id'|'invoiceNumber'> | Invoice>(existingInvoice || emptyInvoice);
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [invoiceNumberPrefix, setInvoiceNumberPrefix] = useState('');
  const [invoiceNumberSequential, setInvoiceNumberSequential] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [showEmptyInvoiceModal, setShowEmptyInvoiceModal] = useState(false);
  const { clients } = useInvoices();

  useEffect(() => {
    if (existingInvoice) {
      setInvoice(existingInvoice);
      const bill = existingInvoice.client;
      const ship = existingInvoice.shippingDetails;
      if(ship && (bill.name !== ship.name || bill.address !== ship.address)) {
          setSameAsBilling(false);
      } else {
        setSameAsBilling(true);
      }
    } else {
      setInvoice(emptyInvoice);
      setSameAsBilling(true);
      const nextInvoiceNumber = generateNextInvoiceNumber(invoices, profile);
      const parts = nextInvoiceNumber.split('/');
      if (parts.length === 3) {
          setInvoiceNumberPrefix(`${parts[0]}/${parts[1]}/`);
          setInvoiceNumberSequential(parts[2]);
      }
    }
  }, [existingInvoice, emptyInvoice, invoices, profile]);
  
  useEffect(() => {
    if (sameAsBilling && invoice.client) {
      const { name, address, gstin, state, stateCode } = invoice.client;
      setInvoice(prev => ({
        ...prev,
        shippingDetails: { ...prev.shippingDetails, name, address, gstin, state, stateCode }
      }));
    }
  }, [sameAsBilling, invoice.client]);

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedClient = clients.find(c => c.id === e.target.value);
    if(selectedClient) {
      setInvoice({ ...invoice, client: selectedClient });
    } else {
      setInvoice({ ...invoice, client: emptyInvoice.client });
    }
  };
  
  const handleSequentialNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormError(null);
    const { value } = e.target;
    const numericValue = value.replace(/[^0-9]/g, ''); // Only allow numbers
    if (numericValue.length <= 3) {
        setInvoiceNumberSequential(numericValue);
    }
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = invoice.items.map((item, i) => {
        if (i === index) {
            const updatedItem = { ...item, [field]: value };
            if (field === 'quantity' || field === 'unitPrice') {
                updatedItem[field] = Number(value) || 0;
            }
            return updatedItem;
        }
        return item;
    });
    setInvoice({ ...invoice, items: newItems });
  };

  const addItem = () => {
    setInvoice({
      ...invoice,
      items: [...invoice.items, { id: `item-${Date.now()}`, description: '', quantity: 1, unitPrice: 0, hsnCode: '', uom: '' }],
    });
  };

  const removeItem = (index: number) => {
    setInvoice({ ...invoice, items: invoice.items.filter((_, i) => i !== index) });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setInvoice(prev => ({ ...prev, [name]: checked }));
      } else {
        setInvoice(prev => ({ ...prev, [name]: (name.includes('Rate')) ? parseFloat(value) || 0 : value }));
      }
  };
  
  const handleNestedChange = (section: 'shippingDetails' | 'bankDetails' | 'client', e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInvoice(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as object),
        [name]: value,
      }
    }));
  };

  const { subtotal, cgstAmount, sgstAmount, igstAmount, totalTax, total } = useMemo(() => {
    const subtotal = invoice.items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
    const cgstAmount = subtotal * ((invoice.cgstRate || 0) / 100);
    const sgstAmount = subtotal * ((invoice.sgstRate || 0) / 100);
    const igstAmount = subtotal * ((invoice.igstRate || 0) / 100);
    const totalTax = cgstAmount + sgstAmount + igstAmount;
    const total = subtotal + totalTax;
    return { subtotal, cgstAmount, sgstAmount, igstAmount, totalTax, total };
  }, [invoice.items, invoice.cgstRate, invoice.sgstRate, invoice.igstRate]);
  
  const proceedWithSubmit = () => {
    setFormError(null);
    if (existingInvoice && updateInvoice) {
      updateInvoice(invoice as Invoice);
      setView('invoices');
    } else if (addInvoice) {
      const finalSequential = invoiceNumberSequential.padStart(3, '0');
      const fullInvoiceNumber = `${invoiceNumberPrefix}${finalSequential}`;

      const isDuplicate = invoices.some(inv => inv.invoiceNumber.toLowerCase() === fullInvoiceNumber.toLowerCase());
      if (isDuplicate) {
        setFormError("Invoice number already exists.");
        return;
      }
      
      const highestNumber = getHighestInvoiceNumber(invoices, invoiceNumberPrefix);
      const currentNumber = parseInt(finalSequential, 10);
      if (!isNaN(currentNumber) && currentNumber <= highestNumber) {
          setFormError(`Invoice no. must be > ${String(highestNumber).padStart(3, '0')}.`);
          return;
      }

      const invoiceToSave = {
          ...(invoice as Omit<Invoice, 'id' | 'invoiceNumber'>),
          invoiceNumber: fullInvoiceNumber,
      };

      const success = addInvoice(invoiceToSave);
      if (success) {
          setView('invoices');
      } else {
          setFormError("This invoice number might be a duplicate.");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const hasItems = invoice.items.some(item => item.description.trim() !== '');

    if (!hasItems && !existingInvoice) {
        setShowEmptyInvoiceModal(true);
        return;
    }

    proceedWithSubmit();
  };

  const handleConfirmSaveEmpty = () => {
    setShowEmptyInvoiceModal(false);
    proceedWithSubmit();
  };

  const handleDiscardEmpty = () => {
    setShowEmptyInvoiceModal(false);
    setView('invoices');
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
        {showEmptyInvoiceModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
                    <h3 className="text-lg font-medium text-gray-900">Confirm Save</h3>
                    <p className="mt-2 text-sm text-gray-600">
                        There is no item added. Do you want to save it or discard it?
                    </p>
                    <div className="mt-4 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={handleDiscardEmpty}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Discard it
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirmSaveEmpty}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700"
                        >
                            Yes, save it
                        </button>
                    </div>
                </div>
            </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{existingInvoice ? 'Edit Invoice' : 'Create Invoice'}</h2>
                <div>
                    <button type="button" onClick={() => setView('invoices')} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 mr-2">
                        Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700">
                        {existingInvoice ? 'Save Changes' : 'Save Invoice'}
                    </button>
                </div>
            </div>

            <div className="border-2 border-black p-4 space-y-2 text-sm">
                {/* Header */}
                <div className="text-center">
                    {profile.logo ? (
                        <img src={profile.logo} alt="Company Logo" className="h-20 mx-auto mb-2 object-contain"/>
                    ) : (
                        <h1 className="text-2xl font-bold">LOGO</h1>
                    )}
                    <p className="font-bold">{profile.companyName}</p>
                    <p>{profile.companyAddress}</p>
                    <p>GSTIN: {profile.gstin} &nbsp;&nbsp; PAN: {profile.pan}</p>
                </div>
                <h2 className="text-center font-bold text-lg underline">TAX INVOICE</h2>

                {/* Top Section */}
                <div className="grid grid-cols-2 border-t border-b border-black">
                    <div className="border-r border-black p-2 space-y-1">
                        <div className="flex items-start">
                            <label className="w-1/2 font-semibold pt-1">Tax Invoice No.</label>
                            <span className="pr-2 pt-1">:</span>
                            {existingInvoice ? (
                                <span className="pl-2 font-medium">{existingInvoice.invoiceNumber}</span>
                            ) : (
                                <div>
                                    <div className={`flex items-center border rounded-md overflow-hidden bg-white ${formError ? 'border-red-500' : 'border-gray-300'}`}>
                                        <span className="px-2 py-1 text-gray-600 bg-gray-100">{invoiceNumberPrefix}</span>
                                        <input
                                            type="text"
                                            value={invoiceNumberSequential}
                                            onChange={handleSequentialNumberChange}
                                            onFocus={() => alert('You can edit only the last three digits of the invoice number.')}
                                            className="p-1 w-16 text-sm text-gray-900 bg-white focus:outline-none"
                                            maxLength={3}
                                        />
                                    </div>
                                    {formError && <p className="text-red-500 text-xs mt-1">{formError}</p>}
                                </div>
                            )}
                        </div>
                        <div className="flex items-center"><label className="w-1/2 font-semibold">Date</label>: <input type="date" name="issueDate" value={invoice.issueDate} onChange={handleInputChange} className="p-1 border border-gray-300 w-1/2 bg-white text-gray-900" /></div>
                        <div className="flex items-center"><label className="w-1/2 font-semibold">Tax Payable on Reverse Charge</label>: <input type="checkbox" name="taxPayableOnReverseCharge" checked={invoice.taxPayableOnReverseCharge} onChange={handleInputChange} className="ml-2" /></div>
                        <div className="flex items-center"><label className="w-1/2 font-semibold">State & Code</label>: <input type="text" placeholder="State & Code" className="p-1 border border-gray-300 w-1/2 bg-white text-gray-900"/></div>
                    </div>
                    <div className="p-2 space-y-1">
                        <FormField label="Transport Mode" name="transportMode" value={invoice.transportMode} onChange={handleInputChange}/>
                        <FormField label="Vehicle No" name="vehicleNo" value={invoice.vehicleNo} onChange={handleInputChange}/>
                        <FormField label="Date of Supply" name="dateOfSupply" value={invoice.dateOfSupply} onChange={handleInputChange} type="date"/>
                        <FormField label="Place of Supply" name="placeOfSupply" value={invoice.placeOfSupply} onChange={handleInputChange}/>
                        <FormField label="Order No" name="orderNo" value={invoice.orderNo} onChange={handleInputChange}/>
                    </div>
                </div>
                
                {/* Billed To / Shipped To */}
                <div className="grid grid-cols-2 border-b border-black">
                    <div className="border-r border-black p-2">
                        <h3 className="font-bold bg-gray-200 text-center mb-2">DETAIL OF RECEIVER (BILLED TO)</h3>
                         <select id="client" value={invoice.client.id} onChange={handleClientChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white text-gray-900 border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md mb-2">
                            <option value="">Select a client or enter details manually</option>
                            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <FormField label="Name" name="name" value={invoice.client.name} onChange={(e) => handleNestedChange('client', e)}/>
                        <FormField label="Address" name="address" value={invoice.client.address} onChange={(e) => handleNestedChange('client', e)}/>
                        <FormField label="GSTIN" name="gstin" value={invoice.client.gstin} onChange={(e) => handleNestedChange('client', e)}/>
                        <FormField label="State & Code" name="state" value={`${invoice.client.state||''} ${invoice.client.stateCode||''}`} onChange={(e) => handleNestedChange('client', e)}/>
                    </div>
                    <div className="p-2">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-bold bg-gray-200 text-center flex-grow">DETAIL OF RECEIVER (SHIPPED TO)</h3>
                          <div className="flex items-center ml-2 text-xs">
                            <input type="checkbox" id="sameAsBilling" checked={sameAsBilling} onChange={(e) => setSameAsBilling(e.target.checked)} className="mr-1"/>
                            <label htmlFor="sameAsBilling">Same as billing</label>
                          </div>
                        </div>
                        <FormField label="Name" name="name" value={invoice.shippingDetails?.name} onChange={(e) => handleNestedChange('shippingDetails', e)} disabled={sameAsBilling}/>
                        <FormField label="Address" name="address" value={invoice.shippingDetails?.address} onChange={(e) => handleNestedChange('shippingDetails', e)} disabled={sameAsBilling}/>
                        <FormField label="GSTIN" name="gstin" value={invoice.shippingDetails?.gstin} onChange={(e) => handleNestedChange('shippingDetails', e)} disabled={sameAsBilling}/>
                        <FormField label="State & Code" name="state" value={`${invoice.shippingDetails?.state||''} ${invoice.shippingDetails?.stateCode||''}`} onChange={(e) => handleNestedChange('shippingDetails', e)} disabled={sameAsBilling}/>
                    </div>
                </div>

                {/* Items */}
                <div>
                  <div className="grid grid-cols-[3fr,14fr,4fr,4fr,4fr,4fr,5fr,2fr] border-b border-black font-bold text-center">
                    <div className="p-1 border-r border-black">S.NO</div>
                    <div className="p-1 border-r border-black">DESCRIPTION OF GOODS</div>
                    <div className="p-1 border-r border-black">HSN CODE</div>
                    <div className="p-1 border-r border-black">UOM</div>
                    <div className="p-1 border-r border-black">QUANTITY</div>
                    <div className="p-1 border-r border-black">RATE</div>
                    <div className="p-1">AMOUNT</div>
                  </div>
                  <div className="space-y-1">
                    {invoice.items.map((item, index) => (
                      <div key={item.id} className="grid grid-cols-[3fr,14fr,4fr,4fr,4fr,4fr,5fr,2fr] items-center">
                        <div className="text-center p-1">{index + 1}</div>
                        <input type="text" placeholder="Item description" value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} className="w-full p-1 border border-gray-300 bg-white text-gray-900"/>
                        <input type="text" placeholder="HSN" value={item.hsnCode} onChange={(e) => handleItemChange(index, 'hsnCode', e.target.value)} className="w-full p-1 border border-gray-300 bg-white text-gray-900" />
                        <input type="text" placeholder="UOM" value={item.uom} onChange={(e) => handleItemChange(index, 'uom', e.target.value)} className="w-full p-1 border border-gray-300 bg-white text-gray-900" />
                        <input type="number" placeholder="Qty" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} className="w-full p-1 border border-gray-300 bg-white text-gray-900" />
                        <input type="number" placeholder="Price" value={item.unitPrice} onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)} className="w-full p-1 border border-gray-300 bg-white text-gray-900" />
                        <p className="text-right p-1">₹{(item.quantity * item.unitPrice).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700 flex justify-center">
                          <TrashIcon />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={addItem} className="mt-2 inline-flex items-center px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-transparent rounded-lg hover:bg-blue-100">
                    <PlusIcon className="mr-1 w-4 h-4" /> Add Item
                  </button>
                </div>

                {/* Totals */}
                <div className="grid grid-cols-2 border-t border-b border-black">
                    <div className="border-r border-black p-2 flex items-start">
                        <span className="w-1/3 text-sm font-semibold">Total Amount in Words INR</span>
                        <span className="px-2">:</span>
                        <span className="flex-grow text-sm break-words font-medium text-gray-800">{numberToWordsINR(total)}</span>
                    </div>
                    <div className="p-2 text-sm">
                        <div className="flex justify-between"><span className="font-semibold">Total Amount before Tax</span> <span>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center"><span className="font-semibold w-24">Add: CGST @</span><input type="number" name="cgstRate" value={invoice.cgstRate || ''} onChange={handleInputChange} className="w-16 p-1 border border-gray-300 text-right bg-white text-gray-900"/> %</div>
                             <span>₹{cgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center"><span className="font-semibold w-24">Add: SGST @</span><input type="number" name="sgstRate" value={invoice.sgstRate || ''} onChange={handleInputChange} className="w-16 p-1 border border-gray-300 text-right bg-white text-gray-900"/> %</div>
                            <span>₹{sgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center"><span className="font-semibold w-24">Add: IGST @</span><input type="number" name="igstRate" value={invoice.igstRate || ''} onChange={handleInputChange} className="w-16 p-1 border border-gray-300 text-right bg-white text-gray-900"/> %</div>
                            <span>₹{igstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between border-t border-gray-400 mt-1 pt-1"><span className="font-semibold">Total Tax Amount</span> <span>₹{totalTax.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                        <div className="flex justify-between font-bold border-t border-gray-400 mt-1 pt-1"><span className="font-semibold">Total Amount after Tax</span> <span>₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                    </div>
                </div>

                {/* Footer */}
                <div className="space-y-1">
                    <FormField label="GR/LR NO" name="grLrNo" value={invoice.grLrNo} onChange={handleInputChange}/>
                    <FormField label="E WAY BILL NO" name="eWayBillNo" value={invoice.eWayBillNo} onChange={handleInputChange}/>
                    <p className="font-bold underline">OUR BANK DETAIL :</p>
                    <FormField label="A/C NAME" name="accountName" value={invoice.bankDetails?.accountName} onChange={(e) => handleNestedChange('bankDetails', e)}/>
                    <FormField label="A/C NO" name="accountNumber" value={invoice.bankDetails?.accountNumber} onChange={(e) => handleNestedChange('bankDetails', e)}/>
                    <FormField label="BANK" name="bankName" value={invoice.bankDetails?.bankName} onChange={(e) => handleNestedChange('bankDetails', e)}/>
                    <FormField label="BRANCH" name="branch" value={invoice.bankDetails?.branch} onChange={(e) => handleNestedChange('bankDetails', e)}/>
                    <FormField label="IFSC" name="ifsc" value={invoice.bankDetails?.ifsc} onChange={(e) => handleNestedChange('bankDetails', e)}/>

                    <div>
                        <label className="font-semibold">Terms & Condition for Supply :</label>
                        <textarea name="termsAndConditions" value={invoice.termsAndConditions} onChange={handleInputChange} rows={3} className="w-full p-1 border border-gray-300 text-xs bg-white text-gray-900"></textarea>
                    </div>
                    
                    <div className="grid grid-cols-3 pt-4 text-xs">
                         <div>Subject to <input name="jurisdiction" value={invoice.jurisdiction} onChange={handleInputChange} className="w-24 p-1 border border-gray-300 bg-white text-gray-900"/> Jurisdiction</div>
                         <div className="text-center">Common seal</div>
                         <div className="text-right">For {profile.companyName}.</div>
                    </div>
                     <div className="text-right pt-12 font-bold text-xs">AUTHORISED.</div>
                </div>

            </div>
        </form>
    </div>
  );
};