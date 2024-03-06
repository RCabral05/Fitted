import React, { useState } from "react";
import { useProducts } from "../../context/ProductsContext";

export const MyAdmin = () => {
  const [tagName, setTagName] = useState('');
  const { createTag } = useProducts();

  const handleSubmit = async (e) => {
      e.preventDefault();
      if (!tagName) return; // simple validation
      await createTag(tagName);
      setTagName(''); // clear the input after submission
  };

  return (
      <form onSubmit={handleSubmit}>
          <input 
              type="text" 
              value={tagName} 
              onChange={(e) => setTagName(e.target.value)} 
              placeholder="Enter tag name"
          />
          <button type="submit">Add Tag</button>
      </form>
  );
};

