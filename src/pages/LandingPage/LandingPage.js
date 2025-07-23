import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  const handleDailyMealClick = () => {
    navigate('/daily-meal');
  };

  // 获取当前日期信息
  const getCurrentDateInfo = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekday = weekdays[now.getDay()];
    
    // 农历转换（简化版，实际应用建议使用专门的农历库）
    const lunarMonths = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    const lunarDays = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
                      '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
                      '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];
    
    // 这里使用近似算法，实际应用建议使用准确的农历转换库
    const lunarMonth = lunarMonths[(month - 1 + 11) % 12];
    const lunarDay = lunarDays[(day - 1) % 30];
    
    return {
      day,
      dateString: `${year}/${month} ${lunarMonth}${lunarDay}·${weekday}`
    };
  };

  const dateInfo = getCurrentDateInfo();

  return (
    <div className="landing-container">
      <div className="date-box">
        <div className="date-main">{dateInfo.day}</div>
        <div className="date-info">
          <div>{dateInfo.dateString}</div>
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