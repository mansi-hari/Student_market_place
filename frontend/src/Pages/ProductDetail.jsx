// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import { toast } from 'react-hot-toast';
// import { getProductById, checkWishlist, addToWishlist, removeFromWishlist } from '../utils/api';
// import { useAuth } from '../Components/Context/AuthContext';
// import { formatDistanceToNow } from 'date-fns';
// import { HeartIcon, ChatIcon, ShareIcon, LocationMarkerIcon, TagIcon, StarIcon } from '@heroicons/react/outline';
// import { HeartIcon as HeartIconSolid } from '@heroicons/react/solid';
// import LocationMap from '../Components/LocationMap';
// import ProductCard from '../Components/ProductCard/ProductCard';
// import SellerModal from '../Components/SellerModal';

// const ProductDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { isAuthenticated, user } = useAuth();
  
//   const [product, setProduct] = useState(null);
//   const [isWishlisted, setIsWishlisted] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [activeImage, setActiveImage] = useState(0);
//   const [relatedProducts, setRelatedProducts] = useState([]);
//   const [showSellerModal, setShowSellerModal] = useState(false);
  
//   // Fetch product data
//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const data = await getProductById(id);
//         setProduct(data.data);
        
//         // Fetch related products
//         // This would be implemented in the backend
//         // For now, we'll just use placeholder data
//         setRelatedProducts([]);
        
//         // Check if product is in user's wishlist
//         if (isAuthenticated) {
//           const wishlistData = await checkWishlist(id);
//           setIsWishlisted(wishlistData.isWishlisted);
//         }
//       } catch (error) {
//         console.error('Error fetching product:', error);
//         toast.error('Failed to load product details');
//         navigate('/404');
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchProduct();
//   }, [id, isAuthenticated, navigate]);
  
//   // Handle wishlist toggle
//   const handleWishlistToggle = async () => {
//     if (!isAuthenticated) {
//       toast.error('Please sign in to add items to your wishlist');
//       navigate('/login?redirect=' + encodeURIComponent(`/products/${id}`));
//       return;
//     }
    
//     try {
//       if (isWishlisted) {
//         await removeFromWishlist(id);
//         toast.success('Removed from wishlist');
//       } else {
//         await addToWishlist(id);
//         toast.success('Added to wishlist');
//       }
      
//       setIsWishlisted(!isWishlisted);
//     } catch (error) {
//       console.error('Wishlist error:', error);
//     }
//   };
  
//   // Handle contact seller
//   const handleContactSeller = () => {
//     if (!isAuthenticated) {
//       toast.error('Please sign in to contact the seller');
//       navigate('/login?redirect=' + encodeURIComponent(`/products/${id}`));
//       return;
//     }
    
//     // Check if user is the seller
//     if (user && product && user._id === product.seller._id) {
//       toast.error('You cannot message yourself');
//       return;
//     }
    
//     setShowSellerModal(true);
//   };
  
//   // Handle buy now
//   const handleBuyNow = () => {
//     if (!isAuthenticated) {
//       toast.error('Please sign in to purchase this item');
//       navigate('/login?redirect=' + encodeURIComponent(`/products/${id}`));
//       return;
//     }
    
//     // Check if user is the seller
//     if (user && product && user._id === product.seller._id) {
//       toast.error('You cannot buy your own item');
//       return;
//     }
    
//     navigate(`/checkout/${id}`);
//   };
  
//   // Handle share
//   const handleShare = () => {
//     if (navigator.share) {
//       navigator.share({
//         title: product.title,
//         text: `Check out this item: ${product.title}`,
//         url: window.location.href
//       })
//         .then(() => console.log('Shared successfully'))
//         .catch((error) => console.error('Error sharing:', error));
//     } else {
//       // Fallback for browsers that don't support the Web Share API
//       navigator.clipboard.writeText(window.location.href);
//       toast.success('Link copied to clipboard');
//     }
//   };
  
//   if (loading) {
//     return (
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="animate-pulse">
//           <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             <div className="h-96 bg-gray-200 rounded"></div>
//             <div className="space-y-4">
//               <div className="h-6 bg-gray-200 rounded w-1/2"></div>
//               <div className="h-10 bg-gray-200 rounded w-1/4"></div>
//               <div className="h-4 bg-gray-200 rounded w-full"></div>
//               <div className="h-4 bg-gray-200 rounded w-full"></div>
//               <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//               <div className="h-10 bg-gray-200 rounded w-full"></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
  
//   if (!product) {
//     return (
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
//           <p className="mt-2 text-gray-600">The product you're looking for doesn't exist or has been removed.</p>
//           <Link to="/" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
//             Back to Home
//           </Link>
//         </div>
//       </div>
//     );
//   }
  
//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//       {/* Product details */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/* Product images */}
//         <div className="space-y-4">
//           {/* Main image */}
//           <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
//             {product.images && product.images.length > 0 ? (
//               <img
//                 src={product.images[activeImage] || "/placeholder.svg"}
//                 alt={product.title}
//                 className="w-full h-full object-center object-cover"
//               />
//             ) : (
//               <div className="w-full h-full flex items-center justify-center bg-gray-100">
//                 <span className="text-gray-400">No image</span>
//               </div>
//             )}
//           </div>
          
