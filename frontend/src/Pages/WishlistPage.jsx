import React, { useState, useEffect } from 'react';
import axios from 'axios';

function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axios.get('/wishlist/123'); // Replace with actual userId
        setWishlistItems(response.data);
      } catch (error) {
        console.error('Error fetching wishlist', error);
      }
    };
    fetchWishlist();
  }, []);

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await axios.delete(`/wishlist/${productId}`, {
        data: { userId: '123' }, // Replace with actual userId
      });
      setWishlistItems(wishlistItems.filter(item => item._id !== productId));
    } catch (error) {
      console.error('Error removing product from wishlist', error);
    }
  };

  return (
    <div>
      <h2>Your Wishlist</h2>
      {wishlistItems.length === 0 ? (
        <p>No items found in the wishlist</p>
      ) : (
        <ul>
          {wishlistItems.map((item) => (
            <li key={item._id}>
              <h3>{item.title}</h3>
              <p>{item.price}</p>
              <button onClick={() => handleRemoveFromWishlist(item._id)}>
                Remove from Wishlist
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default WishlistPage;
