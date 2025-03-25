import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, X, Mail, Phone, MessageSquare } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../Context/AuthContext";
import api from "../utils/api"; // Import API functions

const WishlistPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch wishlist from API
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!currentUser) return; // Ensure user is logged in before fetching
      try {
        setIsLoading(true);
        const data = await api.getWishlist();
        setWishlistItems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching wishlist:", error.response?.data || error.message);
        toast.error("Failed to load wishlist.");
        setWishlistItems([]); // Prevents undefined issues
      } finally {
        setIsLoading(false);
      }
    };
    

    fetchWishlist();
  }, [currentUser]); // Re-fetch wishlist when user changes

  
  // Remove item from wishlist (API + State)
  const handleRemoveFromWishlist = async (item) => {
    const itemId = item._id || item.id;
    try {
      await api.removeFromWishlist(itemId);
      setWishlistItems((prev) => prev.filter((i) => (i._id || i.id) !== itemId));
      toast.success("Item removed from wishlist");
    } catch (error) {
      console.error("Error removing from wishlist:", error.response?.data || error.message);
      toast.error("Failed to remove item.");
    }
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

  const handleChatWithSeller = (sellerId) => {
    navigate(`/ChatComponent/${sellerId}`);
    setShowContactModal(false);
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
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <div key={item._id || item.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105">
              <div className="relative h-48 cursor-pointer" onClick={() => setSelectedItem(item)}>
                <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-full object-cover" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFromWishlist(item);
                  }}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition"
                >
                  <Heart className="h-5 w-5 text-red-500" />
                </button>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 truncate">{item.title}</h3>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold">₹{item.price.toLocaleString()}</span>
                  <span className="text-sm text-gray-500">{item.postedDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{item.condition}</span>
                  <button
                    onClick={() => handleContactSeller(item)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    Contact Seller
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showContactModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h5 className="text-lg font-semibold">Contact Seller</h5>
              <button className="text-gray-600 hover:text-gray-800" onClick={() => setShowContactModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="flex items-center mb-3">
              <img
                src={selectedItem.seller?.profileImage || "/placeholder.svg"}
                alt={selectedItem.seller?.name || "Seller"}
                className="rounded-full w-12 h-12 mr-3"
              />
              <div>
                <h6 className="font-semibold">{selectedItem.seller?.name || "Unknown Seller"}</h6>
                {selectedItem.seller?.rating && (
                  <div className="text-yellow-500 text-sm">★ {selectedItem.seller.rating}</div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <button
                className="flex items-center justify-center gap-2 px-4 py-2 border rounded-md w-full text-blue-600 border-blue-600 hover:bg-blue-50"
                onClick={() => handleEmailSeller(selectedItem.seller?.email)}
              >
                <Mail size={18} />
                Email: {selectedItem.seller?.email || "Not Available"}
              </button>

              <button
                className="flex items-center justify-center gap-2 px-4 py-2 border rounded-md w-full text-blue-600 border-blue-600 hover:bg-blue-50"
                onClick={() => handleCallSeller(selectedItem.seller?.phone)}
              >
                <Phone size={18} />
                Call: {selectedItem.seller?.phone || "Not Available"}
              </button>

              <button
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition w-full"
                onClick={() => handleChatWithSeller(selectedItem.seller?.id)}
              >
                <MessageSquare size={18} />
                Chat with Seller
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
