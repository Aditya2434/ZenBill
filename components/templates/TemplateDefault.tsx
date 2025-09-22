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

const FormFieldPreview = ({ label, value, fullWidth = false }: { label: string; value: any; fullWidth?: boolean }) => (
    <div className={`flex items-start ${fullWidth ? 'w-full' : ''}`}>
        <span className="w-1/3 text-sm font-semibold">{label}</span>
        <span className="px-2">:</span>
        <span className="flex-grow text-sm break-words">{value || '-'}</span>
    </div>
);

export const TemplateDefault = React.forwardRef<HTMLDivElement, TemplateProps>(({ invoice, profile }, ref) => {
    
    const subtotal = invoice.items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
    const cgstAmount = subtotal * ((invoice.cgstRate || 0) / 100);
    const sgstAmount = subtotal * ((invoice.sgstRate || 0) / 100);
    const igstAmount = subtotal * ((invoice.igstRate || 0) / 100);
    const totalTax = cgstAmount + sgstAmount + igstAmount;
    const total = subtotal + totalTax;

    return (
        <div ref={ref} className="bg-white p-4 text-gray-900" style={{ width: '800px', fontFamily: 'sans-serif' }}>
             <div className="border-2 border-black p-4 space-y-2 text-sm">
                {/* Header */}
                <div className="text-center">
                    {profile.logo ? (
                        <img src={profile.logo} alt="Company Logo" className="h-20 mx-auto mb-2 object-contain" />
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
                        <div className="flex items-center"><span className="w-1/2 font-semibold">Tax Invoice No.</span>: <span className="pl-2">{invoice.invoiceNumber}</span></div>
                        <div className="flex items-center"><span className="w-1/2 font-semibold">Date</span>: <span className="pl-2">{invoice.issueDate}</span></div>
                        <div className="flex items-center"><span className="w-1/2 font-semibold">Tax Payable on Reverse Charge</span>: <span className="pl-2">{invoice.taxPayableOnReverseCharge ? 'Yes' : 'No'}</span></div>
                        <div className="flex items-center"><span className="w-1/2 font-semibold">State & Code</span>: <span className="pl-2">-</span></div>
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
                    <div className="border-r border-black p-2">
                        <h3 className="font-bold bg-gray-200 text-center mb-2">DETAIL OF RECEIVER (BILLED TO)</h3>
                        <FormFieldPreview label="Name" value={invoice.client.name} />
                        <FormFieldPreview label="Address" value={invoice.client.address} />
                        <FormFieldPreview label="GSTIN" value={invoice.client.gstin} />
                        <FormFieldPreview label="State & Code" value={`${invoice.client.state || ''} ${invoice.client.stateCode || ''}`} />
                    </div>
                    <div className="p-2">
                        <h3 className="font-bold bg-gray-200 text-center mb-2">DETAIL OF RECEIVER (SHIPPED TO)</h3>
                        <FormFieldPreview label="Name" value={invoice.shippingDetails?.name} />
                        <FormFieldPreview label="Address" value={invoice.shippingDetails?.address} />
                        <FormFieldPreview label="GSTIN" value={invoice.shippingDetails?.gstin} />
                        <FormFieldPreview label="State & Code" value={`${invoice.shippingDetails?.state || ''} ${invoice.shippingDetails?.stateCode || ''}`} />
                    </div>
                </div>

                {/* Items */}
                <div>
                  <div className="grid grid-cols-[3fr,14fr,4fr,4fr,4fr,4fr,5fr] border-b border-black font-bold text-center">
                    <div className="p-1 border-r border-black">S.NO</div>
                    <div className="p-1 border-r border-black">DESCRIPTION OF GOODS</div>
                    <div className="p-1 border-r border-black">HSN CODE</div>
                    <div className="p-1 border-r border-black">UOM</div>
                    <div className="p-1 border-r border-black">QUANTITY</div>
                    <div className="p-1 border-r border-black">RATE</div>
                    <div className="p-1">AMOUNT</div>
                  </div>
                  <div className="">
                    {invoice.items.map((item, index) => (
                      <div key={item.id} className="grid grid-cols-[3fr,14fr,4fr,4fr,4fr,4fr,5fr] items-start border-b">
                        <div className="text-center p-1">{index + 1}</div>
                        <div className="p-1 break-words">{item.description}</div>
                        <div className="p-1 text-center">{item.hsnCode}</div>
                        <div className="p-1 text-center">{item.uom}</div>
                        <div className="p-1 text-right">{item.quantity}</div>
                        <div className="p-1 text-right">₹{item.unitPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        <div className="text-right p-1">₹{(item.quantity * item.unitPrice).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="grid grid-cols-2 border-t border-b border-black">
                    <div className="border-r border-black p-2 flex items-center">
                       <FormFieldPreview label="Total Amount in Words INR" value={numberToWordsINR(total)} fullWidth={true}/>
                    </div>
                    <div className="p-2 text-sm">
                        <div className="flex justify-between"><span className="font-semibold">Total Amount before Tax</span> <span>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                        <div className="flex justify-between items-center">
                            <span className="font-semibold">Add: CGST @ {invoice.cgstRate || 0}%</span>
                             <span>₹{cgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-semibold">Add: SGST @ {invoice.sgstRate || 0}%</span>
                            <span>₹{sgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-semibold">Add: IGST @ {invoice.igstRate || 0}%</span>
                            <span>₹{igstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between border-t border-gray-400 mt-1 pt-1"><span className="font-semibold">Total Tax Amount</span> <span>₹{totalTax.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                        <div className="flex justify-between font-bold border-t border-gray-400 mt-1 pt-1"><span className="font-semibold">Total Amount after Tax</span> <span>₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
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
                         <div className="text-right">For {profile.companyName}.</div>
                    </div>
                     <div className="text-right pt-24 font-bold text-xs">AUTHORISED.</div>
                </div>
            </div>
        </div>
    );
});
