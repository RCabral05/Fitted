// ReleasingProduct.js
import React from 'react';

const ReleasingProduct = ({ product }) => {
    console.log(product);
    return product ? (
        <div>
            <h3>{product.title}</h3>
            <p>{product.description}</p>
        </div>
    ) : null;
};

export default ReleasingProduct;
