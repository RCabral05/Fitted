// ProductDetails.js

import React from 'react';

export function ProductForm({ product, handleChange, handleFileChange, removeImage, collections }) {
  return (
    <div className='product-upper'>
      <label>Title:
          <input type="text" name="title" value={product.title} onChange={handleChange} required />
      </label>
      <label>Description:
          <textarea name="description" value={product.description} onChange={handleChange} required />
      </label>
      <label>Status:
            <select name="status" value={product.status} onChange={handleChange} required>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
            </select>
        </label>
        {product.status === 'scheduled' && (
            <label>Schedule Date:
                <input
                    type="datetime-local"
                    name="scheduledDate"
                    value={product.scheduledDate}
                    onChange={handleChange}
                    required={product.status === 'scheduled'}
                />
            </label>
        )}

      <label>Images:</label>
      <div className="image-upload-container">
          {product.imagePreviews.map((imageUrl, index) => (
              <div key={index} className="image-preview">
                  <img src={imageUrl} alt="Preview" />
                  <button type="button" onClick={() => removeImage(index)}>Remove</button>
              </div>
          ))}
          <input type="file" multiple onChange={handleFileChange} />
      </div>
      <label>Price:
          <input type="number" name="price" value={product.price} onChange={handleChange} required />
      </label>
      <label>Sku:
          <input type="number" name="sku" value={product.sku} onChange={handleChange} required />
      </label>
      <label>Vendor:
          <input type="text" name="vendor" value={product.vendor} onChange={handleChange} required />
      </label>
      <label>Collection:
          <select 
              name="collection" 
              value={product.collection} 
              onChange={handleChange}
          >
              <option value="">Select a Collection</option>
              {collections.map((collection, index) => (
                  <option key={index} value={collection._id}>
                      {collection.collectionName}
                  </option>
              ))}
          </select>
      </label>
      <label>Category:
          <select 
              name="category" 
              value={product.category} 
              onChange={handleChange} 
              required
          >
              <option value="">Select a Category</option>
              <option value="mens">Men's</option>
              <option value="womens">Women's</option>
              <option value="kids">Kids</option>
          </select>
      </label>
    </ div>
  );
}
