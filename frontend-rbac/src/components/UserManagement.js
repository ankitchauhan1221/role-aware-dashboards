import React, { useState, useEffect, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const UserManagement = () => {
  const { hasPermission, user, loading } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
    extraPermissions: [],
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return; // Wait until auth state is resolved
    if (!user) return navigate("/login");
    if (!hasPermission("read:users")) return navigate("/403");
    fetchUsers();
  }, [loading, user, hasPermission, navigate]);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/users");
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch users");
    }
  };

  const openCreateModal = () => {
    if (!hasPermission("manage:users")) return alert("Forbidden");
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "USER",
      extraPermissions: [],
    });
    setError("");
    setShowModal(true);
  };

  const openEditModal = (userToEdit) => {
    if (!hasPermission("edit:users")) return alert("Forbidden");
    setEditingUser(userToEdit);
    setFormData({
      name: userToEdit.name,
      email: userToEdit.email,
      password: "",
      role: userToEdit.role,
      extraPermissions: [],
    });
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editingUser) {
        // Update user
        const updateData = { ...formData };
        if (!updateData.password) delete updateData.password; // Don't send empty password

        const { data } = await api.patch(
          `/users/${editingUser._id}`,
          updateData
        );
        setUsers(users.map((u) => (u._id === data._id ? data : u)));
        alert("User updated successfully");
      } else {
        // Create user
        if (!formData.password) {
          setError("Password is required for new users");
          return;
        }
        const { data } = await api.post("/users", formData);
        setUsers([...users, data]);
        alert("User created successfully");
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!hasPermission("delete:users")) return alert("Forbidden");
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
      alert("User deleted successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        {hasPermission("manage:users") && (
          <button
            onClick={openCreateModal}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            + Create User
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Permissions</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{u.name}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      u.role === "ADMIN"
                        ? "bg-red-100 text-red-800"
                        : u.role === "MANAGER"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-600">
                  {u.permissions?.slice(0, 3).join(", ")}
                  {u.permissions?.length > 3 && "..."}
                </td>
                <td className="px-4 py-3">
                  {hasPermission("edit:users") && (
                    <button
                      onClick={() => openEditModal(u)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2 text-sm"
                    >
                      Edit
                    </button>
                  )}
                  {hasPermission("delete:users") && u._id !== user?._id && (
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">
              {editingUser ? "Edit User" : "Create User"}
            </h2>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Password {editingUser && "(leave blank to keep current)"}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  {...(!editingUser && { required: true, minLength: 6 })}
                />
              </div>

              {hasPermission("manage:users") && (
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="USER">USER</option>
                    <option value="MANAGER">MANAGER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {editingUser ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
