import productModel from '../models/Product';

const getAllServices = () => {
    return new Promise(async (resolve, reject) => {
        productModel.find({}).exec(function (err, obj) {
            if (err) reject(err);

            resolve(
                obj
                    .map((p) => p.toObject())
                    .map((product) => ({
                        ...product,
                        image: product?.image?.data
                            ? {
                                  contentType: product.image.contentType,
                                  data: product.image.data.toString(), // 'base64'
                              }
                            : null,
                    }))
            );
        });
    });
};

export { getAllServices };
