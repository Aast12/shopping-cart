export type Order = {
    _id?: string;
    products: {
        product: string;
        quantity: number;
        unitPrice: number;
    }[];
    total: number;
    date: string;
};

export type User = {
    _id: string;
    givenName: string;
    lastName: string;
    dateOfBirth?: string;
    email: string;
    // password: string;
    profilePicture?:
        | {
              data: Buffer;
              contentType: string;
          }
        | string;
    orders?: Order[];
    role: 'admin' | 'user';
    createdAt: string;
    updatedAt: string;
};
