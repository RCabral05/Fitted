import React from 'react';

export function BrandDetails(store) {
  console.log(store.store[0]);
  const allStores = store.store;

  return (
    <div>
      {allStores.length > 0 ? (
        <ul>
          {allStores.map((store, index) => (
            <li key={index}>
              <h2>{store.storeName}</h2>
              <p>Email: {store.storeEmail}</p>
              <p>Number: {store.storeNumber}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No stores found.</p>
      )}
    </div>
  );
}
