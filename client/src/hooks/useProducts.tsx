import { useEffect, useState } from 'react';
import { Product } from '../types/Product';
import axios from 'axios';
import { toBase64 } from '../utils';

export type ProductPostPayload = Omit<
    Product,
    'image' | 'views' | 'lastView'
> & { image?: File };

const useProducts = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);
    const [products, setProducts] = useState<Product[]>([]);

    const create = (values: Omit<ProductPostPayload, '_id'>) => {
        const form = new FormData();
        Object.keys(values).forEach((key) => {
            // @ts-ignore
            form.append(key, values[key]);
        });

        return axios.post('/products/create', form);
    };

    const del = (id: string) => {
        axios
            .delete(`/products/${id}`)
            .then((res) => {
                setProducts(products.filter((p) => p._id !== id));
            })
            .catch(console.error);
    };

    const edit = async (values: ProductPostPayload) => {
        const form = new FormData();
        const { _id, ...data } = values;
        Object.keys(data).forEach((key) => {
            // @ts-ignore
            form.append(key, data[key]);
        });

        await axios.put(`/products/${_id}`, form).then(async (res) => {
            const { image, ...newValues } = data;
            let copy = [...products];
            let match = copy.find((p) => p._id === _id);
            let imData = image ? await toBase64(image) : null;
            match = {
                ...match,
                ...newValues,
                _id,
            };

            if (image && typeof imData === 'string') {
                match.image = {
                    contentType: image.type,
                    data: imData,
                };
            }

            setProducts(copy);
        });
    };

    useEffect(() => {
        fetch('/products')
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
