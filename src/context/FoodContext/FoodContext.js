// 食材管理上下文
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { storageService } from '../../services/storage';
import { speak } from '../../utils/helpers';

const FoodContext = createContext();

// 食材状态初始值
const initialState = {
  cards: [],
  isLoading: true,
  error: null
};

// 食材状态reducer
function foodReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_CARDS':
      return { ...state, cards: action.payload, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'ADD_CARD':
      return { ...state, cards: [...state.cards, action.payload] };
    case 'UPDATE_CARD':
      return {
        ...state,
        cards: state.cards.map((card, index) =>
          index === action.payload.index ? { ...card, ...action.payload.updates } : card
        )
      };
    case 'DELETE_CARD':
      return {
        ...state,
        cards: state.cards.filter((_, index) => index !== action.payload)
      };
    default:
      return state;
  }
}

export function FoodProvider({ children }) {
  const [state, dispatch] = useReducer(foodReducer, initialState);

  // 初始化食材数据
  useEffect(() => {
    try {
      const cards = storageService.getGlobalCards();
      dispatch({ type: 'SET_CARDS', payload: cards });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '加载食材数据失败' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // 添加食材卡片
  const addCard = (cardData) => {
    try {
      const newCards = [...state.cards, cardData];
      storageService.setGlobalCards(newCards);
      dispatch({ type: 'ADD_CARD', payload: cardData });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '添加食材失败' });
    }
  };

  // 更新食材卡片
  const updateCard = (index, updates) => {
    try {
      const newCards = [...state.cards];
      newCards[index] = { ...newCards[index], ...updates };
      storageService.setGlobalCards(newCards);
      dispatch({ type: 'UPDATE_CARD', payload: { index, updates } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '更新食材失败' });
    }
  };

  // 删除食材卡片
  const deleteCard = (index) => {
    try {
      const newCards = state.cards.filter((_, i) => i !== index);
      storageService.setGlobalCards(newCards);
      dispatch({ type: 'DELETE_CARD', payload: index });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '删除食材失败' });
    }
  };

  // 播报食材信息
  const speakCard = (card, language = 'zh') => {
    const text = `${card.title}，${card.desc}`;
    speak(text, language);
  };

  const value = {
    cards: state.cards,
    isLoading: state.isLoading,
    error: state.error,
    addCard,
    updateCard,
    deleteCard,
    speakCard
  };

  return <FoodContext.Provider value={value}>{children}</FoodContext.Provider>;
}

export const useFood = () => {
  const context = useContext(FoodContext);
  if (context === undefined) {
    throw new Error('useFood must be used within a FoodProvider');
  }
  return context;
};