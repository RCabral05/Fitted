import React, { useState } from 'react';
import './styles.css';
import { useProducts } from '../../context/ProductsContext'; // Adjust the import path as needed

export function BrandAddProducts({ initialData, store }) {
    const { addProduct } = useProducts(); // Destructure the addProduct function from the context
    const [product, setProduct] = useState(initialData || {
        title: '',
        description: '',
        status: 'available',
        images: [],
        price: '',
        sku: '',
        quantity: 0,
        vendor: '',
        collections: '',
        category: '',
        tags: []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const urls = files.map(file => URL.createObjectURL(file));
        setProduct({ ...product, images: [...product.images, ...urls] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const productWithStoreId = {
            ...product,
            storeId: store._id // Ensuring the store ID is attached to the product
        };

        try {
            await addProduct(productWithStoreId); // Using the addProduct from context
            console.log('Product added successfully');
            // You might want to reset the form or give feedback to the user here
        } catch (error) {
            console.error("Error adding product:", error);
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
              <input type="number" name="sku" value={product.sku} onChange={handleChange} required />
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
            {/* Tags and variants input fields */}
            <button type="submit">Submit</button>
      </form>
    </div>
    
  );
}
