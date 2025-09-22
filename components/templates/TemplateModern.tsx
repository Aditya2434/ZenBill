import React from 'react';
import { Invoice, CompanyProfile } from '../../types';

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

interface TemplateProps {
  invoice: Invoice;
  profile: CompanyProfile;
}

export const TemplateModern = React.forwardRef<HTMLDivElement, TemplateProps>(({ invoice, profile }, ref) => {
    
    const subtotal = invoice.items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
    const cgstAmount = subtotal * ((invoice.cgstRate || 0) / 100);
    const sgstAmount = subtotal * ((invoice.sgstRate || 0) / 100);
    const igstAmount = subtotal * ((invoice.igstRate || 0) / 100);
    const totalTax = cgstAmount + sgstAmount + igstAmount;
    const total = subtotal + totalTax;

    return (
        <div ref={ref} className="bg-white p-8 text-gray-800" style={{ width: '800px', fontFamily: 'sans-serif', fontSize: '12px' }}>
            <header className="flex justify-between items-start pb-6 border-b-2 border-gray-200">
                <div className="w-2/3">
                    {profile.logo && <img src={profile.logo} alt="Company Logo" className="h-16 mb-4 object-contain" />}
                    <h1 className="text-2xl font-bold text-gray-900">{profile.companyName}</h1>
                    <p className="text-gray-600 whitespace-pre-line">{profile.companyAddress}</p>
                    <p className="text-gray-600">GSTIN: {profile.gstin} | PAN: {profile.pan}</p>
                </div>
                <div className="w-1/3 text-right">
                    <h2 className="text-3xl font-bold uppercase text-gray-400">Invoice</h2>
                    <p className="text-gray-600 mt-2">{invoice.invoiceNumber}</p>
                    <p className="text-gray-600"><strong>Date:</strong> {invoice.issueDate}</p>
                </div>
            </header>
            
            <section className="grid grid-cols-2 gap-8 my-6">
                <div>
                    <h3 className="font-semibold text-gray-500 uppercase tracking-wider mb-2">Billed To</h3>
                    <p className="font-bold text-gray-900">{invoice.client.name}</p>
                    <p className="text-gray-600 whitespace-pre-line">{invoice.client.address}</p>
                    {invoice.client.gstin && <p className="text-gray-600">GSTIN: {invoice.client.gstin}</p>}
                </div>
                <div>
                    <h3 className="font-semibold text-gray-500 uppercase tracking-wider mb-2">Shipped To</h3>
                    <p className="font-bold text-gray-900">{invoice.shippingDetails?.name}</p>
                    <p className="text-gray-600 whitespace-pre-line">{invoice.shippingDetails?.address}</p>
                    {invoice.shippingDetails?.gstin && <p className="text-gray-600">GSTIN: {invoice.shippingDetails.gstin}</p>}
                </div>
            </section>

            <section>
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-100 text-gray-600 uppercase text-xs">
                            <th className="p-3 font-semibold">Description</th>
                            <th className="p-3 font-semibold text-right">Quantity</th>
                            <th className="p-3 font-semibold text-right">Rate</th>
                            <th className="p-3 font-semibold text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items.map(item => (
                            <tr key={item.id} className="border-b border-gray-100">
                                <td className="p-3">
                                    <p className="font-medium text-gray-800">{item.description}</p>
                                    {item.hsnCode && <p className="text-gray-500 text-xs">HSN: {item.hsnCode}</p>}
                                </td>
                                <td className="p-3 text-right">{item.quantity} {item.uom}</td>
                                <td className="p-3 text-right">₹{item.unitPrice.toLocaleString('en-IN')}</td>
                                <td className="p-3 text-right">₹{(item.quantity * item.unitPrice).toLocaleString('en-IN')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
            
            <section className="flex justify-end mt-6">
                <div className="w-1/2 space-y-2 text-gray-700">
                    <div className="flex justify-between"><p>Subtotal:</p> <p>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p></div>
                    {invoice.cgstRate > 0 && <div className="flex justify-between"><p>CGST ({invoice.cgstRate}%):</p> <p>₹{cgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p></div>}
                    {invoice.sgstRate > 0 && <div className="flex justify-between"><p>SGST ({invoice.sgstRate}%):</p> <p>₹{sgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p></div>}
                    {invoice.igstRate > 0 && <div className="flex justify-between"><p>IGST ({invoice.igstRate}%):</p> <p>₹{igstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p></div>}
                    <div className="flex justify-between font-bold text-gray-900 text-xl border-t-2 border-gray-200 pt-2 mt-2">
                        <p>Total:</p> <p>₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                    </div>
                </div>
            </section>

            <section className="mt-6 text-xs text-gray-600">
                <p className="font-semibold">Amount in Words:</p>
                <p>{numberToWordsINR(total)}</p>
            </section>

            <footer className="mt-12 pt-6 border-t-2 border-gray-200 text-xs">
                <div className="grid grid-cols-3 gap-6">
                    <div>
                        <h4 className="font-semibold mb-2 uppercase text-gray-500">Bank Details</h4>
                        <p>A/C Name: {invoice.bankDetails?.accountName}</p>
                        <p>A/C No: {invoice.bankDetails?.accountNumber}</p>
                        <p>Bank: {invoice.bankDetails?.bankName}</p>
                        <p>IFSC: {invoice.bankDetails?.ifsc}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2 uppercase text-gray-500">Terms & Conditions</h4>
                        <p className="whitespace-pre-wrap">{invoice.termsAndConditions}</p>
                    </div>
                    <div className="text-center">
                        <p className="font-semibold mb-2">For {profile.companyName}</p>
                        {profile.companySeal && <img src={profile.companySeal} alt="Seal" className="h-20 w-20 mx-auto my-2 object-contain" />}
                        {profile.authorizedSignature && (
                            <div className="h-16 flex justify-center items-center my-2">
                                 <img src={profile.authorizedSignature} alt="Authorized Signature" className="max-h-full max-w-full object-contain" />
                            </div>
                        )}
                        <p className={`pt-4 border-t border-gray-300 ${profile.authorizedSignature ? 'mt-2' : 'mt-12'}`}>Authorised Signatory</p>
                    </div>
                </div>
            </footer>
        </div>
    );
});