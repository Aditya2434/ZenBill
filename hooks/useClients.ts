import { useState, useCallback } from 'react';
import { Client } from '../types';

const initialClients: Client[] = [
    { id: 'client-1', name: 'Tech Solutions Inc.', email: 'contact@techsolutions.com', address: '123 Tech Park\nSilicon Valley, CA 94000\nUSA', gstin: '29ABCDE1234F1Z5', state: 'California', stateCode: 'CA' },
    { id: 'client-2', name: 'Creative Designs Co.', email: 'hello@creativedesigns.co', address: '456 Art Avenue\nDesign District, NY 10001\nUSA', gstin: '36FGHIJ5678K1Z4', state: 'New York', stateCode: 'NY' },
];

export const useClients = () => {
    const [clients, setClients] = useState<Client[]>(initialClients);

    const addClient = useCallback((client: Omit<Client, 'id' | 'email'>) => {
        const newClient: Client = {
            ...client,
            id: `client-${new Date().getTime()}`,
            email: '', // Not in the form, so default to empty
        };
        setClients(currentClients => [newClient, ...currentClients].sort((a,b) => a.name.localeCompare(b.name)));
    }, []);

    const updateClient = useCallback((updatedClient: Client) => {
        setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c).sort((a,b) => a.name.localeCompare(b.name)));
    }, []);

    const deleteClient = useCallback((clientId: string) => {
        setClients(prev => prev.filter(c => c.id !== clientId));
    }, []);

    return { clients, addClient, updateClient, deleteClient };
};
