import React, { useEffect, useState } from 'react';
import { useCollections } from '../../../context/CollectionContext';
import { useProducts } from '../../../context/ProductsContext';

export function BrandCollections({ store }) {
  const { createCollection } = useCollections();
  const { products, fetchProductsForStore } = useProducts();
  const [collectionData, setCollectionData] = useState({
    collectionName: '',
    collectionDescription: '',
    collectionImage: null,
    storeId: store?._id,
  });
  const [selectedProductIds, setSelectedProductIds] = useState([]);

  useEffect(() => {
    if (store?._id) {
      fetchProductsForStore(store._id);
    }
  }, [store?._id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCollectionData(prev => ({ ...prev, [name]: name === 'collectionImage' ? e.target.files[0] : value }));
  };

  const handleCheckboxChange = (productId) => {
    setSelectedProductIds(prevSelectedProductIds =>
      prevSelectedProductIds.includes(productId)
        ? prevSelectedProductIds.filter(id => id !== productId)
        : [...prevSelectedProductIds, productId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('collectionName', collectionData.collectionName);
    formData.append('collectionDescription', collectionData.collectionDescription);
    formData.append('storeId', collectionData.storeId);
    selectedProductIds.forEach(id => formData.append('productIds', id));

    if (collectionData.collectionImage) {
      formData.append('collectionImage', collectionData.collectionImage);
    }

    try {
      await createCollection(formData);
      alert('Collection created successfully!');
      setCollectionData({
        collectionName: '',
        collectionDescription: '',
        collectionImage: null,
        storeId: store?._id,
      });
      setSelectedProductIds([]);
    } catch (error) {
      console.error('Error creating collection:', error);
      alert('Failed to create the collection.');
    }
  };

  return (
    <div>
      <h1>Create New Collection</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>
          Collection Name:
          <input
            type="text"
            name="collectionName"
            value={collectionData.collectionName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Description:
          <textarea
            name="collectionDescription"
            value={collectionData.collectionDescription}
            onChange={handleChange}
          />
        </label>
        <label>
          Collection Image:
          <input
            type="file"
            name="collectionImage"
            onChange={handleChange}
            required
          />
        </label>
        <div>
          <strong>Select Products:</strong>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {products.map(product => (
              <label key={product._id}>
                <input
                  type="checkbox"
                  value={product._id}
                  checked={selectedProductIds.includes(product._id)}
                  onChange={() => handleCheckboxChange(product._id)}
                />
                {product.title}
              </label>
            ))}
          </div>
        </div>
        <button type="submit">Create Collection</button>
      </form>

      <h2>Products</h2>
      <ul>
        {products.map(product => (
          <li key={product._id}>{product.title}</li>
        ))}
      </ul>
    </div>
  );
}
