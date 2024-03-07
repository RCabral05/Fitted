import React, { useState, useEffect } from 'react';
import './styles.css';


export function Variants({ variants, handleVariantInputChange, handleVariantFileChange, handleVariantValueChange, addVariantValue, removeVariantValue, removeVariant, addVariant }) {

  return (
    <>
            {variants.map((variant, index) => (
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
                   {variants.map((variant, index) => (
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

    </>
  );
}
