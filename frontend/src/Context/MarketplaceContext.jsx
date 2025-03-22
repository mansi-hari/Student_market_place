import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const MarketplaceContext = createContext();

export const MarketplaceProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const response = await api.getWishlist();
                setWishlist(response);
            } catch (error) {
                console.error("Failed to fetch wishlist:", error);
            }
        };

        if (user) {
            fetchWishlist();
        }
    }, [user]);

    const toggleWishlist = (productId) => {
        setWishlist((prevWishlist) =>
            prevWishlist.includes(productId)
                ? prevWishlist.filter((id) => id !== productId)
                : [...prevWishlist, productId]
        );
    };

    return (
        <MarketplaceContext.Provider value={{ user, setUser, wishlist, toggleWishlist }}>
            {children}
        </MarketplaceContext.Provider>
    );
};

export const useMarketplace = () => useContext(MarketplaceContext);