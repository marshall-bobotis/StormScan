import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Profile.css';

const Profile = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.userId, newPassword }),
      });
      if (!response.ok) {
        throw new Error('Failed to change password');
      }
      setSuccess('Password changed successfully');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const response = await fetch('/api/delete-account', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.userId }),
        });
        if (!response.ok) {
          throw new Error('Failed to delete account');
        }
        localStorage.removeItem('user');
        navigate('/');
      } catch (error) {
        setError(error.message);
      }
    }
  };

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <p>Email: {user.email}</p>
      <form onSubmit={handlePasswordChange}>
        <h2>Change Password</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Change Password</button>
      </form>
      <button onClick={handleDeleteAccount} className="delete-account-btn">Delete Account</button>
    </div>
  );
};

export default Profile;
