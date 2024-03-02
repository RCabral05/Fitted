import React, { useContext, useEffect, useState } from 'react';
import { BrandDetails } from './BrandDetails/BrandDetails';
import { BrandProducts } from './BrandProducts/Products/BrandProducts';
import { AuthContext } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductsContext';
import { useStores } from '../../context/StoreContext'; // Import useStores from StoreContext

export function BrandDashboard() {
  const { user } = useContext(AuthContext);
  const { products, fetchProductsForStore } = useProducts();
  const { stores } = useStores(); // Use stores from StoreContext
  const [currentStore, setCurrentStore] = useState(null);
  const [activeView, setActiveView] = useState('details');
  // Fetch the store corresponding to the current user
  useEffect(() => {
    if (user && stores.length > 0) {
      const storeMatch = stores.find(store => store.discordId === user.id);
      setCurrentStore(storeMatch);
      if (storeMatch) {
        fetchProductsForStore(storeMatch._id);
      }
    }
  }, [user, stores, fetchProductsForStore]);

  const setActiveViewToDetails = () => setActiveView('details');
  const setActiveViewToProducts = () => setActiveView('products');

  return (
    <div>
      <button onClick={setActiveViewToDetails}>Details</button>
      <button onClick={setActiveViewToProducts}>Products</button>

      {activeView === 'details' && <BrandDetails store={currentStore} />}
      {activeView === 'products' && <BrandProducts products={products} store={currentStore} />}
    </div>
  );
}
