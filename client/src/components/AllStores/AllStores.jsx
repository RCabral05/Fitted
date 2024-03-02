import React, { useContext } from 'react';
// Removed axios import since we are now using context
// import './styles.css'; // Uncomment if you are using CSS
import { useStores } from '../../context/StoreContext'; // Adjust the import path as needed

export const AllStores = () => {
  const { stores } = useStores(); // Use the stores from the context

  console.log('Stores:', stores);

  return (
    <div className="stores">
      {stores.length > 0 ? (
        stores.map(store => (
          <div key={store._id} className="store">
            <h3>{store.storeName}</h3>
            <p>{store.storeEmail}</p>
          </div>
        ))
      ) : (
        <p>No stores found.</p>
      )}
    </div>
  );
};
