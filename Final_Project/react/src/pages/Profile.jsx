import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { changePassword, clearError, deleteAccount, getUserProfile, updateProfile } from '../store/authSlice';
import { getUserPredictions } from '../store/predictionSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);
  const { predictions } = useSelector((state) => state.prediction);
  
  // Modal states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Form states
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [editForm, setEditForm] = useState({
    username: user?.username || '',
    email: user?.email || ''
  });

  useEffect(() => {
    dispatch(getUserProfile());
    dispatch(getUserPredictions());
  }, [dispatch]);
  
  // Handle auth errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);
  
  useEffect(() => {
    if (user) {
      setEditForm({
        username: user.username || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getPerformanceColor = (performance) => {
    const colors = {
      'High': 'bg-green-100 text-green-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'Low': 'bg-red-100 text-red-800',
    };
    return colors[performance] || 'bg-gray-100 text-gray-800';
  };
  
  // Handler functions
  const handleEditProfile = async (e) => {
    e.preventDefault();
    if (editForm.username.trim() === '' || editForm.email.trim() === '') {
      toast.error('Username and email are required');
      return;
    }
    
    try {
      const result = await dispatch(updateProfile({
        username: editForm.username.trim(),
        email: editForm.email.trim()
      }));
      
      if (result.meta.requestStatus === 'fulfilled') {
        toast.success('Profile updated successfully!');
        setShowEditModal(false);
      }
    } catch (error) {
      console.error('Update profile error:', error);
    }
  };
  
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (passwordForm.currentPassword.trim() === '' || passwordForm.newPassword.trim() === '') {
      toast.error('All password fields are required');
      return;
    }
    
    try {
      const result = await dispatch(changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      }));
      
      if (result.meta.requestStatus === 'fulfilled') {
        toast.success('Password changed successfully!');
        setShowPasswordModal(false);
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      console.error('Change password error:', error);
    }
  };
  
  const handleDeleteAccount = async () => {
    try {
      const result = await dispatch(deleteAccount());
      
      if (result.meta.requestStatus === 'fulfilled') {
        toast.success('Account deleted successfully');
        setShowDeleteModal(false);
        // Redirect to login page after successful deletion
        navigate('/login');
      }
    } catch (error) {
      console.error('Delete account error:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-gradient p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-5 rounded-full -translate-x-12 translate-y-12"></div>
        <div className="relative z-10 flex items-center space-x-4">
          <div className="p-2 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
            <span className="text-2xl">👤</span>
          </div>
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-white">Your Profile</h1>
            <p className="text-blue-100 mt-1 text-xs lg:text-sm">
              Manage your account and view your prediction activity
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="card p-8">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mr-3">
              <span className="text-white text-sm">✏️</span>
            </div>
            <h2 className="text-lg lg:text-xl font-bold text-gray-800">Edit Profile</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl transform hover:scale-105 transition-transform">
                <span className="text-4xl">👤</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4">
              <label className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">Username</label>
              <p className="text-base  font-bold text-gray-900">{user?.username}</p>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4">
              <label className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">Email Address</label>
              <p className="text-base  text-gray-900">{user?.email}</p>
            </div>


            <div className="pt-6 border-t border-gray-200">
              <button 
                onClick={() => setShowEditModal(true)}
                className="btn-primary w-full"
              >
                ✨ Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Activity Summary */}
        <div className="lg:col-span-2 card p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg mr-3">
                <span className="text-white text-sm">📈</span>
              </div>
              <h2 className="text-lg lg:text-xl font-bold text-gray-800">Activity Summary</h2>
            </div>
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
              {predictions.length} Total Predictions
            </span>
          </div>

          {predictions.length > 0 ? (
            <div className="space-y-6 max-h-96 overflow-y-auto">
              {predictions.map((prediction, index) => (
                <div key={index} className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`performance-${prediction.prediction.toLowerCase()} text-sm px-4 py-2`}>
                      {prediction.prediction === 'High' ? '🎉' : 
                       prediction.prediction === 'Medium' ? '📈' : '📉'} {prediction.prediction} Performance
                    </span>
                    <span className="text-sm text-gray-500 font-medium">
                      {formatDate(prediction.timestamp)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div className="bg-white rounded-lg p-3 text-center">
                      <span className="block font-bold text-gray-600">🧮 Math</span>
                      <span className="text-lg lg:text-xl font-bold text-gray-900">{prediction.input_data['math score']}</span>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <span className="block font-bold text-gray-600">📖 Reading</span>
                      <span className="text-lg lg:text-xl font-bold text-gray-900">{prediction.input_data['reading score']}</span>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <span className="block font-bold text-gray-600">✍️ Writing</span>
                      <span className="text-lg lg:text-xl font-bold text-gray-900">{prediction.input_data['writing score']}</span>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <span className="block font-bold text-gray-600">🎯 Confidence</span>
                      <span className="text-lg lg:text-xl font-bold text-gray-900">{(prediction.confidence * 100).toFixed(1)}%</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 text-sm">
                    <p className="text-gray-700">
                      <span className="font-bold">📋 Background:</span> {prediction.input_data.gender}, {prediction.input_data['parental level of education']}, {prediction.input_data.lunch} lunch, {prediction.input_data['test preparation course']} test prep
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">📊</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No predictions yet</h3>
              <p className="text-lg">Start by making your first AI-powered prediction!</p>
            </div>
          )}
        </div>
      </div>

      {/* Account Actions */}
      <div className="card p-8">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg mr-3">
            <span className="text-white text-sm">🔒</span>
          </div>
          <h2 className="text-lg lg:text-xl font-bold text-gray-800">Security & Account</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button 
            onClick={() => setShowPasswordModal(true)}
            className="group p-6 border-2 border-gray-300 rounded-2xl hover:border-blue-500 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-xl transition-shadow">
                <span className="text-2xl">🔒</span>
              </div>
              <p className="font-bold text-gray-800 group-hover:text-blue-800 text-lg">Change Password</p>
              <p className="text-gray-600 mt-2">Update your security credentials</p>
            </div>
          </button>

          <button 
            onClick={() => setShowDeleteModal(true)}
            className="group p-6 border-2 border-red-300 rounded-2xl hover:border-red-500 hover:bg-gradient-to-br hover:from-red-50 hover:to-pink-50 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 text-red-600"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-xl transition-shadow">
                <span className="text-2xl">🗑️</span>
              </div>
              <p className="font-bold group-hover:text-red-800 text-lg">Delete Account</p>
              <p className="text-red-500 mt-2">Permanently remove account</p>
            </div>
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">✨ Edit Profile</h3>
            <form onSubmit={handleEditProfile} className="space-y-4">
              <div>
                <label className="form-label">Username</label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="form-label">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              <div className="flex space-x-4 pt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn-primary flex-1"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    'Save Changes'
                  )}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowEditModal(false)}
                  className="btn-secondary flex-1"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">🔒 Change Password</h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  className="form-input"
                  required
                  minLength="6"
                />
              </div>
              <div>
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                  className="form-input"
                  required
                  minLength="6"
                />
              </div>
              <div className="flex space-x-4 pt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn-primary flex-1"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </span>
                  ) : (
                    'Update Password'
                  )}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowPasswordModal(false)}
                  className="btn-secondary flex-1"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-2xl font-bold text-red-800 mb-6">🗑️ Delete Account</h3>
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete your account? This action cannot be undone and will permanently remove:
              </p>
              <ul className="text-gray-600 text-sm space-y-1 list-disc list-inside">
                <li>Your profile information</li>
                <li>All prediction history</li>
                <li>Account settings and preferences</li>
              </ul>
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={handleDeleteAccount}
                disabled={loading}
                className="btn-danger flex-1"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </span>
                ) : (
                  'Delete Account'
                )}
              </button>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="btn-secondary flex-1"
                disabled={loading}
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

export default Profile;