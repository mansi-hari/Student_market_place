import React from 'react';

const CategoryCard = ({ icon, name, count }) => {
  return (
    <div className="category-card">
      <div className="category-icon">{icon}</div>
      <h3 className="category-name">{name}</h3>
      <p className="category-count">{count}</p>
    </div>
  )
}

export default CategoryCard

