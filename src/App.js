// 主应用组件
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FoodProvider } from './context/FoodContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import MissionPage from './pages/MissionPage';
import Camera from './components/Camera';
import { diagnostics } from './utils/diagnostics';
import './App.css';

// 主应用内容组件
function AppContent() {
  const { user, isLoading, logout } = useAuth();
  const [largeFont, setLargeFont] = useState(false);
  const [language, setLanguage] = useState('zh');

  // 字体切换
  const toggleFont = () => setLargeFont(!largeFont);

  // 语言切换
  const toggleLanguage = () => {
    setLanguage(lang => lang === 'zh' ? 'yue' : 'zh');
  };

  if (isLoading) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <Routes>
      {/* 首页路由 - 不需要登录 */}
      <Route path="/" element={<LandingPage />} />
      
      {/* 登录注册路由 */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* 需要登录的路由 */}
      <Route path="/daily-meal" element={
        user ? (
          <div className={`app ${largeFont ? 'large-font' : ''}`}>
            <header>
              <h1>线上食疗食材平台</h1>
              <div className="header-controls">
                <button onClick={toggleFont}>🧓 切换大字体</button>
                <button onClick={toggleLanguage}>
                  🔊 播报：<span>{language === 'zh' ? '普通话' : '粤语'}</span>
                </button>
                <span className="user-info">您好，{user.username} {user.isAdmin ? '(管理员)' : ''}</span>
                <button onClick={logout}>退出登录</button>
              </div>
            </header>
            <main>
              <HomePage language={language} />
            </main>
            <Camera 
              largeFont={largeFont} 
              onToggleLargeFont={toggleFont}
            />
          </div>
        ) : (
          <Navigate to="/login" replace />
        )
      } />
      
      <Route path="/mission" element={
        user ? (
          <div className={`app ${largeFont ? 'large-font' : ''}`}>
            <header>
              <h1>线上食疗食材平台</h1>
              <div className="header-controls">
                <button onClick={toggleFont}>🧓 切换大字体</button>
                <button onClick={toggleLanguage}>
                  🔊 播报：<span>{language === 'zh' ? '普通话' : '粤语'}</span>
                </button>
                <span className="user-info">您好，{user.username} {user.isAdmin ? '(管理员)' : ''}</span>
                <button onClick={logout}>退出登录</button>
              </div>
            </header>
            <main>
              <MissionPage />
            </main>
            <Camera 
              largeFont={largeFont} 
              onToggleLargeFont={toggleFont}
            />
          </div>
        ) : (
          <Navigate to="/login" replace />
        )
      } />
    </Routes>
  );
}

// 主应用组件
function App() {
  return (
    <Router>
      <AuthProvider>
        <FoodProvider>
          <AppContent />
        </FoodProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
