// src/CategoryPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Category = () => {
  const navigate = useNavigate();

  const categories = ['Database', 'OOP', 'General Knowledge', 'Frontend'];

  const handleCategorySelect = (category) => {
    navigate('/chat', { state: { category } });
  };

  return (
    <div className="container">
      <h1 className="text-3xl font-bold text-center mb-8 bg-cyan-900">Select an Interview Category</h1>
      <div className="grid">
        {categories.map((category, index) => (
          <div key={index} className="card card-content"
               onClick={() => handleCategorySelect(category)}>
            <p className="text-lg font-semibold">{category}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
