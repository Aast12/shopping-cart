
export type Order = {
    _id?: string;
    products: {
        product: string;
        quantity: number;
        unitPrice: number;
    }[];
    total: number;
    date: Date;
}

export type User = {
    _id: string;
    givenName: string;
    lastName: string;
    dateOfBirth?: Date;
    email: string;
    // password: string;
    profilePicture?: {
        data: Buffer;
        contentType: string;
    };
    orders?: Order[];
}
