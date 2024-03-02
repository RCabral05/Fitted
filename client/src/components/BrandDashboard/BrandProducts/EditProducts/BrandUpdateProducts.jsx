import React, { useState } from 'react';
import './styles.css';
import { useProducts } from '../../../../context/ProductsContext'; // Adjust the import path as needed

export function BrandUpdateProducts({ initialData }) {
    const { updateProduct } = useProducts(); // Destructure the updateProduct function from the context

    // Define a default product structure for resetting the form
    const defaultProduct = {
        _id: '',
        title: '',
        description: '',
        status: '',
        images: [],
        price: '',
        sku: '',
        quantity: 0,
        vendor: '',
        collections: '',
        category: '',
        tags: []
    };

    const [product, setProduct] = useState(initialData || defaultProduct);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const urls = files.map(file => URL.createObjectURL(file));
        setProduct({ ...product, images: [...product.images, ...urls] });
    };

    const resetForm = () => {
        setProduct(defaultProduct);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProduct(product._id, product); // Assuming product._id is the ID of the product to be updated
            console.log('Product updated successfully');
            resetForm(); // Reset the form to its initial state
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

    return (
        <div className="brand-prod">
            <form onSubmit={handleSubmit}>
                <label>Title:
                    <input type="text" name="title" value={product.title} onChange={handleChange} required />
                </label>
                <label>Description:
                    <textarea name="description" value={product.description} onChange={handleChange} required />
                </label>
                <label>Status:
                    <select name="status" value={product.status} onChange={handleChange} required>
                        <option value="available">Available</option>
                        <option value="unavailable">Unavailable</option>
                        <option value="discontinued">Discontinued</option>
                    </select>
                </label>
                <label>Images:
                    <input type="file" multiple onChange={handleFileChange} />
                </label>
                <label>Price:
                    <input type="number" name="price" value={product.price} onChange={handleChange} required />
                </label>
                <label>Sku:
                    <input type="text" name="sku" value={product.sku} onChange={handleChange} required />
                </label>
                <label>Quantity:
                    <input type="number" name="quantity" value={product.quantity} onChange={handleChange} />
                </label>
                <label>Vendor:
                    <input type="text" name="vendor" value={product.vendor} onChange={handleChange} required />
                </label>
                <label>Collection:
                    <input type="text" name="collections" value={product.collections} onChange={handleChange} />
                </label>
                <label>Category:
                    <input type="text" name="category" value={product.category} onChange={handleChange} required />
                </label>
                {/* Additional fields for tags, variants, etc., can be added here */}
                <button type="submit">Update Product</button>
            </form>
        </div>
    );
}

