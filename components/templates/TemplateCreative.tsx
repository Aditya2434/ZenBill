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

export const TemplateCreative = React.forwardRef<HTMLDivElement, TemplateProps>(({ invoice, profile }, ref) => {
    
    const subtotal = invoice.items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
    const cgstAmount = subtotal * ((invoice.cgstRate || 0) / 100);
    const sgstAmount = subtotal * ((invoice.sgstRate || 0) / 100);
    const igstAmount = subtotal * ((invoice.igstRate || 0) / 100);
    const totalTax = cgstAmount + sgstAmount + igstAmount;
    const total = subtotal + totalTax;

    return (
        <div ref={ref} className="bg-white" style={{ width: '800px', fontFamily: 'sans-serif', fontSize: '12px' }}>
            <header className="bg-blue-600 text-white p-10">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold">{profile.companyName}</h1>
                        <p className="text-blue-100">{profile.companyAddress}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-4xl font-light uppercase">Invoice</h2>
                        <p className="text-blue-100 mt-1">{invoice.invoiceNumber}</p>
                    </div>
                </div>
                {profile.logo && <img src={profile.logo} alt="Company Logo" className="h-12 mt-4 object-contain" />}
            </header>
            
            <main className="p-10">
                <section className="grid grid-cols-2 gap-10 mb-10 text-sm">
                    <div>
                        <strong className="text-gray-500">Billed To:</strong>
                        <p className="font-bold text-gray-800 text-base">{invoice.client.name}</p>
                        <p className="text-gray-600">{invoice.client.address}</p>
                    </div>
                    <div className="text-right">
                        <strong className="text-gray-500">Date of Issue:</strong>
                        <p className="text-gray-800">{invoice.issueDate}</p>
                        <strong className="text-gray-500 mt-2 block">Due Date:</strong>
                        <p className="text-gray-800">{invoice.dueDate}</p>
                    </div>
                </section>

                <section>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-sm text-gray-500">
                                <th className="pb-2 font-normal">Description</th>
                                <th className="pb-2 font-normal text-right">Qty</th>
                                <th className="pb-2 font-normal text-right">Rate</th>
                                <th className="pb-2 font-normal text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.items.map(item => (
                                <tr key={item.id} className="border-t border-gray-200">
                                    <td className="py-3 pr-2 text-base text-gray-800 font-medium">{item.description}</td>
                                    <td className="py-3 text-right">{item.quantity}</td>
                                    <td className="py-3 text-right">₹{item.unitPrice.toLocaleString('en-IN')}</td>
                                    <td className="py-3 text-right">₹{(item.quantity * item.unitPrice).toLocaleString('en-IN')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
                
                <section className="flex justify-end mt-6">
                    <div className="w-2/5 space-y-2 text-sm">
                        <div className="flex justify-between text-gray-600"><p>Subtotal</p> <p>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p></div>
                        <div className="flex justify-between text-gray-600"><p>Taxes</p> <p>₹{totalTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p></div>
                        <div className="flex justify-between font-bold text-blue-600 text-2xl mt-2 pt-2">
                            <p>Total</p> <p>₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                        </div>
                    </div>
                </section>

                 <section className="mt-8 text-xs text-gray-500">
                    <p className="font-semibold text-gray-600">Amount in Words:</p>
                    <p className="uppercase">{numberToWordsINR(total)}</p>
                </section>
            </main>
            
            <footer className="bg-gray-50 p-10 text-xs text-gray-600 grid grid-cols-3 gap-6">
                <div>
                    <h4 className="font-semibold mb-2 text-gray-700">Bank Details</h4>
                    <p>A/C: {invoice.bankDetails?.accountNumber}</p>
                    <p>{invoice.bankDetails?.bankName}</p>
                    <p>IFSC: {invoice.bankDetails?.ifsc}</p>
                </div>
                <div>
                    <h4 className="font-semibold mb-2 text-gray-700">Terms</h4>
                    <p className="whitespace-pre-wrap">{invoice.termsAndConditions}</p>
                </div>
                <div className="text-center">
                    <p className="font-semibold text-gray-700">For {profile.companyName}</p>
                    {profile.companySeal && <img src={profile.companySeal} alt="Seal" className="h-20 w-20 mx-auto my-2 opacity-70 object-contain" />}
                    <p className="mt-4 pt-4 border-t border-gray-200">Authorized Signature</p>
                </div>
            </footer>
        </div>
    );
});
