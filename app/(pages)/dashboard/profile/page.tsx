"use client";

import React, { useState, useEffect } from "react";
import { getUser } from "../../../services/supabaseService";
import { FiEdit2, FiSave, FiX } from "react-icons/fi";
import supabase from "../../../services/supabase";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    profile_url: "",
    bank_name: "",
    account_name: "",
    account_number: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      const userData = await getUser();
      if (!userData) {
        router.push('/auth/login');
        return;
      }
      
      setUser(userData);
      setFormData({
        first_name: userData?.first_name || "",
        last_name: userData?.last_name || "",
        email: userData?.email || "",
        phone: userData?.phone || "",
        profile_url: userData?.profile_url || "",
        bank_name: userData?.bank_name || "",
        account_name: userData?.account_name || "",
        account_number: userData?.account_number || "",
      });
    };

    loadUserData();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      profile_url: user?.profile_url || "",
      bank_name: user?.bank_name || "",
      account_name: user?.account_name || "",
      account_number: user?.account_number || "",
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      const { error: updateError } = await supabase
        .from('artists')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          profile_url: formData.profile_url,
          bank_name: formData.bank_name,
          account_name: formData.account_name,
          account_number: formData.account_number,
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Update local user state
      const updatedUser = {
        ...user,
        ...formData
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors duration-200"
            >
              <FiEdit2 /> Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition-colors duration-200 disabled:opacity-50"
              >
                <FiSave /> {loading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-xl transition-colors duration-200 disabled:opacity-50"
              >
                <FiX /> Cancel
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Image Section */}
          <div className="space-y-4">
            <div className="aspect-square w-full max-w-[300px] mx-auto">
              <img
                src={formData.profile_url || "/default-avatar.png"}
                alt="Profile"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            {isEditing && (
              <input
                type="text"
                name="avatar_url"
                value={formData.profile_url}
                onChange={handleChange}
                placeholder="Avatar URL"
                className="w-full p-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600"
              />
            )}
          </div>

          {/* Profile Information */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">First Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600"
                />
              ) : (
                <p className="text-lg">{formData.first_name || "Not set"}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Last Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600"
                />
              ) : (
                <p className="text-lg">{formData.last_name || "Not set"}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <p className="text-lg">{formData.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600"
                />
              ) : (
                <p className="text-lg">{formData.phone || "Not set"}</p>
              )}
            </div>
          </div>
        </div>

        {/* Bank Details Section */}
        <div className="mt-8 pt-8 border-t dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-6">Bank Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Bank Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="bank_name"
                  value={formData.bank_name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600"
                />
              ) : (
                <p className="text-lg">{formData.bank_name || "Not set"}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Account Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="account_name"
                  value={formData.account_name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600"
                />
              ) : (
                <p className="text-lg">{formData.account_name || "Not set"}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Account Number</label>
              {isEditing ? (
                <input
                  type="text"
                  name="account_number"
                  value={formData.account_number}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600"
                />
              ) : (
                <p className="text-lg">{formData.account_number || "Not set"}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 