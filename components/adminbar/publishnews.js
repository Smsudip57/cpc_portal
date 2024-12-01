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
    console.log(formData);
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("facebook", formData.facebook);
    formDataToSend.append("diu", formData.diu);
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
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4">
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
          style={{ whiteSpace: "pre-wrap" }} // Preserve spaces and new lines
        />
      </div>

      <div className="mb-4">
        <label className="block text-lg font-semibold">Facebook Link</label>
        <input
          type="url"
          name="facebook"
          value={formData.facebook}
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

      {/* Display the Description with whitespace preserved */}
      {formData.description && (
        <div className="mt-6 p-4 border border-gray-300 rounded-md bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">Preview:</h3>
          <div style={{ whiteSpace: "pre-wrap" }}>{formData.description}</div>
        </div>
      )}
    </form>
  );
};

export default CreateNewsForm;
