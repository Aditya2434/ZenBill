import React from 'react';
import { Invoice, CompanyProfile } from '../types';
import { TemplateDefault } from './templates/TemplateDefault';

interface InvoicePreviewProps {
  invoice: Invoice;
  profile: CompanyProfile;
  subtotal: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalTax: number;
  total: number;
}

export const InvoicePreview = React.forwardRef<HTMLDivElement, InvoicePreviewProps>(({ invoice, profile, ...totals }, ref) => {
    return <TemplateDefault ref={ref} invoice={invoice} profile={profile} {...totals} />;
});