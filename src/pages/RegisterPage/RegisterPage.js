// 注册页面组件
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './RegisterPage.css';

function RegisterPage({ onShowLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [success, setSuccess] = useState('');
  const { register, error, clearError } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) clearError();
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await register(formData.username.trim(), formData.password.trim());
      setSuccess(result.message);
      setTimeout(() => {
        onShowLogin();
        setFormData({ username: formData.username, password: '' });
        setSuccess('');
      }, 1500);
    } catch (error) {
      // 错误已经通过context处理
    }
  };

  return (
    <section className="auth-section">
      <h2>📝 用户注册</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="用户名"
          autoComplete="username"
          required
        />
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="密码"
          autoComplete="new-password"
          required
        />
        <div className="button-group">
          <button type="submit">注册</button>
          <button type="button" onClick={onShowLogin}>返回登录</button>
        </div>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </form>
    </section>
  );
}

export default RegisterPage;