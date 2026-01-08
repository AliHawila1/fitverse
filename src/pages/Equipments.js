import { useState, useEffect } from "react";
import { api, API_BASE } from "../api.js";

const Equipments = ({ onAddToCart }) => {
  const [equipments, setEquipments] = useState([]);

  const queryParameters = new URLSearchParams(window.location.search);
  const isAdmin = queryParameters.get("admin") === "true";

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    api
      .get("/equipment")
      .then((res) => setEquipments(res.data))
      .catch((err) => console.log("Fetch Error:", err));
  }, []);

  const resetForm = () => {
    setName("");
    setDesc("");
    setPrice("");
    setFile(null);
    setEditId(null);
    setShowForm(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("equipment_name", name);
    formData.append("description", desc);
    formData.append("price", price);

    if (file) {
      formData.append("image", file);
    } else if (editId) {
      const currentItem = equipments.find((item) => item.equipment_id === editId);
      if (currentItem && currentItem.image) {
        formData.append("existingImage", currentItem.image);
      }
    }

    const config = {
      headers: { "Content-Type": "multipart/form-data" },
    };

    if (editId) {
      try {
        const res = await api.put(`/equipment/${editId}`, formData, config);
        setEquipments(
          equipments.map((item) =>
            item.equipment_id === editId
              ? {
                  ...item,
                  equipment_name: name,
                  description: desc,
                  price: price,
                  image: res.data.image ?? item.image,
                }
              : item
          )
        );
        resetForm();
      } catch (err) {
        console.error("PUT Error:", err.response?.data || err.message);
        alert("Error updating equipment.");
      }
    } else {
      try {
        const res = await api.post("/equipment", formData, config);
        setEquipments([...equipments, res.data]);
        resetForm();
      } catch (err) {
        console.error("POST Error:", err.response?.data || err.message);
        alert("Error adding new equipment.");
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this equipment?")) return;
    try {
      await api.delete(`/equipment/${id}`);
      setEquipments(equipments.filter((e) => e.equipment_id !== id));
    } catch (err) {
      console.error("DELETE Error:", err.response?.data || err.message);
      alert("Error deleting equipment.");
    }
  };

  return (
    <div className="bg-black min-h-screen text-white pt-28 px-6 md:px-12">
      {isAdmin && (
        <div className="bg-[#00df9a] text-black text-center font-bold p-2 mb-4 rounded">
          ADMIN MODE
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-[#00df9a]">Fitness Equipment</h1>

        {isAdmin && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-[#00df9a] text-black px-4 py-2 rounded font-bold"
          >
            {showForm ? "Cancel" : "+ Add Equipment"}
          </button>
        )}
      </div>

      {isAdmin && (showForm || editId) && (
        <form
          onSubmit={handleSave}
          className="bg-gray-900 p-6 rounded-xl border border-[#00df9a] mb-10 flex flex-col gap-4"
        >
          <h2 className="text-xl font-bold">{editId ? "Edit" : "Add"} Equipment</h2>

          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 bg-gray-800 rounded"
            required
          />

          <input
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="p-2 bg-gray-800 rounded"
            required
          />

          <textarea
            placeholder="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="p-2 bg-gray-800 rounded"
            required
          />

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="text-sm text-gray-400"
          />

          <button className="bg-[#00df9a] text-black font-bold py-2 rounded">
            Save Equipment
          </button>
        </form>
      )}

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {equipments.map((item) => (
          <div
            key={item.equipment_id}
            className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg flex flex-col"
          >
            <img
              src={`${API_BASE}/uploads/${item.image}`}
              alt={item.equipment_name}
              className="h-48 w-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/300x200";
              }}
            />

            <div className="p-6 flex flex-col flex-grow">
              <h2 className="text-2xl font-bold mb-2">{item.equipment_name}</h2>
              <p className="text-gray-400 mb-4 flex-grow">{item.description}</p>
              <p className="text-[#00df9a] font-bold text-lg mb-4">${item.price}</p>

              <button
                onClick={() => onAddToCart(item)}
                className="bg-[#00df9a] text-black font-bold py-2 rounded-lg"
              >
                Add to Cart
              </button>

              {isAdmin && (
                <div className="flex justify-between mt-4 border-t border-gray-700 pt-4">
                  <button
                    onClick={() => {
                      setEditId(item.equipment_id);
                      setName(item.equipment_name);
                      setDesc(item.description);
                      setPrice(item.price);
                      setShowForm(true);
                    }}
                    className="text-blue-400 underline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(item.equipment_id)}
                    className="text-red-500 underline"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Equipments;
