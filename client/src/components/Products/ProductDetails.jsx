import React, { useEffect, useState, useContext } from 'react';
// import './styles.css';
import { useCart } from '../../context/CartContext';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export const ProductDetails = () => {
    const { productId } = useParams();
    console.log('details id', productId);
    const [product, setProduct] = useState(null);
    const [productNotFound, setProductNotFound] = useState(false);
    console.log('prod', product);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!productId) {
                console.error("Product ID is undefined.");
                setProductNotFound(true);
                return;
            }

            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}api/products/${productId}`);
                // console.log(response);
                if (response.data) {
                    setProduct(response.data);
                
                } else {
                    setProductNotFound(true);
                }
            } catch (error) {
                console.error("Error fetching product:", error);
                setProductNotFound(true);
            }
        };

        fetchProduct();

    }, [productId]);

    return (
        <div className="product-details-container">
            <li>{product?.title}</li>
        </div>
    );
};

export default ProductDetails;
