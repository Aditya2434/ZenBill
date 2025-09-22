import { useState, useCallback } from 'react';
import { CompanyProfile } from '../types';

const initialProfile: CompanyProfile = {
    companyName: '(COMPANY NAME)',
    companyAddress: '(COMPANY ADDRESS)',
    gstin: 'YOURGSTIN',
    pan: 'YOURPAN',
    companyAcronym: 'CN',
    logo: '',
    companySeal: '',
    authorizedSignature: '',
    defaultBankDetails: {
        accountName: 'Your Company Inc.',
        accountNumber: '1234567890',
        bankName: 'Global Bank',
        branch: 'Main Street Branch',
        ifsc: 'GBIN0001234',
    },
};

export const useProfile = () => {
    const [profile, setProfile] = useState<CompanyProfile>(initialProfile);

    const updateProfile = useCallback((newProfile: CompanyProfile) => {
        setProfile(newProfile);
    }, []);

    return { profile, updateProfile };
};