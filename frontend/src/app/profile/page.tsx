// src/app/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/Layout/DashboardLayout';

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <ProfileContent />
    </DashboardLayout>
  );
}

function ProfileContent() {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    createdAt: '',
    avatar: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    username: '',
    email: '',
    avatar: ''
  });
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/sign-in');
    } else if (user) {
      const avatarUrl = user.avatar || null;
      setUserData({
        username: user.username,
        email: user.email,
        createdAt: user.created_at ? new Date(user.created_at).toLocaleDateString() : '',
        avatar: avatarUrl
      });
      setEditData({
        username: user.username,
        email: user.email,
        avatar: avatarUrl
      });
      setPreviewUrl(avatarUrl);
      setLoading(false);
    }
  }, [isAuthenticated, isLoading, user, router]);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditData({
      username: userData.username,
      email: userData.email,
      avatar: userData.avatar
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({
      username: userData.username,
      email: userData.email
    });
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    setMessage('');

    try {
      // In a real app, you would call an API to update the user profile
      // If avatar was changed, upload it first and get the URL
      let avatarUrl = userData.avatar;
      
      if (selectedAvatar) {
        // Simulate uploading avatar to server
        // In a real app, you would upload the file to your backend
        // const uploadResult = await uploadAvatar(selectedAvatar);
        // avatarUrl = uploadResult.url;
        
        // For now, we'll use the preview URL
        avatarUrl = previewUrl || userData.avatar;
      }

      // Update user profile
      // const result = await updateProfile(editData.username, editData.email, avatarUrl);

      // For now, just update the local state
      setUserData({
        ...userData,
        username: editData.username,
        email: editData.email,
        avatar: avatarUrl
      });

      setIsEditing(false);
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedAvatar(file);
      
      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        // Update editData with the new avatar URL
        setEditData(prev => ({
          ...prev,
          avatar: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-4 text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Redirect will happen via useEffect
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-xl p-6 shadow-xl">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent mb-8 text-center">
          Your Profile
        </h1>
        
        {message && (
          <div className="mb-6 p-4 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
            <p className="text-emerald-300">{message}</p>
          </div>
        )}
        
        <div className="space-y-6">
          <div className="flex flex-col items-center">
            <div className="relative group mb-4">
              <div className="bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-full w-24 h-24 flex items-center justify-center overflow-hidden">
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Profile Preview" 
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-3xl text-slate-400">
                    {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              {isEditing && (
                <div className="absolute inset-0 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <label className="cursor-pointer bg-slate-700/80 text-slate-200 rounded-full p-2">
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                    📷
                  </label>
                </div>
              )}
            </div>
            <h2 className="text-2xl font-bold text-slate-200">{userData.username}</h2>
            <p className="text-slate-400">{userData.email}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Username</label>
              {isEditing ? (
                <input
                  type="text"
                  name="username"
                  value={editData.username}
                  onChange={handleChange}
                  className="bg-slate-900/60 border border-slate-700 text-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition duration-200 w-full"
                  required
                />
              ) : (
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-slate-200">
                  {userData.username}
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleChange}
                  className="bg-slate-900/60 border border-slate-700 text-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition duration-200 w-full"
                  required
                />
              ) : (
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-slate-200">
                  {userData.email}
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Member Since</label>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-slate-200">
                {userData.createdAt || 'Unknown'}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Account Status</label>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-slate-200">
                Active
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4 mt-8">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancelEdit}
                  disabled={saving}
                  className="px-6 py-2 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveChanges}
                  disabled={saving}
                  className="px-6 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <button
                onClick={handleEditClick}
                className="px-6 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}