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

export const TemplateSimple = React.forwardRef<HTMLDivElement, TemplateProps>(({ invoice, profile }, ref) => {
    
    const subtotal = invoice.items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
    const cgstAmount = subtotal * ((invoice.cgstRate || 0) / 100);
    const sgstAmount = subtotal * ((invoice.sgstRate || 0) / 100);
    const igstAmount = subtotal * ((invoice.igstRate || 0) / 100);
    const totalTax = cgstAmount + sgstAmount + igstAmount;
    const total = subtotal + totalTax;

    return (
        <div ref={ref} className="bg-white p-10 text-gray-700" style={{ width: '800px', fontFamily: 'sans-serif', fontSize: '13px' }}>
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{profile.companyName}</h1>
                    <p className="text-gray-500">{profile.companyAddress}</p>
                </div>
                {profile.logo && <img src={profile.logo} alt="Company Logo" className="h-14 object-contain" />}
            </div>

            <div className="grid grid-cols-3 gap-6 mb-10">
                <div className="col-span-2">
                    <p className="text-sm font-semibold text-gray-500">Bill To</p>
                    <p className="font-bold text-gray-800">{invoice.client.name}</p>
                    <p>{invoice.client.address}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-semibold text-gray-500">Invoice No.</p>
                    <p className="text-lg font-mono text-gray-800">{invoice.invoiceNumber}</p>
                    <p className="text-sm font-semibold text-gray-500 mt-2">Date</p>
                    <p className="text-gray-800">{invoice.issueDate}</p>
                </div>
            </div>

            <table className="w-full mb-10">
                <thead>
                    <tr className="border-b-2 border-gray-300 text-left text-sm text-gray-500">
                        <th className="py-2 font-semibold">Description</th>
                        <th className="py-2 font-semibold text-right">Qty</th>
                        <th className="py-2 font-semibold text-right">Rate</th>
                        <th className="py-2 font-semibold text-right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {invoice.items.map(item => (
                        <tr key={item.id} className="border-b border-gray-200">
                            <td className="py-3">{item.description}</td>
                            <td className="py-3 text-right">{item.quantity}</td>
                            <td className="py-3 text-right">₹{item.unitPrice.toLocaleString('en-IN')}</td>
                            <td className="py-3 text-right">₹{(item.quantity * item.unitPrice).toLocaleString('en-IN')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-end mb-10">
                <div className="w-2/5 space-y-2">
                    <div className="flex justify-between"><p className="text-gray-500">Subtotal</p> <p>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p></div>
                    <div className="flex justify-between"><p className="text-gray-500">Total Tax</p> <p>₹{totalTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p></div>
                    <div className="flex justify-between text-xl font-bold text-gray-900 mt-2 pt-2 border-t-2 border-gray-300"><p>Amount Due</p> <p>₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p></div>
                </div>
            </div>

            <div className="text-xs text-gray-500">
                <p className="font-bold text-gray-600 mb-1">Amount in Words</p>
                <p>{numberToWordsINR(total)}</p>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200 text-xs text-gray-500 grid grid-cols-2 gap-8">
                <div>
                     <h4 className="font-semibold mb-2 text-gray-600">Payment Details</h4>
                     <p>{invoice.bankDetails?.accountName}</p>
                     <p>A/C: {invoice.bankDetails?.accountNumber}</p>
                     <p>{invoice.bankDetails?.bankName} ({invoice.bankDetails?.ifsc})</p>
                </div>
                 <div className="text-center">
                    <p className="font-semibold text-gray-600 mb-2">For {profile.companyName}</p>
                    {profile.companySeal && <img src={profile.companySeal} alt="Seal" className="h-20 w-20 mx-auto my-2 opacity-70 object-contain" />}
                     {profile.authorizedSignature && (
                         <div className="h-16 flex justify-center items-center my-2">
                             <img src={profile.authorizedSignature} alt="Authorized Signature" className="max-h-full max-w-full object-contain" />
                         </div>
                    )}
                    <p className={`pt-2 border-t border-gray-200 ${profile.authorizedSignature ? 'mt-2' : 'mt-12'}`}>
                        Authorised Signatory
                    </p>
                 </div>
            </div>
        </div>
    );
});