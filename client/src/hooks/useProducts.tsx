import { useEffect, useState } from 'react';
import { Product } from '../types/Products';
import axios from 'axios';

const toBase64 = (file: File) =>
    new Promise(
        (resolve: (value: string | ArrayBuffer | null) => void, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        }
    );

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
                console.log(res);
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
                console.log(res);
                return res.json();
            })
            .then((res) => {
                console.log(res);
                setProducts(res);
            })
            .catch((err) => setError(err))
            .finally(() => setLoading(false));
    }, []);

    return { loading, products, error, create, del, edit };
};

export default useProducts;