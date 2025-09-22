import React from 'react';
import { Invoice, CompanyProfile } from '../types';
import { TemplateDefault } from './templates/TemplateDefault';

interface InvoicePreviewProps {
  invoice: Invoice;
  profile: CompanyProfile;
}

export const InvoicePreview = React.forwardRef<HTMLDivElement, InvoicePreviewProps>(({ invoice, profile }, ref) => {
    return <TemplateDefault ref={ref} invoice={invoice} profile={profile} />;
});