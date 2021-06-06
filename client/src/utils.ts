export const objToFormData = (values: any) => {
    const form = new FormData();
    Object.keys(values).forEach((key) => {
        // @ts-ignore
        form.append(key, values[key]);
    });

    return form;
};
