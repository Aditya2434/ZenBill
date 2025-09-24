import { useState, useCallback } from 'react';
import { Product } from '../types';

const initialProducts: Product[] = [
    { id: 'prod-1', name: 'Web Development Services', hsnCode: '998314', uom: 'hrs' },
    { id: 'prod-2', name: 'Graphic Design Package', hsnCode: '998313', uom: 'pkg' },
    { id: 'prod-3', name: 'T-Shirt (Cotton)', hsnCode: '610910', uom: 'pcs' },
];

export const useProducts = () => {
    const [products, setProducts] = useState<Product[]>(initialProducts);

    const addProduct = useCallback((product: Omit<Product, 'id'>) => {
        const newProduct: Product = {
            ...product,
            id: `prod-${new Date().getTime()}`,
        };
        setProducts(currentProducts => [newProduct, ...currentProducts].sort((a,b) => a.name.localeCompare(b.name)));
    }, []);

    const updateProduct = useCallback((updatedProduct: Product) => {
        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p).sort((a,b) => a.name.localeCompare(b.name)));
    }, []);

    const deleteProduct = useCallback((productId: string) => {
        setProducts(prev => prev.filter(p => p.id !== productId));
    }, []);

    return { products, addProduct, updateProduct, deleteProduct };
};