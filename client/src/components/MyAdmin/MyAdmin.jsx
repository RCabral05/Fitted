import React, { useState } from "react";
import { useMyAdmin } from "../../context/MyAdminContext";

export const MyAdmin = () => {
  const [tagName, setTagName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { createTag, tags, editTag, deleteTag } = useMyAdmin();
  console.log(tags);
  const handleSubmit = async (e) => {
      e.preventDefault();
      if (!tagName) return; // simple validation
      try {
          await createTag(tagName);
          setSuccessMessage(`"${tagName}" created successfully!`);
          setTagName(''); // clear the input after submission
          setTimeout(() => setSuccessMessage(''), 3000); // hide the message after 3 seconds
      } catch (error) {
          console.error('Error creating tag:', error);
          // Optionally handle error (e.g., displaying an error message)
      }
  };

  const handleEdit = async (id, newName) => {
    await editTag(id, newName);
  };

  const handleDelete = async (id) => {
    await deleteTag(id);
  };

  return (
      <div>
          <form onSubmit={handleSubmit}>
              <input 
                  type="text" 
                  value={tagName} 
                  onChange={(e) => setTagName(e.target.value)} 
                  placeholder="Enter tag name"
              />
              <button type="submit">Add Tag</button>
          </form>
          {successMessage && <div className="success-message">{successMessage}</div>}
          <div>
            {tags.map(tag => (
              <div key={tag._id}>
                <span>{tag.name}</span>
                <input 
                  type="text"
                  defaultValue={tag.name}
                  onBlur={(e) => handleEdit(tag._id, e.target.value)} // Update on input blur
                  placeholder="Edit tag name"
                />
                <button onClick={() => handleEdit(tag._id, prompt('Edit tag name', tag.name) || tag.name)}>Edit</button>
                <button onClick={() => handleDelete(tag._id)}>Delete</button>
              </div>
            ))}
          </div>
      </div>
  );
};
