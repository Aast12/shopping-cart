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

    const create = async (values: Omit<ProductPostPayload, '_id'>) => {
        const form = new FormData();
        Object.keys(values).forEach((key) => {
            // @ts-ignore
            form.append(key, values[key]);
        });

        await axios.post('/products/create', form).then(async (res) => {
            const { image, ...createData } = values;
            const { id } = res.data;
            if (id) {
                const newProduct: Product = { ...createData, _id: res.data.id };
                if (image) {
                    let imData = image ? await toBase64(image) : null;

                    if (image && typeof imData === 'string') {
                        newProduct.image = {
                            contentType: image.type,
                            data: imData,
                        };
                    }
                }

                setProducts([...products, newProduct]);
            }
        });
    };

    const del = async (id: string) => {
        await axios.delete(`/products/${id}`).then((res) => {
            setProducts(products.filter((p) => p._id !== id));
        });
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
            let matchIdx = copy.findIndex((p) => p._id === _id);
            let imData = image ? await toBase64(image) : null;
            copy[matchIdx] = {
                ...copy[matchIdx],
                ...newValues,
                _id,
            };

            if (image && typeof imData === 'string') {
                copy[matchIdx].image = {
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
