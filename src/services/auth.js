// 用户认证服务
import { sha256, isAdmin } from '../utils/helpers';
import { storageService } from './storage';
import { ADMIN_USERNAME } from '../utils/constants';

export const authService = {
  // 初始化管理员账号
  async initAdminAccount() {
    if (!storageService.getUser(ADMIN_USERNAME)) {
      const passHash = await sha256('123456swh');
      storageService.setUser(ADMIN_USERNAME, { passwordHash: passHash });
    }
  },

  // 用户注册
  async register(username, password) {
    if (!username || !password) {
      throw new Error('用户名和密码不能为空');
    }
    
    if (username === ADMIN_USERNAME) {
      throw new Error('此用户名为保留管理员账号，不能注册');
    }
    
    if (storageService.getUser(username)) {
      throw new Error('该用户名已被注册');
    }

    const hash = await sha256(password);
    storageService.setUser(username, { passwordHash: hash });
    
    return { success: true, message: '注册成功！请登录' };
  },

  // 用户登录
  async login(username, password) {
    if (!username || !password) {
      throw new Error('请输入用户名和密码');
    }

    const userData = storageService.getUser(username);
    if (!userData) {
      throw new Error('❌ 账号不存在，请先注册');
    }

    const hash = await sha256(password);
    if (hash !== userData.passwordHash) {
      throw new Error('❌ 密码错误');
    }

    storageService.setCurrentUser(username);
    return {
      success: true,
      user: {
        username,
        isAdmin: isAdmin(username)
      }
    };
  },

  // 用户登出
  logout() {
    storageService.removeCurrentUser();
  },

  // 获取当前用户信息
  getCurrentUser() {
    const username = storageService.getCurrentUser();
    if (username === '游客') return null;
    
    return {
      username,
      isAdmin: isAdmin(username)
    };
  },

  // 检查是否已登录
  isLoggedIn() {
    const username = storageService.getCurrentUser();
    return username && username !== '游客';
  }
};