import React, { useState } from 'react';
import { useProducts } from '../../context/ProductsContext'; // Adjust the import path as necessary
import ReleasingProduct from './ReleasingProduct/ReleasingProduct'; // Adjust the import path as necessary

export const ReleaseCalendar = () => {
    const { products } = useProducts();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [viewSelectedProduct, setViewSelectedProduct] = useState(false);

    const groupProductsByMonth = (products) => {
        const grouped = {};
        
        products.forEach(product => {
            const date = new Date(product.scheduledDate);
            const monthYearKey = date.toLocaleString('en-US', { year: 'numeric', month: 'long' });
        
            if (!grouped[monthYearKey]) {
            grouped[monthYearKey] = [];
            }
        
            grouped[monthYearKey].push(product);
        });
        
        return grouped;
    };
      
    const scheduledProducts = products.filter(product => product.status === 'scheduled')
                                      .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));
    const productsGroupedByMonth = groupProductsByMonth(scheduledProducts);

    const parseDate = dateString => {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date) 
               ? date.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }) 
               : "Invalid date";
    };

    const handleProductClick = product => {
        setSelectedProduct(product);
        setViewSelectedProduct(true);
    };

    const goBackToCalendar = () => {
        setViewSelectedProduct(false);
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
                Object.keys(productsGroupedByMonth).length > 0 ? (
                    Object.entries(productsGroupedByMonth).map(([month, products]) => (
                        <div key={month}>
                            <h3>{month}</h3>
                            <ul>
                                {products.map(product => (
                                    <li key={product._id} onClick={() => handleProductClick(product)}>
                                        <h4>{product.title}</h4>
                                        <p>Release Date: {parseDate(product.scheduledDate)}</p>
                                        <p>{product.description}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))
                ) : (
                    <p>No scheduled products.</p>
                )
            )}
        </div>
    );
};
