import React, { useState } from 'react';
import './styles.css';
import axios from 'axios';

export function BrandAddProducts({ onSubmit, initialData, store }) {
  const [product, setProduct] = useState(initialData || {
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
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleFileChange = (e) => {
    // Assuming you want to store only the file URLs in the database
    // Convert files to URLs and update the state
    const files = Array.from(e.target.files);
    const urls = files.map(file => URL.createObjectURL(file));
    setProduct({ ...product, images: [...product.images, ...urls] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productWithStoreId = {
        ...product,
        storeId: store[0]._id // Assuming you want to use the first store's ID
    };
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}add-product`, productWithStoreId);
        console.log(response.data);
        // onSubmit(product); // You can still call the provided onSubmit prop if needed
    } catch (error) {
        console.error("Error adding product:", error.response.data);
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
