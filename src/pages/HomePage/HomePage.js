// 主页组件
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useFood } from '../../context/FoodContext';
import FoodCard from '../../components/FoodCard';
import './HomePage.css';

function HomePage({ language }) {
  const { user } = useAuth();
  const { cards, addCard, isLoading, error } = useFood();
  const [latestImageData, setLatestImageData] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    link: ''
  });

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setLatestImageData(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddCard = () => {
    if (!user?.isAdmin) {
      alert('只有管理员可以添加内容');
      return;
    }
    
    if (!latestImageData) {
      alert('请先上传图片');
      return;
    }
    
    if (!formData.title.trim()) {
      alert('请输入标题');
      return;
    }
    
    if (!formData.desc.trim()) {
      alert('请输入描述');
      return;
    }

    const newCard = {
      image: latestImageData,
      title: formData.title.trim(),
      desc: formData.desc.trim(),
      link: formData.link.trim()
    };

    addCard(newCard);

    // 重置表单
    setFormData({ title: '', desc: '', link: '' });
    setLatestImageData(null);
    // 重置文件输入框
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  if (isLoading) {
    return <div className="loading">加载食材数据中...</div>;
  }

  return (
    <div className="home-page">
      {/* 管理员添加内容区域 */}
      {user?.isAdmin && (
        <div className="admin-controls">
          <h3>添加食材</h3>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload}
            className="file-input"
          />
          <input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="输入标题..."
            className="form-input"
          />
          <textarea
            name="desc"
            value={formData.desc}
            onChange={handleInputChange}
            placeholder="输入描述..."
            className="form-textarea"
          />
          <input
            name="link"
            value={formData.link}
            onChange={handleInputChange}
            placeholder="输入产品购买链接..."
            className="form-input"
          />
          <button onClick={handleAddCard} className="add-btn">
            添加食材卡片
          </button>
        </div>
      )}

      {/* 错误提示 */}
      {error && <div className="error-message">{error}</div>}

      {/* 食材卡片列表 */}
      <div className="card-container">
        {cards.length === 0 ? (
          <div className="no-cards">暂无食材数据</div>
        ) : (
          cards.map((card, index) => (
            <FoodCard 
              key={index} 
              card={card} 
              index={index} 
              language={language}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default HomePage;