// 食材卡片组件
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useFood } from '../../context/FoodContext';
import './FoodCard.css';

function FoodCard({ card, index, language }) {
  const { user } = useAuth();
  const { updateCard, deleteCard, speakCard } = useFood();

  const handleEdit = () => {
    const newTitle = prompt('修改标题', card.title);
    if (newTitle === null) return;
    const newDesc = prompt('修改描述', card.desc);
    if (newDesc === null) return;
    const newLink = prompt('修改购买链接', card.link || '');
    if (newLink === null) return;

    updateCard(index, {
      title: newTitle.trim(),
      desc: newDesc.trim(),
      link: newLink.trim()
    });
  };

  const handleDelete = () => {
    if (window.confirm('确认删除该卡片吗？')) {
      deleteCard(index);
    }
  };

  const handleSpeak = () => {
    speakCard(card, language);
  };

  return (
    <div className="food-card">
      <img src={card.image} alt="食材图片" />
      <h3>{card.title}</h3>
      <p>{card.desc}</p>
      
      <button className="speak-btn" onClick={handleSpeak}>
        🔊 播报文字
      </button>

      {user?.isAdmin && (
        <>
          <button className="edit-btn" onClick={handleEdit}>
            编辑
          </button>
          <button className="delete-btn" onClick={handleDelete}>
            删除
          </button>
        </>
      )}

      {card.link && (
        <a 
          href={card.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="buy-link"
        >
          购买链接
        </a>
      )}
    </div>
  );
}

export default FoodCard;