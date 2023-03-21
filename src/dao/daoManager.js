export const getProductsManager = async () => {
    const productModel = process.env.SELECTEDDB === 1 ? 
    await import ('./MongoDB/Models/Product') 
    : 
    await import ('./PostgreSql/Models/Product');
    return productModel;
};

export const getMessagesManager = async () => {
    const messageModel = process.env.SELECTEDDB === 1 ? 
    await import ('./MongoDB/Models/Message') 
    : 
    await import ('./PostgreSql/Models/Message');
    return messageModel;
};