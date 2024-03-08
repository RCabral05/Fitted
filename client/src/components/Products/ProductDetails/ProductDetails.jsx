import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../../../context/ProductsContext';
import { useCart } from '../../../context/CartContext';
import './styles.css';

export const ProductDetails = () => {
    const { productId } = useParams();
    const { fetchProductById } = useProducts();
    const [product, setProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [productNotFound, setProductNotFound] = useState(false);
    const { addToCart } = useCart();

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const fetchedProduct = await fetchProductById(productId);
                setProduct(fetchedProduct);
                setSelectedVariant(fetchedProduct?.variant[0] || null);
            } catch (error) {
                console.error("Error fetching product:", error);
                setProductNotFound(true);
            }
        };

        if (productId) {
            loadProduct();
        }
    }, [productId, fetchProductById]);

    const handleVariantClick = (variant) => {
        setSelectedVariant(variant);
    };

    return (
        <div className="product-details-container">
            {product ? (
                <div>
                    <div className="product-slider">
                        {product.images.map((image, index) => (
                            <img key={index} src={image} alt={product.title} className="product-image" />
                        ))}
                    </div>
                    <div className="product-info">
                        <h2>{product.title}</h2>
                        <p>{product.category} / {product.tags.map(tag => tag.name).join(' / ')}</p>
                        <p>Description: {product.description}</p>
                        <p>SKU: {selectedVariant ? selectedVariant.variantSku : product.sku}</p>
                        <p>Price: ${selectedVariant ? selectedVariant.variantPrice : product.price}</p>
                        <p>Quantity: {selectedVariant ? selectedVariant.variantQuantity : product.quantity}</p>
                        <p>Vendor: {product.vendor}</p>
                        <div className="product-tags">
                            Tags: {product.tags.map(tag => <span key={tag._id} className="product-tag">{tag.name}</span>)}
                        </div>
                        <div className="product-variants">
                            <h3>Variants:</h3>
                            {product.variant.map((variant, index) => (
                                <button key={variant._id} 
                                        className="variant-button"
                                        onClick={() => handleVariantClick(variant)}>
                                    Variant {index + 1}
                                </button>
                            ))}
                        </div>
                        <button onClick={() => addToCart(selectedVariant || product)}>Add to Cart</button>
                    </div>
                    {selectedVariant && (
                        <img src={selectedVariant.variantImage} alt="Selected Variant" className="selected-variant-image" />
                    )}
                </div>
            ) : (
                productNotFound ? <p>Product not found.</p> : <p>Loading product...</p>
            )}
        </div>
    );
};

export default ProductDetails;
