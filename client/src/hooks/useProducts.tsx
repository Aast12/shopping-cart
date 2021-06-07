import { useEffect, useState } from 'react';
import { Product } from '../types/Product';
import axios from 'axios';
import { toBase64 } from '../utils';

const useProducts = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);
    const [products, setProducts] = useState<Product[]>([]);

    const create = (values: {
        name: string;
        price: number;
        description: string;
        image: File;
    }) => {
        const form = new FormData();
        Object.keys(values).forEach((key) => {
            // @ts-ignore
            form.append(key, values[key]);
        });

        return axios.post('http://localhost:5000/products/create', form);
    };

    const del = (id: string) => {
        axios
            .delete('http://localhost:5000/products/delete', { data: { id } })
            .then((res) => {
                setProducts(products.filter((p) => p._id !== id));
            })
            .catch(console.error);
    };

    const edit = async (values: {
        _id?: string;
        name: string;
        price: number;
        description: string;
        image: File;
    }) => {
        const form = new FormData();
        Object.keys(values).forEach((key) => {
            // @ts-ignore
            form.append(key, values[key]);
        });

        await axios
            .put('http://localhost:5000/products/update', form)
            .then(async (res) => {
                const { image, ...newValues } = values;
                let copy = [...products];
                let match = copy.find((p) => p._id === values._id);
                let imData = image ? await toBase64(image) : null;
                match = {
                    ...match,
                    ...newValues,
                };

                if (typeof imData === 'string') {
                    match.image = {
                        contentType: image.type,
                        data: imData,
                    };
                }

                setProducts(copy);
            });
    };

    useEffect(() => {
        fetch('http://localhost:5000/products')
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                setProducts(res);
            })
            .catch((err) => setError(err))
            .finally(() => setLoading(false));
    }, []);

    return { loading, products, error, create, del, edit };
};

export default useProducts;
