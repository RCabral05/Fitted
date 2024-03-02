import React from 'react';

export function BrandDetails({ store }) {
  return (
    <div>
      {store ? (
        <>
          <h2>{store.storeName}</h2>
          <p>Email: {store.storeEmail}</p>
          <p>Number: {store.storeNumber}</p>
        </>
      ) : (
        <p>No store details available.</p>
      )}
    </div>
  );
}
