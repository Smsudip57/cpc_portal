import { useState, useContext } from "react";
import axios from "axios";
import { MyContext } from "@/context/context";

const CreateNewsForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    facebook: "",
    diu: "",
    image: null,
  });
  const content = useContext(MyContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { files } = e.target;
    setFormData((prev) => ({
      ...prev,
      image: files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);

    
    if (formData.facebook) formDataToSend.append("facebook", formData.facebook);
    if (formData.diu) formDataToSend.append("diu", formData.diu);

    formDataToSend.append("image", formData.image);

    try {
      const response = await axios.post("/api/news/createnews", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      content.customToast(response.data);
      if (response.data.success) {
        setFormData({
          title: "",
          description: "",
          facebook: "",
          diu: "",
          image: null,
        });
      }
    } catch (error) {
      console.error("Error creating news:", error);
      content.customToast(error.response.data);
    }
  };

  return (
    <div className="w-full bg-[#BDE9C9] rounded-lg py-6">
      <p class="text-xl font-mono w-full font-semibold py-4 text-center">Create News</p>
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-8 bg-[#4ADE80] rounded-md">
      <div className="mb-4">
        <label className="block text-lg font-semibold">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label className="block text-lg font-semibold">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
          style={{ whiteSpace: "pre-wrap" }}
        />
      </div>

      <div className="mb-4">
        <label className="block text-lg font-semibold">Facebook Link</label>
        <input
          type="url"
          name="facebook"
          value={formData.facebook}
          placeholder="Optional"
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label className="block text-lg font-semibold">DIU Link</label>
        <input
          type="url"
          name="diu"
          value={formData.diu}
          placeholder="Optional"
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label className="block text-lg font-semibold">Image</label>
        <input
          type="file"
          name="image"
          onChange={handleFileChange}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md"
        >
          Submit News
        </button>
      </div>

      {formData.description && (
        <div className="mt-6 p-4 border border-gray-300 rounded-md bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">Preview:</h3>
          <div style={{ whiteSpace: "pre-wrap" }}>{formData.description}</div>
        </div>
      )}
    </form>
    </div>
  );
};

export default CreateNewsForm;