//           {/* Thumbnail images */}
//           {product.images && product.images.length > 1 && (
//             <div className="grid grid-cols-5 gap-2">
//               {product.images.map((image, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setActiveImage(index)}
//                   className={`aspect-w-1 aspect-h-1 rounded-md overflow-hidden ${
//                     activeImage === index ? 'ring-2 ring-blue-500' : ''
//                   }`}
//                 >
//                   <img
//                     src={image || "/placeholder.svg"}
//                     alt={`Thumbnail ${index + 1}`}
//                     className="w-full h-full object-center object-cover"
//                   />
//                 </button>
//               ))}
//             </div>
//           )}
          
//           {/* Location map */}
//           <div className="mt-6">
//             <h3 className="text-lg font-medium text-gray-900 mb-2">Location</h3>
//             <LocationMap
//               position={product.location.coordinates}
//               readOnly={true}
//               height="300px"
//             />
//             <p className="mt-2 text-sm text-gray-500 flex items-center">
//               <LocationMarkerIcon className="h-4 w-4 mr-1" />
//               {product.location.name}
//             </p>
//           </div>
//         </div>
        
//         {/* Product info */}
//         <div>
//           {/* Status badge */}
//           {product.status !== 'available' && (
//             <div className="mb-4">
//               <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
//                 product.status === 'sold' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
//               }`}>
//                 {product.status === 'sold' ? 'Sold' : 'Reserved'}
//               </span>
//             </div>
//           )}
          
//           {/* Title and price */}
//           <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
//           <p className="mt-2 text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
          
//           {/* Category and condition */}
//           <div className="mt-4 flex items-center space-x-2">
//             <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
//               <TagIcon className="h-4 w-4 mr-1" />
//               {product.category}
//             </span>
//             <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
//               {product.condition}
//             </span>
//           </div>
          
//           {/* Description */}
//           <div className="mt-6">
//             <h3 className="text-lg font-medium text-gray-900">Description</h3>
//             <div className="mt-2 text-gray-600 space-y-4">
//               {product.description.split('\n').map((paragraph, index) => (
//                 <p key={index}>{paragraph}</p>
//               ))}
//             </div>
//           </div>
          
//           {/* Seller info */}
//           <div className="mt-6 border-t border-gray-200 pt-6">
//             <h3 className="text-lg font-medium text-gray-900">Seller Information</h3>
//             <div className="mt-2 flex items-center">
//               {product.seller.avatar ? (
//                 <img
//                   src={product.seller.avatar || "/placeholder.svg"}
//                   alt={product.seller.name}
//                   className="h-10 w-10 rounded-full object-cover"
//                 />
//               ) : (
//                 <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
//                   <span className="text-gray-500">{product.seller.name.charAt(0)}</span>
//                 </div>
//               )}
//               <div className="ml-3">
//                 <p className="text-sm font-medium text-gray-900">{product.seller.name}</p>
//                 <div className="flex items-center">
//                   {product.seller.rating > 0 ? (
//                     <>
//                       <p className="text-sm text-gray-500">
//                         {product.seller.rating} <span className="sr-only">out of 5 stars</span>
//                       </p>
//                       <div className="ml-1 flex items-center">
//                         {[0, 1, 2, 3, 4].map((rating) => (
//                           <StarIcon
//                             key={rating}
//                             className={`h-4 w-4 ${
//                               product.seller.rating > rating ? 'text-yellow-400' : 'text-gray-300'
//                             }`}
//                             aria-hidden="true"
//                           />
//                         ))}
//                       </div>
//                       <p className="ml-2 text-sm text-gray-500">({product.seller.reviewCount} reviews)</p>
//                     </>
//                   ) : (
//                     <p className="text-sm text-gray-500">No reviews yet</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           {/* Posted time */}
//           <p className="mt-4 text-sm text-gray-500">
//             Posted {formatDistanceToNow(new Date(product.createdAt), { addSuffix: true })}
//           </p>
          
//           {/* Action buttons */}
//           <div className="mt-8 space-y-4">
//             {product.status === 'available' && (
//               <button
//                 onClick={handleBuyNow}
//                 disabled={user && product && user._id === product.seller._id}
//                 className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
//               >
//                 Buy Now
//               </button>
//             )}
            
//             <div className="grid grid-cols-3 gap-4">
//               <button
//                 onClick={handleContactSeller}
//                 disabled={user && product && user._id === product.seller._id}
//                 className="flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
//               >
//                 <ChatIcon className="h-5 w-5 mr-2" />
//                 Contact
//               </button>
              
//               <button
//                 onClick={handleWishlistToggle}
//                 className="flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               >
//                 {isWishlisted ? (
//                   <>
//                     <HeartIconSolid className="h-5 w-5 mr-2 text-red-500" />
//                     Saved
//                   </>
//                 ) : (
//                   <>
//                     <HeartIcon className="h-5 w-5 mr-2" />
//                     Save
//                   </>
//                 )}
//               </button>
              
//               <button
//                 onClick={handleShare}
//                 className="flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               >
//                 <ShareIcon className="h-5 w-5 mr-2" />
//                 Share
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       {/* Related products */}
//       {relatedProducts.length > 0 && (
//         <div className="mt-16">
//           <h2 className="text-2xl font-bold text-gray-900">Related Products</h2>
//           <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
//             {relatedProducts.map((relatedProduct) => (
//               <ProductCard
//                 key={relatedProduct._id}
//                 product={relatedProduct}
//                 isWishlisted={relatedProduct.isWishlisted}
//               />
//             ))}
//           </div>
//         </div>
//       )}
      
//       {/* Seller modal */}
//       {showSellerModal && (
//         <SellerModal
//           product={product}
//           onClose={() => setShowSellerModal(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default ProductDetail;