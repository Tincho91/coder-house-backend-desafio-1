export const getProductsManager = async () => {
    const productModel = process.env.SELECTEDDB === 1 ? 
    await import ('./MongoDB/Models/Product.js') 
    : 
    await import ('./PostgreSql/Models/Product.js');
    return productModel;
};

export const getMessagesManager = async () => {
    const messageModel = process.env.SELECTEDDB === 1 ? 
    await import ('./MongoDB/Models/Message.js') 
    : 
    await import ('./PostgreSql/Models/Message.js');
    return messageModel;
};

export const getUsersManager = async () => {
    const modelUser = process.env.SELECTEDDB == 1 ? 
    await import ('./MongoDB/Models/User.js') 
    :
    await import ('./Postgresql/models/User.js')
    return modelUser
}

export const getCartsManager = async () => {
    const modelCart = process.env.SELECTEDDB == 1 ?
    await import ('./MongoDB/Models/Cart.js') 
    :
    await import ('./Postgresql/models/Cart.js')
    return modelCart
}