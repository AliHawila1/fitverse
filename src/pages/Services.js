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
          programs.map((p) =>
            p.program_id === editId ? { ...p, ...data } : p
          )
        );
        resetForm();
      } catch {
        alert("Update failed");
      }
    } else {
      try {
        const res = await api.post("/programs", data);
        const created = res.data?.program_id
          ? { program_id: res.data.program_id, ...data }
          : res.data;
        setPrograms([...programs, created]);
        resetForm();
      } catch {
        alert("Add failed");
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this program forever?")) return;
    try {
      await api.delete(`/programs/${id}`);
      setPrograms(programs.filter((p) => p.program_id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-28 px-6 md:px-12">
      {isAdmin && (
        <div className="bg-orange-500 text-black py-2 text-center font-bold mb-6 rounded-lg">
          ADMIN MODE ACTIVE
        </div>
      )}

      <div className="flex justify-between items-center mb-10">
        <h2 className="text-4xl font-extrabold text-black">
          Training Programs
        </h2>

        {isAdmin && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-orange-500 hover:bg-orange-600 text-black px-5 py-2 rounded-lg font-bold transition"
          >
            {showAddForm ? "Cancel" : "+ Add Program"}
          </button>
        )}
      </div>

      {isAdmin && (showAddForm || editId) && (
        <form
          onSubmit={handleSave}
          className="bg-black text-white p-6 rounded-2xl shadow-xl mb-12 flex flex-col gap-4"
        >
          <h3 className="text-2xl font-bold">
            {editId ? "Edit Program" : "Add New Program"}
          </h3>

          <input
            placeholder="Program Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none"
            required
          />

          <input
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none"
            required
          />

          <input
            placeholder="Sheet Link (optional)"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none"
          />

          <textarea
            placeholder="Program Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none"
            required
          />

          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-black py-3 rounded-lg font-bold transition"
          >
            Save Program
          </button>

          <button
            type="button"
            onClick={resetForm}
            className="text-gray-400 text-sm hover:underline"
          >
            Cancel
          </button>
        </form>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {programs.map((p) => (
          <div
            key={p.program_id}
            className="bg-black text-white p-6 rounded-2xl shadow-xl flex flex-col justify-between h-80"
          >
            <div>
              <h3 className="text-2xl font-bold mb-2">
                {p.program_name}
              </h3>
              <p className="text-gray-400 text-sm mb-3">
                {p.description}
              </p>
              <p className="text-orange-400 font-bold text-xl">
                ${p.price}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => onAddToCart(p)}
                className="bg-orange-500 hover:bg-orange-600 text-black py-3 rounded-lg font-bold transition"
              >
                Buy Program
              </button>

              {isAdmin && (
                <div className="flex justify-between text-sm pt-3 border-t border-gray-700">
                  <button
                    onClick={() => {
                      setEditId(p.program_id);
                      setName(p.program_name);
                      setDesc(p.description);
                      setPrice(p.price);
                      setLink(p.sheet_link || "");
                      setShowAddForm(true);
                    }}
                    className="text-orange-400 hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(p.program_id)}
                    className="text-red-500 hover:underline"
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
