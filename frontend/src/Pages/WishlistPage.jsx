"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, X, Mail, Phone } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../Context/AuthContext";

const Wishlist = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Sample wishlist data - in a real app, this would come from an API
  const sampleWishlistItems = [
    {
      id: 1,
      title: "Lenovo LOQ Intel Core i7 13th Gen 13650HX - (24 GB/512 GB SSD)",
      price: 90000.0,
      condition: "Like New",
      postedDate: "2 days ago",
      image: "https://v0.blob.com/laptop.png",
      description:
        "High-performance gaming laptop with latest Intel processor, perfect for gaming and content creation.",
      seller: {
        name: "Rahul Kumar",
        email: "rahul@example.com",
        phone: "+91-9876543210",
        rating: 4.8,
      },
    },
    // Other items...
  ];

  useEffect(() => {
    // Simulate API call to fetch wishlist items
    setIsLoading(true);
    setTimeout(() => {
      setWishlistItems(sampleWishlistItems);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleRemoveFromWishlist = (itemId) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== itemId));
    toast.success("Item removed from wishlist");
  };

  const handleImageClick = (item) => {
    setSelectedItem(item);
  };

  const handleContactSeller = (item) => {
    setSelectedItem(item);
    setShowContactModal(true);
  };

  const handleEmailSeller = (email) => {
    window.location.href = `mailto:${email}`;
    toast.success("Opening email client...");
  };

  const handleCallSeller = (phone) => {
    window.location.href = `tel:${phone}`;
    toast.success("Initiating call...");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="wishlist-page container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">My Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-600 mb-4">Your wishlist is empty</h2>
          <button
            onClick={() => navigate("/products")}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="wishlist-card bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 hover:shadow-lg transition duration-300">
              <div className="relative h-48 cursor-pointer" onClick={() => handleImageClick(item)}>
                <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-full object-cover" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFromWishlist(item.id);
                  }}
                  className="btn-heart absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                >
                  <Heart className="h-5 w-5 text-red-500" />
                </button>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 line-clamp-2">{item.title}</h3>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold">₹{item.price.toLocaleString()}</span>
                  <span className="text-sm text-gray-500">{item.postedDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{item.condition}</span>
                  <button
                    onClick={() => handleContactSeller(item)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Contact Seller
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Item Detail Modal */}
      {selectedItem && !showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
              <img
                src={selectedItem.image || "/placeholder.svg"}
                alt={selectedItem.title}
                className="w-full h-64 object-cover"
              />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">{selectedItem.title}</h2>
              <p className="text-3xl font-bold text-blue-600 mb-4">₹{selectedItem.price.toLocaleString()}</p>
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-600">{selectedItem.description}</p>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Condition</h3>
                <p className="text-gray-600">{selectedItem.condition}</p>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Seller Information</h3>
                <p className="text-gray-600">{selectedItem.seller.name}</p>
                <div className="flex items-center mt-1">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1">{selectedItem.seller.rating}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowContactModal(true);
                }}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Contact Seller
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Contact Seller</h2>
                <button
                  onClick={() => {
                    setShowContactModal(false);
                    setSelectedItem(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold mb-2">Seller Details</h3>
                <p className="text-gray-600">{selectedItem.seller.name}</p>
                <div className="flex items-center mt-1">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1">{selectedItem.seller.rating}</span>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => handleEmailSeller(selectedItem.seller.email)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Mail className="h-5 w-5" />
                  Email Seller
                </button>
                <button
                  onClick={() => handleCallSeller(selectedItem.seller.phone)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                >
                  <Phone className="h-5 w-5" />
                  Call Seller
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
