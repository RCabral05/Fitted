import React, { useEffect, useState } from 'react';
import { useProducts } from '../../context/ProductsContext'; // Adjust this import as needed
import { useParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export const ProductDetails = () => {
    const { productId } = useParams();
    const { fetchProductById } = useProducts();
    const [product, setProduct] = useState(null);
    const [productNotFound, setProductNotFound] = useState(false);
    const { addToCart } = useCart();

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const fetchedProduct = await fetchProductById(productId);
                setProduct(fetchedProduct);
            } catch (error) {
                console.error("Error fetching product:", error);
                setProductNotFound(true);
            }
        };

        if (productId) {
            loadProduct();
        }
    }, [productId, fetchProductById]);

    return (
        <div className="product-details-container">
            {product ? (
                <div>
                    <h2>{product.title}</h2>
                    <p>Description: {product.description}</p>
                    <p>Category: {product.category}</p>
                    <p>Price: ${product.price}</p>
                    <p>SKU: {product.sku}</p>
                    <p>Status: {product.status}</p>
                    <p>Quantity: {product.quantity}</p>
                    <p>Vendor: {product.vendor}</p>
                    <div>
                        Tags: {product.tags.map(tag => <span key={tag._id}>{tag.name} </span>)}
                    </div>
                    <div>
                        Variants:
                        {product.variant.map((variant, index) => (
                            <div key={variant._id}>
                                <p>Variant {index + 1}:</p>
                                <p>Name: {variant.variantName}</p>
                                <p>Price: ${variant.variantPrice}</p>
                                <p>Quantity: {variant.variantQuantity}</p>
                                <p>Image: <img src={variant.variantImage} alt={variant.variantName} style={{width: '100px'}} /></p>
                            </div>
                        ))}
                    </div>
                    <div>
                        Images: 
                        {product.images.map((image, index) => (
                            <img key={index} src={image} alt={product.title} style={{ width: '100px', margin: '10px' }} />
                        ))}
                    </div>
                    <button onClick={() => addToCart(product)}>Add to Cart</button>
                </div>
            ) : (
                productNotFound ? <p>Product not found.</p> : <p>Loading product...</p>
            )}
        </div>
    );
};

export default ProductDetails;
