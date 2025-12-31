
import bot from "../assets/bot.jpg"
import bottle from "../assets/bottle.jpg"
import dumbells from "../assets/dumbells.webp"
import band from "../assets/band.webp"
import mat from "../assets/mat.jpg"
import multi from "../assets/multi.jpg"
import solid from "../assets/solid.jpg"
import step from "../assets/step.jpg"
import towel from "../assets/towel.jpg"
import straps from "../assets/straps.webp"

const products = [
    {
        id: 1,
        name: "Adjustable Dumbbells",
        description: "Set of 2 adjustable dumbbells 10 lbs.",
        price: "$120",
        image: dumbells,
        type: "equipment"
    },
    {
        id: 2,
        name: "Yoga Mat",
        description: "Non-slip yoga mat, 6mm thick, eco-friendly.",
        price: "$30",
        image: mat,
        type: "equipment"
    },
    {
        id: 3,
        name: "Solid lifting Straps",
        description: "A pair of solid adjustabile lifting hook.",
        price: "$15",
        image: solid,
        type: "equipment"
    },
    {
        id: 4,
        name: "Normal lifting straps",
        description: "A pair of normal wight lifting straps.",
        price: "$10",
        image: straps,
        type: "equipment"
    },
    {
        id: 5,
        name: "Resistance band",
        description: "A 7-11kg resistance level.",
        price: "$10",
        image: band,
        type: "equipment"
    },
    {
        id: 6,
        name: "Protein Shaker",
        description: "A 1000ml Protein Shaker.",
        price: "$5",
        image: bottle,
        type: "equipment"
    },
    {
        id: 7,
        name: "Water Bottle",
        description: "600ml water bottle.",
        price: "$5",
        image: bot,
        type: "equipment"
    },
    {
        id: 8,
        name: "Aerobic Fitness Step",
        description: "Aerobic fitness step black and red.",
        price: "$20",
        image: step,
        type: "equipment"
    },
    {
        id: 9,
        name: "Multi Resistance Train Kit",
        description: "A multi resistance train kit with a variety of levels.",
        price: "$35",
        image: multi,
        type: "equipment"
    },
    {
        id: 10,
        name: "Gym Towel",
        description: "Gym towel microfiber cloths.",
        price: "$7",
        image: towel,
        type: "equipment"
    },
];

const Equipments = ({ onAddToCart }) => {
    return (
        <div className="bg-black min-h-screen text-white pt-28 px-6 md:px-12">
            <h1 className="text-4xl font-bold text-center mb-8">
                Shop Fitness Equipment
            </h1>

            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:scale-105 transform transition duration-300 flex flex-col"
                    >
                        {product.image ? (
                            <img
                                src={product.image}
                                alt={product.name}
                                className="h-48 w-full object-cover"
                            />
                        ) : (
                            <div className="h-48 w-full bg-gray-700 flex items-center justify-center text-gray-400">
                                Image Coming Soon
                            </div>
                        )}

                        <div className="p-6 flex flex-col flex-grow">
                            <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                            <p className="text-gray-300 mb-4 flex-grow">{product.description}</p>
                            <p className="text-[#00df9a] font-bold text-lg mb-4">{product.price}</p>

                            <button 
                                onClick={() => onAddToCart(product)}
                                className="bg-[#00df9a] text-black font-bold py-2 px-4 rounded-lg hover:bg-[#00c785] transition duration-300"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Equipments;