import React, { useState, useEffect } from 'react';
import './styles.css';
import { useProducts } from '../../../../context/ProductsContext'; // Adjust the import path as needed
import { useCollections } from '../../../../context/CollectionContext';

export function BrandAddProducts({ initialData, store }) {
    const { addProduct } = useProducts();
    const { collections, fetchCollections } = useCollections();
    const [product, setProduct] = useState(initialData || {
        title: '',
        description: '',
        status: 'available',
        images: [],
        price: '',
        sku: '',
        quantity: 0,
        vendor: '',
        collection: '',
        category: '',
        tags: []
    });

    useEffect(() => {
        fetchCollections(store._id); // Fetch collections when the component mounts or the store changes
    }, [store._id, fetchCollections]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const newImageUrls = files.map(file => URL.createObjectURL(file));
        setProduct(prevProduct => ({
            ...prevProduct,
            images: [...prevProduct.images, ...newImageUrls]
        }));
    };

    const removeImage = (removeIndex) => {
        setProduct(prevProduct => ({
            ...prevProduct,
            images: prevProduct.images.filter((_, index) => index !== removeIndex)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const productWithStoreId = {
            ...product,
            storeId: store._id
        };

        try {
            await addProduct(productWithStoreId);
            console.log('Product added successfully');
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
            <label>Images:</label>
                <div className="image-upload-container">
                    {product.images.map((image, index) => (
                        <div key={index} className="image-preview">
                            <img src={image} alt="Preview" />
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
            <label>Quantity:
                <input type="number" name="quantity" value={product.quantity} onChange={handleChange} />
            </label>
            <label>Vendor:
                <input type="text" name="vendor" value={product.vendor} onChange={handleChange} required />
            </label>
            <label>Collection:
                    <select 
                        name="collection" 
                        value={product.collection} 
                        onChange={handleChange}
                        required
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
            {/* Tags and variants input fields */}
            <button type="submit">Submit</button>
        </form>
    </div>
    
  );
}
