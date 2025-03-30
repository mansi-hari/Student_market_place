import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../Context/AuthContext';
import { addToWishlist, removeFromWishlist, checkWishlist } from '../utils/wishlist.service';

const WishlistButton = ({ productId, className = '', size = 'md', onlyIcon = false }) => {
  const { isAuthenticated } = useAuth();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if product is in wishlist
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!isAuthenticated || !productId) return;

      try {
        const inWishlist = await checkWishlist(productId);
        setIsInWishlist(inWishlist);
      } catch (error) {
        console.error('Error checking wishlist status:', error);
      }
    };

    checkWishlistStatus();
  }, [productId, isAuthenticated]);

  // Toggle wishlist status
  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please login to add items to your wishlist');
      return;
    }

    setIsLoading(true);

    try {
      if (isInWishlist) {
        await removeFromWishlist(productId);
        setIsInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist(productId);
        setIsInWishlist(true);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast.error('Failed to update wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  // Button sizes
  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg'
  };

  // Icon sizes
  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  return (
    <button
      className={`btn ${isInWishlist ? 'btn-danger' : 'btn-outline-danger'} ${sizeClasses[size]} ${className}`}
      onClick={handleToggleWishlist}
      disabled={isLoading}
      title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart size={iconSizes[size]} className={isLoading ? 'opacity-50' : ''} />
      {!onlyIcon && (
        <span className="ms-2">
          {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        </span>
      )}
    </button>
  );
};

export default WishlistButton;