import React, { useState, useEffect } from "react";
import axios from "../utils/axiosInstance";

const AccountPage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ name: "", phone: "" });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/users/account", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUser(response.data.user);
        setEditData({
          name: response.data.user.name,
          phone: response.data.user.phone || "",
        });
        setIsLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching user data.");
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleEditProfile = async () => {
    try {
      await axios.put("/users/update-profile", editData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setUser((prevUser) => ({
        ...prevUser,
        name: editData.name,
        phone: editData.phone,
      }));

      setEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      setError("Error updating profile.");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account permanently?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete("/users/delete", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (error) {
      setError("Error deleting account.");
    }
  };

  return (
    <div className="bg-zinc-200 min-h-screen flex items-center justify-center font-serif">
      <div className="max-w-lg w-full bg-zinc-800 p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-extrabold text-zinc-100 text-center mb-8">My Account</h1>
        {isLoading && <p className="text-zinc-400 text-center">Loading...</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {user && (
          <div className="flex flex-col items-center space-y-4">
            {/* User Information */}
            <p className="text-zinc-300">
              <strong>Name:</strong> {user.name}
            </p>
            <p className="text-zinc-300">
              <strong>Email:</strong> {user.email}
            </p>
            <p className="text-zinc-300">
              <strong>Phone:</strong> {user.phone || "N/A"}
            </p>

            {/* Admin Dashboard Button */}
            {user.isAdmin && (
              <button
                onClick={() => (window.location.href = "/admin-dashboard")}
                className="w-full bg-zinc-600 text-white py-2 rounded-lg hover:bg-zinc-500 transition duration-200 cursor-pointer"
              >
                Go to Admin Dashboard
              </button>
            )}

            {/* Settings Section */}
            <button
              onClick={() => setEditing(true)}
              className="w-full bg-zinc-600 text-white py-2 rounded-lg hover:bg-zinc-500 transition duration-200 cursor-pointer"
            >
              Edit Profile
            </button>
            <button
              onClick={handleDeleteAccount}
              className="w-full bg-zinc-600 text-white py-2 rounded-lg hover:bg-zinc-500 transition duration-200 cursor-pointer"
            >
              Delete Account
            </button>

            {/* Redirect Buttons */}
            <button
              onClick={() => (window.location.href = "/orders/ongoing")}
              className="w-full bg-zinc-600 text-white py-2 rounded-lg hover:bg-zinc-500 transition duration-200 cursor-pointer"
            >
              View Ongoing Orders/Status
            </button>
            <button
              onClick={() => (window.location.href = "/orders/history")}
              className="w-full bg-zinc-600 text-white py-2 rounded-lg hover:bg-zinc-500 transition duration-200 cursor-pointer"
            >
              View Order History
            </button>

            {/* Logout Button */}
            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}
              className="w-full bg-zinc-700 text-white py-2 rounded-lg hover:bg-zinc-600 transition duration-200 cursor-pointer"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {editing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-zinc-800 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4 text-zinc-100">Edit Profile</h2>
            <input
              type="text"
              placeholder="New Name"
              value={editData.name}
              onChange={(e) =>
                setEditData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full p-2 border border-zinc-600 bg-zinc-700 text-zinc-100 rounded-lg mb-4"
            />
            <input
              type="text"
              placeholder="New Phone Number"
              value={editData.phone}
              onChange={(e) =>
                setEditData((prev) => ({ ...prev, phone: e.target.value }))
              }
              className="w-full p-2 border border-zinc-600 bg-zinc-700 text-zinc-100 rounded-lg mb-4"
            />
            <div className="flex justify-between">
              <button
                onClick={handleEditProfile}
                className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200 cursor-pointer"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditing(false)}
                className="bg-zinc-700 text-white py-2 px-4 rounded-lg hover:bg-zinc-600 transition duration-200 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountPage;