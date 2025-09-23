import { useState, useCallback } from 'react';
import { CompanyProfile } from '../types';

const initialProfile: CompanyProfile = {
    companyName: 'Your Company Name',
    companyAddress: '',
    gstin: '',
    pan: '',
    companyAcronym: '',
    logo: '',
    companySeal: '',
    authorizedSignature: '',
    defaultBankDetails: {
        accountName: '',
        accountNumber: '',
        bankName: '',
        branch: '',
        ifsc: '',
    },
};

export const useProfile = () => {
    const [profile, setProfile] = useState<CompanyProfile>(initialProfile);

    const updateProfile = useCallback((newProfile: CompanyProfile) => {
        setProfile(newProfile);
    }, []);

    return { profile, updateProfile };
};