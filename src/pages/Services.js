import { useState, useEffect } from "react";
import { api } from "../api.js";

const Services = ({ onAddToCart }) => {
  const [programs, setPrograms] = useState([]);

  const queryParameters = new URLSearchParams(window.location.search);
  const isAdmin = queryParameters.get("admin") === "true";

  const [showAddForm, setShowAddForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [link, setLink] = useState("");

  useEffect(() => {
    api
      .get("/programs")
      .then((res) => setPrograms(res.data))
      .catch((err) => console.log("DB Error:", err));
  }, []);

  const resetForm = () => {
    setEditId(null);
    setShowAddForm(false);
    setName("");
    setDesc("");
    setPrice("");
    setLink("");
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const data = {
      program_name: name,
      description: desc,
      price: price,
      sheet_link: link,
      sheet_id: "",
    };

    if (editId) {
      try {
        await api.put(`/programs/${editId}`, data);
        setPrograms(
          programs.map((p) => (p.program_id === editId ? { ...p, ...data } : p))
        );
        resetForm();
      } catch (err) {
        console.error("Update failed:", err?.response?.data || err.message);
        alert("Update failed");
      }
    } else {
      try {
        const res = await api.post("/programs", data);

        // backend returns { program_id: ..., ... } OR just {program_id}
        // keep your UI stable by appending the created item
        const created = res.data?.program_id
          ? { program_id: res.data.program_id, ...data }
          : res.data;

        setPrograms([...programs, created]);
        resetForm();
      } catch (err) {
        console.error("Add failed:", err?.response?.data || err.message);
        alert("Add failed: Check backend");
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this program forever?")) return;
    try {
      await api.delete(`/programs/${id}`);
      setPrograms(programs.filter((p) => p.program_id !== id));
    } catch (err) {
      console.error("Delete failed:", err?.response?.data || err.message);
      alert("Delete failed");
    }
  };

  return (
    <div className="bg-black text-white min-h-screen p-8">
      {isAdmin && (
        <div className="bg-[#00df9a] text-black p-2 text-center font-bold mb-4 rounded">
          ADMIN MODE ACTIVE
        </div>
      )}

      <div className="flex justify-between mb-8">
        <h2 className="text-4xl font-bold">Our Programs</h2>

        {isAdmin && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-[#00df9a] text-black px-4 py-2 rounded font-bold"
          >
            {showAddForm ? "Cancel" : "+ Add New"}
          </button>
        )}
      </div>

      {isAdmin && (showAddForm || editId) && (
        <form
          onSubmit={handleSave}
          className="bg-gray-900 p-6 rounded mb-8 border border-[#00df9a] flex flex-col gap-4"
        >
          <h3 className="text-xl font-bold">
            {editId ? "Edit Program" : "Add New Program"}
          </h3>

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

          <input
            placeholder="Sheet Link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="p-2 bg-gray-800 rounded"
          />

          <textarea
            placeholder="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="p-2 bg-gray-800 rounded"
            required
          />

          <button
            type="submit"
            className="bg-[#00df9a] text-black py-2 rounded font-bold"
          >
            Confirm & Save
          </button>

          <button
            type="button"
            onClick={resetForm}
            className="text-gray-400 text-sm"
          >
            Cancel
          </button>
        </form>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {programs.map((p) => (
          <div
            key={p.program_id}
            className="bg-gray-800 p-6 rounded-xl flex flex-col justify-between h-80"
          >
            <div>
              <h3 className="text-xl font-bold">{p.program_name}</h3>
              <p className="text-gray-400 text-sm mt-2">{p.description}</p>
              <p className="text-[#00df9a] font-bold mt-2">${p.price}</p>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => onAddToCart(p)}
                className="bg-[#00df9a] text-black py-2 rounded font-bold"
              >
                Buy
              </button>

              {isAdmin && (
                <div className="flex justify-around mt-2 text-sm">
                  <button
                    onClick={() => {
                      setEditId(p.program_id);
                      setName(p.program_name);
                      setDesc(p.description);
                      setPrice(p.price);
                      setLink(p.sheet_link || "");
                      setShowAddForm(true);
                    }}
                    className="text-blue-400 underline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(p.program_id)}
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

export default Services;
