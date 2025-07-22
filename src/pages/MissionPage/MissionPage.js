// 任务页面组件
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { missionService } from '../../services/mission';
import './MissionPage.css';

function MissionPage() {
  const { user } = useAuth();
  const [checkinStatus, setCheckinStatus] = useState('');
  const [totalPoints, setTotalPoints] = useState(0);
  const [weekCheckinCount, setWeekCheckinCount] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  // 更新页面数据
  const updateMissionData = () => {
    if (!user) {
      setCheckinStatus('请先登录以使用打卡功能');
      setTotalPoints(0);
      setWeekCheckinCount(0);
      setLeaderboard([]);
      setIsCheckedIn(false);
      return;
    }

    const username = user.username;
    const todayCheckedIn = missionService.isTodayCheckedIn(username);
    
    setIsCheckedIn(todayCheckedIn);
    setCheckinStatus(todayCheckedIn ? '您今天已经签到过了' : '');
    setTotalPoints(missionService.getUserPoints(username));
    setWeekCheckinCount(missionService.getWeekCheckinCount(username));
    setLeaderboard(missionService.getLeaderboard());
  };

  // 页面加载和用户变化时更新数据
  useEffect(() => {
    updateMissionData();
  }, [user]);

  // 签到操作
  const handleCheckIn = async () => {
    if (!user) {
      alert('请先登录后再签到');
      return;
    }

    try {
      const result = missionService.checkIn(user.username);
      alert(result.message);
      updateMissionData();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="mission-page">
      <h2>📅 食疗打卡任务</h2>
      
      <div className="checkin-section">
        <button 
          className="checkin-btn"
          onClick={handleCheckIn}
          disabled={!user || isCheckedIn}
        >
          ✅ 今日签到
        </button>
        {checkinStatus && <span className="checkin-status">{checkinStatus}</span>}
      </div>

      <div className="stats-section">
        <div className="stat-item">
          <span className="stat-label">🎯 累计积分：</span>
          <span className="stat-value">{totalPoints}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">🏅 本周打卡次数：</span>
          <span className="stat-value">{weekCheckinCount}</span>
        </div>
      </div>

      <div className="leaderboard-section">
        <h3>👑 年度排行榜</h3>
        <p className="leaderboard-note">（前3名可获永久体验卡）</p>
        
        {leaderboard.length === 0 ? (
          <div className="no-data">暂无排行榜数据</div>
        ) : (
          <ol className="leaderboard">
            {leaderboard.slice(0, 10).map((user, index) => (
              <li key={user.name} className={`leaderboard-item rank-${index + 1}`}>
                <span className="user-name">{user.name}</span>
                <span className="user-points">{user.points} 分</span>
              </li>
            ))}
          </ol>
        )}
      </div>

      <div className="rewards-section">
        <p>🎁 积分兑换：<a href="#" className="rewards-link">点此进入兑换页</a></p>
      </div>
    </div>
  );
}

export default MissionPage;