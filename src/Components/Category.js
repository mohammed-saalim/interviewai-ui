// src/CategoryPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Category = () => {
  const navigate = useNavigate();

  const categories = ['database', 'oop', 'generalKnowledge', 'frontend'];

  const handleCategorySelect = (category) => {
    navigate('/chat', { state: { category } });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-xl font-bold text-center mb-8">Select an Interview Category</h1>
      <div className="grid grid-cols-4 gap-4">
        {categories.map((category, index) => (
          <div key={index} className="card bg-blue-100 hover:bg-blue-200 cursor-pointer p-4 text-center rounded shadow"
               onClick={() => handleCategorySelect(category)}>
            <p className="text-lg font-semibold">{category}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
