import React, { useState } from 'react';
import { useProducts } from '../../context/ProductsContext'; // Adjust the import path as necessary
import ReleasingProduct from './ReleasingProduct/ReleasingProduct'; // Adjust the import path as necessary

export const ReleaseCalendar = () => {
    const { products } = useProducts();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [viewSelectedProduct, setViewSelectedProduct] = useState(false);

    const scheduledProducts = products.filter(product => product.status === 'scheduled')
                                      .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));

    const parseDate = dateString => {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date) 
               ? date.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }) 
               : "Invalid date";
    };

    const handleProductClick = product => {
        setSelectedProduct(product);
        setViewSelectedProduct(true); // Switch to viewing the selected product
    };

    const goBackToCalendar = () => {
        setViewSelectedProduct(false); // Switch back to viewing the calendar
    };

    return (
        <div className="calendar">
            <h2>Scheduled Releases</h2>
            {viewSelectedProduct ? (
                <>
                    <button onClick={goBackToCalendar}>Back to Calendar</button>
                    <ReleasingProduct product={selectedProduct} />
                </>
            ) : (
                scheduledProducts.length > 0 ? (
                    <ul>
                        {scheduledProducts.map(product => (
                            <li key={product._id} onClick={() => handleProductClick(product)}>
                                <h3>{product.title}</h3>
                                <p>Release Date: {parseDate(product.scheduledDate)}</p>
                                <p>{product.description}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No scheduled products.</p>
                )
            )}
        </div>
    );
};
