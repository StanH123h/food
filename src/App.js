// 主应用组件
import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FoodProvider } from './context/FoodContext';
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
  const [currentPage, setCurrentPage] = useState('login');
  const [largeFont, setLargeFont] = useState(false);
  const [language, setLanguage] = useState('zh');

  // 根据用户登录状态设置默认页面
  useEffect(() => {
    if (user) {
      setCurrentPage('main');
    } else {
      setCurrentPage('login');
    }
  }, [user]);

  // 页面切换函数
  const showLogin = () => setCurrentPage('login');
  const showRegister = () => setCurrentPage('register');
  const showMain = () => setCurrentPage('main');
  const showMission = () => setCurrentPage('mission');

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
    <div className={`app ${largeFont ? 'large-font' : ''}`}>
      <header>
        <h1>线上食疗食材平台</h1>
        <div className="header-controls">
          <button onClick={toggleFont}>🧓 切换大字体</button>
          <button onClick={toggleLanguage}>
            🔊 播报：<span>{language === 'zh' ? '普通话' : '粤语'}</span>
          </button>
          {user && (
            <>
              <span className="user-info">您好，{user.username} {user.isAdmin ? '(管理员)' : ''}</span>
              <button onClick={logout}>退出登录</button>
            </>
          )}
        </div>
      </header>

      {/* 导航按钮 */}
      {user && (
        <nav className="nav-buttons">
          <button 
            className={currentPage === 'main' ? 'active' : ''} 
            onClick={showMain}
          >
            主页
          </button>
          <button 
            className={currentPage === 'mission' ? 'active' : ''} 
            onClick={showMission}
          >
            打卡任务
          </button>
        </nav>
      )}

      {!user && (
        <nav className="nav-buttons">
          <button 
            className={currentPage === 'login' ? 'active' : ''} 
            onClick={showLogin}
          >
            登录
          </button>
          <button 
            className={currentPage === 'register' ? 'active' : ''} 
            onClick={showRegister}
          >
            注册
          </button>
        </nav>
      )}

      <main>
        {/* 根据当前页面显示不同组件 */}
        {currentPage === 'login' && <LoginPage onShowRegister={showRegister} />}
        {currentPage === 'register' && <RegisterPage onShowLogin={showLogin} />}
        {currentPage === 'main' && <HomePage language={language} />}
        {currentPage === 'mission' && <MissionPage />}
      </main>

      {/* 摄像头组件 - 只在登录后显示 */}
      {user && (
        <Camera 
          largeFont={largeFont} 
          onToggleLargeFont={toggleFont}
        />
      )}
    </div>
  );
}

// 主应用组件
function App() {
  return (
    <AuthProvider>
      <FoodProvider>
        <AppContent />
      </FoodProvider>
    </AuthProvider>
  );
}

export default App;
