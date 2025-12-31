import React, { useState } from "react";

const Services = ({ onAddToCart }) => {
  const [selectedProgram, setSelectedProgram] = useState(null); 

  const programs = [
    {
        id: 1,
        name: "Upper lower program",
        description: "4 weeks Upper Lower 4 days program perfect to start your fitness journey",
        price: "$50",
        type: "program"
    },
    {
        id: 2,
        name: "Powerlifting",
        description: "4 weeks powerlifting program focusing on strength",
        price: "$60",
        type: "program"
    },
    {
        id: 3,
        name: "bro-split",
        description: "4 weeks Old schooled bro split grouping 2 muscles each day",
        price: "$50",
        type: "program"
    },
    {
       id: 4,
       name: "PPL",
       description: "Push Pull legs 6 days program focusing on buiding muscles",
       price: "$50",
       type: "program"
    },
  ];

  const handleAddToCart = (program) => {
    onAddToCart(program);
    setSelectedProgram(null);
  };

  return (
    <div className="bg-black min-h-screen text-white pt-28 px-8">
      <h1 className="text-4xl font-bold text-center mb-8">Our Programs</h1>

      {selectedProgram && (
        <div className="bg-gray-900 rounded-xl p-6 mb-8 shadow-lg text-white max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">
            Add to Cart: {selectedProgram.name}
          </h2>
          <p className="mb-4">{selectedProgram.description}</p>
          <p className="mb-4 text-[#00df9a] font-bold">{selectedProgram.price}</p>
          <button
            onClick={() => handleAddToCart(selectedProgram)}
            className="bg-[#00df9a] text-black font-bold py-2 px-4 rounded-lg mr-4 hover:bg-[#00c785] transition duration-300"
          >
            Add to Cart
          </button>
          <button
            onClick={() => setSelectedProgram(null)}
            className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {programs.map((program) => (
          <div
            key={program.id}
            className="bg-gray-800 rounded-2xl p-6 flex flex-col justify-between shadow-lg hover:scale-105 transform transition duration-300 h-96 w-50"
          >
            <h3 className="text-4xl font-bold mb-2">{program.name}</h3>
            <p className="mb-4 text-gray-300 text-2xl">{program.description}</p>
            <p className="text-[#00df9a] font-bold text-2xl">{program.price}</p>
           
            <button
              onClick={() => setSelectedProgram(program)}
              className="mt-4 bg-[#00df9a] text-black font-bold py-2 px-4 rounded-lg w-full hover:bg-[#00c785] transition duration-300"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;