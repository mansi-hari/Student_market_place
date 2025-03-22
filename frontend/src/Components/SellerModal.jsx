"use client"
import React from 'react';


import { Star, MapPin, Calendar, Phone, MessageCircle } from "lucide-react"

const SellerModal = ({ seller, onClose, onContact }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">{seller.name}</h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-1 font-medium">{seller.rating}</span>
                </div>
                <span className="text-gray-400">•</span>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  {seller.location}
                </div>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ×
            </button>
          </div>

          <div className="mb-6">
            <div className="flex items-center text-gray-600 mb-2">
              <Calendar className="h-4 w-4 mr-2" />
              Member since {seller.memberSince}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => onContact("call")}
              className="flex items-center justify-center gap-2 py-3 px-6 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              <Phone className="h-5 w-5" />
              Call
            </button>
            <button
              onClick={() => onContact("chat")}
              className="flex items-center justify-center gap-2 py-3 px-6 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SellerModal

