// 登录页面组件
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './LoginPage.css';

function LoginPage({ onShowRegister }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const { login, error } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.username.trim(), formData.password.trim());
    } catch (error) {
      // 错误已经通过context处理
    }
  };

  return (
    <section className="auth-section">
      <h2>👤 用户登录</h2>
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
          autoComplete="current-password"
          required
        />
        <div className="button-group">
          <button type="submit">登录</button>
          <button type="button" onClick={onShowRegister}>注册</button>
        </div>
        {error && <p className="error-message">{error}</p>}
      </form>
    </section>
  );
}

export default LoginPage;