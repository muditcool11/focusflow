import React, { useEffect, useState } from 'react';
import { authClient } from '../services/apiClient';
import Header from '../components/Header';

export default function MyProfile() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({ username: '', email: '' });
  const [email, setEmail] = useState('');
  const [emailSaving, setEmailSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alert, setAlert] = useState(null); // { type: 'success'|'danger', message }

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await authClient.get('/me');
        if (!mounted) return;
        const data = res.data;
        setUser({ username: data.username || data.sub || '', email: data.email || '' });
        setEmail(data.email || '');
      } catch (err) {
        // authClient interceptor will handle 401 redirect. Show message for others.
        setAlert({ type: 'danger', message: err?.response?.data?.error || err?.message || 'Failed to load profile' });
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, []);

  async function handleEmailUpdate(e) {
    e.preventDefault();
    setAlert(null);
    setEmailSaving(true);
    try {
      await authClient.put('/update-email', { newEmail: email });
      setUser((u) => ({ ...u, email }));
      setAlert({ type: 'success', message: 'Email updated successfully' });
    } catch (err) {
      setAlert({ type: 'danger', message: err?.response?.data?.error || err?.response?.data?.message || 'Failed to update email' });
    } finally {
      setEmailSaving(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setAlert(null);
    if (!oldPassword || !newPassword) {
      setAlert({ type: 'danger', message: 'Please fill all password fields' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setAlert({ type: 'danger', message: 'New password and confirmation do not match' });
      return;
    }

    setPasswordSaving(true);
    try {
      await authClient.put('/change-password', { oldPassword, newPassword });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setAlert({ type: 'success', message: 'Password changed successfully' });
    } catch (err) {
      setAlert({ type: 'danger', message: err?.response?.data?.error || err?.response?.data?.message || 'Failed to change password' });
    } finally {
      setPasswordSaving(false);
    }
  }

  return (
    <>
      <Header />
      <div className="container my-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title mb-3">My Profile</h4>

                {alert && (
                  <div className={`alert alert-${alert.type}`} role="alert">{alert.message}</div>
                )}

                {loading ? (
                  <div className="text-muted">Loading profile...</div>
                ) : (
                  <div>
                    <div className="mb-4">
                      <label className="form-label">Username</label>
                      <input className="form-control" value={user.username} readOnly />
                    </div>

                    <form onSubmit={handleEmailUpdate} className="mb-4">
                      <h6>Update Email</h6>
                      <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                      </div>
                      <div>
                        <button className="btn btn-primary" type="submit" disabled={emailSaving}>{emailSaving ? 'Saving...' : 'Save Email'}</button>
                      </div>
                    </form>

                    <form onSubmit={handleChangePassword}>
                      <h6>Change Password</h6>
                      <div className="mb-3">
                        <label className="form-label">Old Password</label>
                        <input type="password" className="form-control" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">New Password</label>
                        <input type="password" className="form-control" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Confirm New Password</label>
                        <input type="password" className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                      </div>
                      <div>
                        <button className="btn btn-warning" type="submit" disabled={passwordSaving}>{passwordSaving ? 'Saving...' : 'Change Password'}</button>
                      </div>
                    </form>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
