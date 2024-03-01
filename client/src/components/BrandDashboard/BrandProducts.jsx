import React, { useState } from 'react';
import './styles.css';

export function BrandProducts({ onSubmit, initialData }) {
  const [product, setProduct] = useState(initialData || {
    title: '',
    description: '',
    status: '',
    images: [],
    price: '',
    quantity: 0,
    vendor: '',
    collection: '',
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(product);
    // onSubmit(product); // Uncomment this to call the provided onSubmit function
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
            <label>Quantity:
              <input type="number" name="quantity" value={product.quantity} onChange={handleChange} />
            </label>
            <label>Vendor:
              <input type="text" name="vendor" value={product.vendor} onChange={handleChange} required />
            </label>
            <label>Collection:
              <input type="text" name="collection" value={product.collection} onChange={handleChange} />
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
