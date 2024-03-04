import React from 'react';
import { useCart } from '../../../context/CartContext'; // Adjust path as necessary
import './styles.css'; // Ensure you have a CSS file with the necessary styles
import TrashIcon from '@mui/icons-material/DeleteOutline';

const CartItem = ({ item }) => {
    const { updateQuantity, removeFromCart } = useCart();
    const DEFAULT_IMAGE_URL = "https://divtech-project.s3.us-east-2.amazonaws.com/images/default_prod.png";
    console.log('item', item);

    // let price = item.selectedVariant && item.selectedVariant.title !== 'Default Title' 
    //             ? item.selectedVariant.price 
    //             : item.variants[0].price;

    // price = Number(price);

    // const displayPrice = isNaN(price) ? 'N/A' : price.toFixed(2);

    // const totalItemPrice = displayPrice * item.quantity;

    // const variantImage = item.images && item.selectedVariant && item.selectedVariant.image_id
    //                     ? item.images.find(image => image.id === item.selectedVariant.image_id)
    //                     : null;
    // const imageUrl = variantImage ? variantImage.src : (item.images && item.images[0] ? item.images[0].src : DEFAULT_IMAGE_URL);

    return (
        <div className="CartItem-container">
           {/* <img className="CartItem-image" src={imageUrl} alt={item.title} />
            <div className="CartItem-details">
                <h3 className="CartItem-title">
                    {item.title}
                    {item.selectedVariant && item.selectedVariant.title !== 'Default Title' && ` - ${item.selectedVariant.title}`}
                </h3>
                <p className="CartItem-price">${displayPrice}
                    {item.quantity > 1 && 
                        <span style={{ color: 'rgb(49, 180, 255)' }}> | Total: ${totalItemPrice}</span>
                    }
                </p>
                <p className="CartItem-price-total">${totalItemPrice}</p> Display the formatted price
                <div className="CartItem-quantity-controls">
                    <div className="quantity-controls">
                        <button className="CartItem-quantity-decrease" onClick={() => updateQuantity(item.cartItemId, 'decrement')}>
                            -
                        </button>
                        <span className="CartItem-quantity">{item.quantity}</span>
                        <button className="CartItem-quantity-increase" onClick={() => updateQuantity(item.cartItemId, 'increment')}>
                            +
                        </button>
                    </div>

                    <button className="CartItem-remove" onClick={() => removeFromCart(item.cartItemId)}>
                        <TrashIcon />
                    </button>
                </div>
            </div> */}
        </div>
    );
};

export default CartItem;
