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
  subtotal: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalTax: number;
  total: number;
}

const FormFieldPreview = ({ label, value, fullWidth = false }: { label: string; value: any; fullWidth?: boolean }) => (
    <div className={`flex items-start ${fullWidth ? 'w-full' : ''}`}>
        <span className="w-1/3 text-sm font-semibold">{label}</span>
        <span className="px-2">:</span>
        <span className="flex-grow text-sm break-words">{value || '-'}</span>
    </div>
);

export const TemplateDefault = React.forwardRef<HTMLDivElement, TemplateProps>(({ invoice, profile, subtotal, cgstAmount, sgstAmount, igstAmount, totalTax, total }, ref) => {

    return (
        <div ref={ref} className="bg-white p-4 text-gray-900" style={{ width: '800px', fontFamily: "'Inter', sans-serif", letterSpacing: '0.2px' }}>
             <div className="border-2 border-black p-4 space-y-2 text-sm">
                {/* Header */}
                <div className="flex justify-between items-start">
                    {/* Section 1: Logo */}
                    <div className="company-logo" style={{ width: '84px', flexShrink: 0 }}>
                        {profile.logo ? (
                            <img src={profile.logo} alt="Company Logo" className="object-contain" style={{height: '80px', width: '80px'}} />
                        ) : (
                            <div className="flex items-center justify-center bg-gray-100 rounded" style={{height: '80px', width: '80px'}}>
                                <span className="text-sm font-bold">LOGO</span>
                            </div>
                        )}
                    </div>

                    {/* Section 2: Company Details */}
                    <div className="company-name text-center px-4 flex-grow">
                        <p className="font-bold break-words" style={{fontSize: '2rem', lineHeight: '2.25rem'}}>{profile.companyName}</p>
                        <p>{profile.companyAddress}</p>
                        <p>GSTIN: {profile.gstin} &nbsp;&nbsp; PAN: {profile.pan}</p>
                    </div>
                    
                    {/* Section 3: Empty Placeholder */}
                    <div className="empty-placeholder" style={{ width: '84px', flexShrink: 0, padding: '16px' }}>
                        {/* Empty as per request */}
                    </div>
                </div>
                <h2 className="text-center font-bold text-lg underline">TAX INVOICE</h2>

                {/* Top Section */}
                <div className="grid grid-cols-2 border-t border-b border-black">
                    <div className="border-r border-black p-2 space-y-1">
                        <div className="flex items-center"><span className="w-1/2 font-semibold">Tax Invoice No.</span>: <span className="pl-2">{invoice.invoiceNumber}</span></div>
                        <div className="flex items-center"><span className="w-1/2 font-semibold">Date</span>: <span className="pl-2">{invoice.issueDate}</span></div>
                        <div className="flex items-center"><span className="w-1/2 font-semibold">Tax Payable on Reverse Charge</span>: <span className="pl-2">{invoice.taxPayableOnReverseCharge ? 'Yes' : 'No'}</span></div>
                        <div className="flex items-center"><span className="w-1/2 font-semibold">State & Code</span>: <span className="pl-2">{`${profile.companyState || ''} ${profile.companyStateCode || ''}`.trim() || '-'}</span></div>
                    </div>
                    <div className="p-2 space-y-1">
                        <FormFieldPreview label="Transport Mode" value={invoice.transportMode} />
                        <FormFieldPreview label="Vehicle No" value={invoice.vehicleNo} />
                        <FormFieldPreview label="Date of Supply" value={invoice.dateOfSupply} />
                        <FormFieldPreview label="Place of Supply" value={invoice.placeOfSupply} />
                        <FormFieldPreview label="Order No" value={invoice.orderNo} />
                    </div>
                </div>
                
                {/* Billed To / Shipped To */}
                <div className="grid grid-cols-2 border-b border-black">
                    <div className="border-r border-black p-2 space-y-1">
                        <div className="font-bold bg-gray-200 text-center mb-2 flex items-center justify-center py-1 whitespace-nowrap">DETAIL OF RECEIVER (BILLED TO)</div>
                        <FormFieldPreview label="Name" value={invoice.client.name} />
                        <div className="flex items-start">
                            <span className="w-1/3 text-sm font-semibold">Address</span>
                            <span className="px-2">:</span>
                            <span className="flex-grow text-sm break-words whitespace-pre-line">{invoice.client.address || '-'}</span>
                        </div>
                        <FormFieldPreview label="GSTIN" value={invoice.client.gstin} />
                        <FormFieldPreview label="State & Code" value={`${invoice.client.state || ''} ${invoice.client.stateCode || ''}`} />
                    </div>
                    <div className="p-2 space-y-1">
                        <div className="font-bold bg-gray-200 text-center mb-2 flex items-center justify-center py-1 whitespace-nowrap">DETAIL OF RECEIVER (SHIPPED TO)</div>
                        <FormFieldPreview label="Name" value={invoice.shippingDetails?.name} />
                        <div className="flex items-start">
                            <span className="w-1/3 text-sm font-semibold">Address</span>
                            <span className="px-2">:</span>
                            <span className="flex-grow text-sm break-words whitespace-pre-line">{invoice.shippingDetails?.address || '-'}</span>
                        </div>
                        <FormFieldPreview label="GSTIN" value={invoice.shippingDetails?.gstin} />
                        <FormFieldPreview label="State & Code" value={`${invoice.shippingDetails?.state || ''} ${invoice.shippingDetails?.stateCode || ''}`} />
                    </div>
                </div>

                {/* Items */}
                 <div style={{ paddingBottom: '20px' }}>
                    <table className="w-full border-collapse border border-black text-sm text-black" style={{ tableLayout: 'fixed' }}>
                        <thead>
                            <tr className="text-center font-bold">
                                <th className="py-3 px-1 border border-black" style={{ width: '5%' }}>S.NO</th>
                                <th className="py-3 px-1 border border-black" style={{ width: '40%' }}>DESCRIPTION OF GOODS</th>
                                <th className="py-3 px-1 border border-black" style={{ width: '10%' }}>HSN CODE</th>
                                <th className="py-3 px-1 border border-black" style={{ width: '10%' }}>UOM</th>
                                <th className="py-3 px-1 border border-black" style={{ width: '10%' }}>QUANTITY</th>
                                <th className="py-3 px-1 border border-black" style={{ width: '10%' }}>RATE</th>
                                <th className="py-3 px-1 border border-black" style={{ width: '15%' }}>AMOUNT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.items && invoice.items.map((item, index) => (
                                <tr key={item.id}>
                                    <td className="py-3 px-1 border border-black text-center align-middle">{index + 1}</td>
                                    <td className="py-3 px-1 border border-black align-middle" style={{ wordBreak: 'break-word' }}>{item.description}</td>
                                    <td className="py-3 px-1 border border-black text-center align-middle">{item.hsnCode}</td>
                                    <td className="py-3 px-1 border border-black text-center align-middle">{item.uom}</td>
                                    <td className="py-3 px-1 border border-black text-right align-middle">{item.quantity}</td>
                                    <td className="py-3 px-1 border border-black text-right align-middle">{`₹${item.unitPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</td>
                                    <td className="py-3 px-1 border border-black text-right align-middle">{`₹${(item.quantity * item.unitPrice).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals */}
                <div className="grid grid-cols-2 border-t border-b border-black">
                    <div className="border-r border-black p-2 flex items-center">
                       <FormFieldPreview label="Total Amount in Words INR" value={numberToWordsINR(total)} fullWidth={true}/>
                    </div>
                    <div className="p-2 text-sm">
                        <div className="space-y-1">
                            <div className="flex justify-between">
                                <span className="font-semibold">Total Amount before Tax</span>
                                <span className="text-right">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold">Add: CGST @ {invoice.cgstRate || 0}%</span>
                                <span className="text-right">₹{cgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold">Add: SGST @ {invoice.sgstRate || 0}%</span>
                                <span className="text-right">₹{sgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold">Add: IGST @ {invoice.igstRate || 0}%</span>
                                <span className="text-right">₹{igstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between border-t border-gray-400 pt-1 mt-1">
                                <span className="font-semibold">Total Tax Amount</span>
                                <span className="text-right">₹{totalTax.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between border-t border-gray-400 pt-1 mt-1 font-bold">
                                <span>Total Amount after Tax</span>
                                <span className="text-right">₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="space-y-1">
                    <FormFieldPreview label="GR/LR NO" value={invoice.grLrNo}/>
                    <FormFieldPreview label="E WAY BILL NO" value={invoice.eWayBillNo}/>
                    <p className="font-bold underline">OUR BANK DETAIL :</p>
                    <FormFieldPreview label="A/C NAME" value={invoice.bankDetails?.accountName}/>
                    <FormFieldPreview label="A/C NO" value={invoice.bankDetails?.accountNumber}/>
                    <FormFieldPreview label="BANK" value={invoice.bankDetails?.bankName}/>
                    <FormFieldPreview label="BRANCH" value={invoice.bankDetails?.branch}/>
                    <FormFieldPreview label="IFSC" value={invoice.bankDetails?.ifsc}/>

                    <div>
                        <p className="font-semibold">Terms & Condition for Supply :</p>
                        <p className="text-xs whitespace-pre-wrap">{invoice.termsAndConditions}</p>
                    </div>
                    
                    <div className="grid grid-cols-3 pt-4 text-xs">
                         <div>Subject to {invoice.jurisdiction} Jurisdiction</div>
                         <div className="text-center">
                             {profile.companySeal && (
                                <div className="h-24 flex items-center justify-center">
                                    <img src={profile.companySeal} alt="Company Seal" className="max-h-full max-w-full object-contain" />
                                </div>
                             )}
                             Common seal
                         </div>
                         <div className="text-right">
                             <p>For {profile.companyName}.</p>
                             {profile.authorizedSignature ? (
                                 <div className="h-20 flex justify-end items-center my-2">
                                     <img src={profile.authorizedSignature} alt="Authorized Signature" className="max-h-full max-w-full object-contain" />
                                 </div>
                             ) : (
                                 <div className="h-24"></div>
                             )}
                             <p className="font-bold">AUTHORISED.</p>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
});