import React, { useState, useEffect } from 'react';
import './styles.css';
import { useProducts } from '../../../../context/ProductsContext';
import { useCollections } from '../../../../context/CollectionContext';
import { Tags } from './Tags/Tags';  // Adjust the import according to your file structure
import axios from 'axios';

export function BrandAddProducts({ initialData, store }) {
    const { addProduct } = useProducts();
    const [selectedTags, setSelectedTags] = useState([]);
    const { collections, fetchCollections } = useCollections();
    const [product, setProduct] = useState(initialData || {
        title: '',
        description: '',
        status: 'available',
        imageFiles: [],
        imagePreviews: [],
        price: '',
        sku: '',
        quantity: 0,
        vendor: '',
        collection: '',
        category: '',
        tags: [],
        variants: []
    });

    useEffect(() => {
        fetchCollections(store._id);
    }, [store._id, fetchCollections]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const newImageFiles = [...product.imageFiles, ...files];
        const newImagePreviews = newImageFiles.map(file => URL.createObjectURL(file));

        setProduct(prevProduct => ({
            ...prevProduct,
            imageFiles: newImageFiles,
            imagePreviews: newImagePreviews
        }));
    };

    const removeImage = (removeIndex) => {
        setProduct(prevProduct => {
            const newImageFiles = prevProduct.imageFiles.filter((_, index) => index !== removeIndex);
            const newImagePreviews = newImageFiles.map(file => URL.createObjectURL(file));

            return {
                ...prevProduct,
                imageFiles: newImageFiles,
                imagePreviews: newImagePreviews
            };
        });
    };

    useEffect(() => {
        return () => {
            product.imagePreviews.forEach(url => URL.revokeObjectURL(url));
        };
    }, [product.imagePreviews]);

    const handleVariantFileChange = (index, event) => {
        if (event.target && event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            if (file instanceof File) {
                const updatedVariants = [...product.variants];
                updatedVariants[index].variantImageFile = file;
                updatedVariants[index].variantImagePreview = URL.createObjectURL(file);
                setProduct({ ...product, variants: updatedVariants });
            } else {
                console.error("The file is not a valid type");
            }
        } else {
            console.error("No file selected or the file input is cleared");
        }
    };

    const handleVariantInputChange = (index, event) => {
        const { name, value } = event.target;
        const updatedVariants = [...product.variants];
        updatedVariants[index][name] = value;
        setProduct({ ...product, variants: updatedVariants });
    };

    const handleVariantValueChange = (variantIndex, valueIndex, value) => {
        const updatedVariants = [...product.variants];
        updatedVariants[variantIndex].variantValues[valueIndex] = value;
        setProduct({ ...product, variants: updatedVariants });
    };

    const addVariantValue = (variantIndex) => {
        const updatedVariants = [...product.variants];
        if (!updatedVariants[variantIndex].variantValues) {
            updatedVariants[variantIndex].variantValues = [];
        }
        updatedVariants[variantIndex].variantValues.push('');
        setProduct({ ...product, variants: updatedVariants });
    };

    const removeVariantValue = (variantIndex, valueIndex) => {
        const updatedVariants = [...product.variants];
        updatedVariants[variantIndex].variantValues.splice(valueIndex, 1);
        setProduct({ ...product, variants: updatedVariants });
    };

    const addVariant = () => {
        setProduct(prevProduct => ({
            ...prevProduct,
            variants: [...prevProduct.variants, {
                variantImage: [],
                variantPrice: '',
                variantCostPerItem: '',
                variantSku: '',
                variantQuantity: '',
                variantName: '',
                variantValues: []
            }]
        }));
    };

    const removeVariant = (index) => {
        setProduct(prevProduct => ({
            ...prevProduct,
            variants: prevProduct.variants.filter((_, idx) => idx !== index)
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', product.title);
        formData.append('description', product.description);
        formData.append('status', product.status);
        formData.append('price', product.price);
        formData.append('sku', product.sku);
        formData.append('quantity', product.quantity);
        formData.append('vendor', product.vendor);
        formData.append('collection', product.collection);
        formData.append('category', product.category);
        formData.append('storeId', store._id);
    
        // Stringify the array of tags
        formData.append('tags', JSON.stringify(selectedTags));

    
        product.imageFiles.forEach(file => formData.append('images', file));
        
        product.variants.forEach((variant, index) => {
            Object.keys(variant).forEach(key => {
                if (key !== 'variantImageFile' && key !== 'variantImagePreview') {
                    formData.append(`variants[${index}][${key}]`, variant[key]);
                }
            });
            
            if (variant.variantImageFile) {
                formData.append(`variantImages`, variant.variantImageFile);
            }
        });
    
        try {
            await addProduct(formData);
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
              <Tags selectedTags={selectedTags} setSelectedTags={setSelectedTags}/>
            {/* Tags and variants input fields */}
            {product.variants.map((variant, index) => (
                <div key={index} className="variant-section">
                    <label>Variant Name:
                        <select
                            name="variantName"
                            value={variant.variantName}
                            onChange={(e) => handleVariantInputChange(index, e)}
                        >
                            <option value="">Select Variant</option>
                            <option value="Color">Color</option>
                            <option value="Size">Size</option>
                            <option value="Material">Material</option>
                            <option value="Style">Style</option>
                        </select>
                    </label>

                    
                    <label>Variant Price:
                        <input
                            type="number"
                            name="variantPrice"
                            value={variant.variantPrice}
                            onChange={(e) => handleVariantInputChange(index, e)}
                        />
                    </label>
                    <label>Variant Compare At Price:
                        <input
                            type="number"
                            name="variantCompareAtPrice"
                            value={variant.variantCompareAtPrice}
                            onChange={(e) => handleVariantInputChange(index, e)}
                        />
                    </label>
                    <label>Variant Cost Per Item:
                        <input
                            type="number"
                            name="variantCostPerItem"
                            value={variant.variantCostPerItem}
                            onChange={(e) => handleVariantInputChange(index, e)}
                        />
                    </label>
                    <label>Variant SKU:
                        <input
                            type="text"
                            name="variantSku"
                            value={variant.variantSku}
                            onChange={(e) => handleVariantInputChange(index, e)}
                        />
                    </label>
                    <label>Variant Quantity:
                        <input
                            type="number"
                            name="variantQuantity"
                            value={variant.variantQuantity}
                            onChange={(e) => handleVariantInputChange(index, e)}
                        />
                    </label>
                    <label>Variant Image:
                        <input
                            type="file"
                            onChange={(e) => handleVariantFileChange(index, e)}
                        />
                        {/* {variant.variantImagePreview && (
                            <img src={variant.variantImagePreview} alt="Variant Preview" style={{ width: '100px', height: 'auto' }} />
                        )} */}
                    </label>

                    {/* Include input fields for variantValues if necessary */}
                   {product.variants.map((variant, index) => (
                    <div key={index} className="variant-section">
                        {/* Existing variant inputs */}
                        <label>Variant Values:</label>
                        {variant.variantValues.map((value, vIndex) => (
                            <div key={vIndex}>
                                <input
                                    type="text"
                                    value={value}
                                    onChange={(e) => handleVariantValueChange(index, vIndex, e.target.value)}
                                />
                                <button type="button" onClick={() => removeVariantValue(index, vIndex)}>Remove Value</button>
                            </div>
                        ))}
                        <button type="button" onClick={() => addVariantValue(index)}>Add Value</button>
                        <button type="button" onClick={() => removeVariant(index)}>Remove Variant</button>
                    </div>
                ))}
                </div>
                
            ))}
            <button type="button" onClick={addVariant}>Add Variant</button>

            <button type="submit">Submit</button>
        </form>
    </div>
    
  );
}
