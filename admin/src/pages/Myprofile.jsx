import React, { useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AdminContext } from '../context/AdminContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Myprofile = () => {
  const { adminData, setAdminData, backendUrl, token } = useContext(AdminContext);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    username: adminData?.username || '',
    email: adminData?.email || '',
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(adminData?.profileImage);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (adminData?.profileImage) {
      setPreview(adminData.profileImage);
    }
  }, [adminData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    const formData = new FormData();
    formData.append('username', form.username);
    formData.append('email', form.email);
    if (image) {
      formData.append('image', image);
    }

    try {
      const res = await axios.put(`${backendUrl}/api/user/update-profile`, formData, {
        headers: {
          token,
          'Content-Type': 'multipart/form-data',
        },
      });

      setAdminData((prev) => ({
        ...prev,
        username: res.data.updatedUser.username || prev.username,
        email: res.data.updatedUser.email || prev.email,
        profileImage: res.data.updatedUser.profileImage || prev.profileImage,
      }));

      setPreview(res.data.updatedUser.profileImage);
      setEditing(false);
      toast.success('Profile updated successfully!', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (!adminData) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#07034d] to-[#1e0750]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="h-12 w-12 border-4 border-t-transparent border-purple-500 rounded-full"
      />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-[#07034d] to-[#1e0750] px-4 py-10"
    >
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-purple-500/10 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-40 h-40 rounded-full bg-blue-500/10 blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-28 h-28 rounded-full bg-indigo-500/10 blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold text-center py-8 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500"
        >
          My Profile
        </motion.h1>

        {/* Profile Section */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl p-6 mb-10 overflow-hidden"
        >
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
            {/* Profile Image Section */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="relative group">
                {preview && (
                  <motion.img
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    src={preview}
                    alt="Profile"
                    className="w-28 h-28 rounded-full border-4 border-indigo-500/80 object-cover shadow-lg group-hover:border-indigo-400 transition-all duration-300"
                  />
                )}
                <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>

              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setImage(file);
                  if (file) {
                    setPreview(URL.createObjectURL(file));
                  }
                }}
                className="hidden"
              />

              <label
                htmlFor="profile-upload"
                className="cursor-pointer bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg inline-block text-center shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                Choose Image
              </label>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={isUploading}
                className={`px-6 py-2 rounded-lg shadow-lg transition-all duration-300 ${
                  isUploading 
                    ? 'bg-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white'
                }`}
              >
                {isUploading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </span>
                ) : (
                  'Upload Image'
                )}
              </motion.button>
            </motion.div>

            {/* Profile Info Section */}
            {!editing ? (
              <motion.div 
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-4 flex-1"
              >
                <div className="space-y-2">
                  <p className="text-xl font-semibold text-white">
                    <span className="text-indigo-300 mr-2">👤</span> 
                    <span className="text-gray-300">Name:</span> 
                    <span className="ml-2 text-white">{adminData.username}</span>
                  </p>
                  <p className="text-lg text-gray-300">
                    <span className="text-indigo-300 mr-2">📧</span> 
                    <span className="text-gray-300">Email:</span> 
                    <span className="ml-2 text-white">{adminData.email}</span>
                  </p>
                  <p className="text-md text-gray-300">
                    <span className="text-indigo-300 mr-2">📈</span> 
                    <span className="text-gray-300">Submissions:</span> 
                    <span className="ml-2 text-white">{adminData.submissionsCount}</span>
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setEditing(true)}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-2.5 rounded-lg shadow-lg transition-all duration-300 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </motion.button>
              </motion.div>
            ) : (
              <motion.form 
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                onSubmit={handleSubmit} 
                className="space-y-6 w-full md:w-2/3"
              >
                <div>
                  <label className="block text-sm font-medium mb-2 text-indigo-300">Name</label>
                  <input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-indigo-300">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400 transition-all"
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white px-6 py-2.5 rounded-lg shadow-lg transition-all duration-300 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={() => setEditing(false)}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-2.5 rounded-lg shadow-lg transition-all duration-300 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel
                  </motion.button>
                </div>
              </motion.form>
            )}
          </div>
        </motion.div>

        {/* My Submissions Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500 mb-6">
            📝 My Submissions
          </h2>
          <motion.div 
            whileHover={{ scale: 1.005 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg p-6 space-y-4 transition-all duration-300"
          >
            {adminData.solvedProblems && adminData.solvedProblems.length > 0 ? (
              adminData.solvedProblems.map((prob, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center justify-between py-3 px-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-300"
                >
                  <div className="flex items-center">
                    <div className="mr-4 text-indigo-400 font-bold">{idx + 1}.</div>
                    <span className="text-white font-medium">✅ {prob.title}</span>
                  </div>
                  <div className="text-xs text-indigo-300 bg-indigo-900/30 px-2 py-1 rounded-full">
                    Solved
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center py-8"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-400 italic">
                  No submissions yet. Start solving problems to see them here!
                </p>
                <motion.a
                  href="/problems"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-lg shadow-lg transition-all duration-300"
                >
                  Browse Problems
                </motion.a>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Myprofile;