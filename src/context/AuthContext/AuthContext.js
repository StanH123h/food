// 用户认证上下文
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../../services/auth';

const AuthContext = createContext();

// 认证状态初始值
const initialState = {
  user: null,
  isLoading: true,
  error: null
};

// 认证状态reducer
function authReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'LOGOUT':
      return { ...state, user: null, error: null };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // 初始化认证状态
  useEffect(() => {
    async function init() {
      try {
        await authService.initAdminAccount();
        const user = authService.getCurrentUser();
        dispatch({ type: 'SET_USER', payload: user });
      } catch (error) {
        console.error('认证初始化失败:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }
    init();
  }, []);

  // 登录
  const login = async (username, password) => {
    try {
      dispatch({ type: 'CLEAR_ERROR' });
      const result = await authService.login(username, password);
      dispatch({ type: 'SET_USER', payload: result.user });
      return result;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  // 注册
  const register = async (username, password) => {
    try {
      dispatch({ type: 'CLEAR_ERROR' });
      const result = await authService.register(username, password);
      return result;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  // 登出
  const logout = () => {
    authService.logout();
    dispatch({ type: 'LOGOUT' });
  };

  // 清除错误
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    user: state.user,
    isLoading: state.isLoading,
    error: state.error,
    login,
    register,
    logout,
    clearError,
    isLoggedIn: !!state.user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};