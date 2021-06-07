export type Product = {
    _id?: string;
    name: string;
    price: number;
    description?: string;
    image?: {
        contentType: string;
        data: string;
    };
    brand?: string;
    stock?: number;
    views?: number;
    lastView?: string;
};
