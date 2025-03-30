import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MapPin, ExternalLink } from 'lucide-react';

const WishlistItem = ({ item, onRemove, onView }) => {
  // Format date
  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Unknown date';
    }
  };

  return (
    <div className="card h-100 shadow-sm hover-shadow">
      <div className="position-relative">
        <img
          src={item.photos?.[0] || '/placeholder.svg'}
          className="card-img-top"
          alt={item.title}
          style={{ height: '200px', objectFit: 'cover' }}
        />
        
        <button
          className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 rounded-circle p-2"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          title="Remove from wishlist"
        >
          <Heart size={16} />
        </button>
        
        <div className="position-absolute bottom-0 start-0 m-2">
          <span className="badge bg-primary">{item.condition}</span>
        </div>
      </div>
      
      <div className="card-body d-flex flex-column">
        <h5 className="card-title mb-1">{item.title}</h5>
        
        <p className="card-text text-primary fw-bold mb-1">₹{item.price?.toLocaleString()}</p>
        
        <div className="d-flex align-items-center mb-2 text-muted small">
          <MapPin size={14} className="me-1" />
          <span>{item.location || 'Location not specified'}</span>
        </div>
        
        <div className="d-flex justify-content-between align-items-center mt-auto">
          <span className="text-muted small">
            Added {formatDate(item.createdAt)}
          </span>
          
          <button
            className="btn btn-sm btn-outline-primary d-flex align-items-center"
            onClick={onView}
          >
            <ExternalLink size={14} className="me-1" />
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default WishlistItem;