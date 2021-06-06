export const objToFormData = (values: any) => {
    const form = new FormData();
    Object.keys(values).forEach((key) => {
        // @ts-ignore
        form.append(key, values[key]);
    });

    return form;
};

export const toBase64 = (file: File) =>
    new Promise(
        (resolve: (value: string | ArrayBuffer | null) => void, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        }
    );
