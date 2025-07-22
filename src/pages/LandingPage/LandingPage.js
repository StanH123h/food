import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  const handleDailyMealClick = () => {
    navigate('/daily-meal');
  };

  return (
    <div className="landing-container">
      <div className="date-box">
        <div className="date-main">22</div>
        <div className="date-info">
          <div>2025/7 六月廿八·星期二</div>
          <div className="tags">宜 祭祀 恩 开渠</div>
        </div>
      </div>

      <div className="section-title">🩺 健康测一测</div>
      <div className="card">
        <div className="card-title">舌诊分析</div>
        <a className="button" href="https://www.coze.cn/store/agent/7528313732443865103?from=store_search_suggestion&bid=6gvql74h01017" target="_blank" rel="noopener noreferrer">舌象测一测</a>
      </div>

      <div className="section-title">🎉 精彩活动</div>
      <div className="activity-row">
        <div className="activity-card">
          <h3>测一测</h3>
          <p>你身体潜在得分</p>
          <a className="activity-button" href="https://www.coze.cn/store/agent/7528313732443865103?from=store_search_suggestion&bid=6gvql74h01017" target="_blank" rel="noopener noreferrer">立即参与</a>
        </div>
        <div className="activity-card">
          <h3>每日一膳</h3>
          <p>查看每日推荐饮食</p>
          <button className="activity-button" onClick={handleDailyMealClick}>立即查看</button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;