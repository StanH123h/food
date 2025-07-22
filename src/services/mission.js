// 签到任务服务
import { storageService } from './storage';
import { getMonday } from '../utils/helpers';

export const missionService = {
  // 判断今天是否已签到
  isTodayCheckedIn(username) {
    const checkinDates = storageService.getCheckinDates(username);
    const todayStr = new Date().toISOString().slice(0, 10);
    return checkinDates.includes(todayStr);
  },

  // 签到操作
  checkIn(username) {
    if (!username || username === '游客') {
      throw new Error('请先登录后再签到');
    }

    if (this.isTodayCheckedIn(username)) {
      throw new Error('您今天已经签到过了！');
    }

    const todayStr = new Date().toISOString().slice(0, 10);
    
    // 更新签到日期
    const checkinDates = storageService.getCheckinDates(username);
    checkinDates.push(todayStr);
    storageService.setCheckinDates(username, checkinDates);

    // 积分+10
    const currentPoints = storageService.getUserPoints(username);
    const newPoints = currentPoints + 10;
    storageService.setUserPoints(username, newPoints);

    // 更新排行榜
    this.updateLeaderboard(username, newPoints);

    return { points: newPoints, message: '签到成功！积分+10' };
  },

  // 更新排行榜
  updateLeaderboard(username, points) {
    let leaderboard = storageService.getLeaderboard();
    let userRecord = leaderboard.find(u => u.name === username);
    
    if (!userRecord) {
      userRecord = { name: username, points: 0 };
      leaderboard.push(userRecord);
    }
    
    userRecord.points = points;
    leaderboard.sort((a, b) => b.points - a.points);
    storageService.setLeaderboard(leaderboard);
  },

  // 获取本周签到次数
  getWeekCheckinCount(username) {
    const checkinDates = storageService.getCheckinDates(username);
    const monday = getMonday(new Date());
    return checkinDates.filter(dateStr => new Date(dateStr) >= monday).length;
  },

  // 获取用户积分
  getUserPoints(username) {
    return storageService.getUserPoints(username);
  },

  // 获取排行榜
  getLeaderboard() {
    return storageService.getLeaderboard();
  }
};