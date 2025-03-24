"use client"

import { useState } from "react"

const CategoryCard = ({ icon, name, count, description, popularItems }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="category-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: "white",
        borderRadius: "8px",
        padding: "16px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        transition: "all 0.3s ease",
        transform: isHovered ? "translateY(-5px)" : "translateY(0)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ marginBottom: "12px", color: "#4f46e5" }}>{icon}</div>
      <h3 style={{ fontSize: "18px", fontWeight: "500", marginBottom: "4px" }}>{name}</h3>
      <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>{count}</p>

      {/* Description that shows on hover */}
      {description && (
        <p
          style={{
            fontSize: "14px",
            color: "#4b5563",
            marginBottom: "12px",
            display: isHovered ? "block" : "none",
          }}
        >
          {description}
        </p>
      )}

      {/* Popular items that show on hover */}
      {popularItems && isHovered && (
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <h4 style={{ fontSize: "14px", fontWeight: "500", marginBottom: "4px" }}>Popular Items:</h4>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              fontSize: "13px",
            }}
          >
            {popularItems.slice(0, 3).map((item, index) => (
              <li
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "4px",
                }}
              >
                <span>{item.name}</span>
                <span style={{ color: "#4f46e5" }}>₹{item.price}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default CategoryCard

