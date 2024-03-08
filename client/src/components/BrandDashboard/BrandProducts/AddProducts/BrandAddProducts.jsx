import React, { useState, useEffect } from 'react';
import './styles.css';
import { useProducts } from '../../../../context/ProductsContext';
import { useCollections } from '../../../../context/CollectionContext';
import { Tags } from './Tags/Tags';  // Adjust the import according to your file structure
import axios from 'axios';
import { Variants } from './Variants';
import { ProductForm } from './ProductForm';

export function BrandAddProducts({ initialData, store }) {
    const [options, setOptions] = useState([]);
    const [variantCombinations, setVariantCombinations] = useState([]);

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

    // VARIANTS ============================================================================================================

    const handleVariantFileChange = (index, event) => {
        if (event.target && event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            if (file instanceof File) {
                setVariantCombinations(variantCombinations => {
                    // Clone the array to avoid direct state mutation
                    const updatedVariants = [...variantCombinations];
                    // Check if the variant exists, and if not, initialize a new object
                    if (!updatedVariants[index]) {
                        updatedVariants[index] = {};
                    }
                    updatedVariants[index].variantImageFile = file;
                    updatedVariants[index].variantImagePreview = URL.createObjectURL(file);
                    return updatedVariants;
                });
            } else {
                console.error("The file is not a valid type");
            }
        } else {
            console.error("No file selected or the file input is cleared");
        }
    };
    

    const handleVariantInputChange = (index, event) => {
        const { name, value } = event.target;
    
        // Copy the current state to a new array
        const updatedVariantCombinations = [...variantCombinations];
    
        // Check if the variant object exists and has the property
        if (updatedVariantCombinations[index] && updatedVariantCombinations[index].hasOwnProperty(name)) {
            // Update the property value
            updatedVariantCombinations[index][name] = value;
    
            // Update the state with the new array
            setVariantCombinations(updatedVariantCombinations);
        } else {
            console.error(`Variant at index ${index} does not exist or does not have property ${name}`);
        }
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

    // SUBMIT ============================================================================================================
    
    
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
    
        // Append the main product images
        product.imageFiles.forEach(file => formData.append('images', file));
    
        // Append variant information
        variantCombinations.forEach((variant, index) => {
            Object.entries(variant).forEach(([key, value]) => {
                if (key !== 'variantImageFile' && key !== 'variantImagePreview') {
                    formData.append(`variants[${index}][${key}]`, value);
                }
            });
            
            if (variant.variantImageFile) {
                formData.append('variantImages', variant.variantImageFile);
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
            <div className="brand-form">
                <ProductForm
                    product={product}
                    handleChange={handleChange}
                    handleFileChange={handleFileChange}
                    removeImage={removeImage}
                    collections={collections}
                />
            </div>
           <div className="brand-form">
                <Tags selectedTags={selectedTags} setSelectedTags={setSelectedTags}/>
           </div>
            {/* Tags and variants input fields */}
            <Variants
               options={options}
               setOptions={setOptions}
               variantCombinations={variantCombinations}
               setVariantCombinations={setVariantCombinations}
               handleVariantInputChange={handleVariantInputChange}
               handleVariantFileChange={handleVariantFileChange}
            />
            <button type="submit">Submit</button>
        </form>
    </div>
    
  );
}
