// 人脸检测Hook
import { useState, useEffect, useRef } from 'react';
import { faceApiService } from '../../services/faceApi';
import { FACE_DETECTION_CONFIG } from '../../utils/constants';

export function useFaceDetection(video, enabled = true) {
  const [lastPromptTime, setLastPromptTime] = useState(0);
  const [isDetecting, setIsDetecting] = useState(false);
  const intervalRef = useRef(null);

  // 开始人脸检测
  const startDetection = async () => {
    if (!video || !enabled || isDetecting) return;
    
    try {
      await faceApiService.loadModels();
      setIsDetecting(true);
      
      intervalRef.current = setInterval(async () => {
        try {
          const detections = await faceApiService.detectFaces(video);
          
          if (detections.length > 0) {
            const now = Date.now();
            const faceArea = faceApiService.calculateFaceArea(detections[0]);
            
            console.log(`人脸面积: ${faceArea.toFixed(0)}`);
            
            if (faceApiService.shouldPromptLargeFont(detections) && 
                now - lastPromptTime > FACE_DETECTION_CONFIG.PROMPT_INTERVAL) {
              setLastPromptTime(now);
              
              const confirmSwitch = window.confirm('检测到您距离屏幕较近，是否切换大字体模式？');
              if (confirmSwitch) {
                // 触发大字体切换事件
                const event = new CustomEvent('toggleLargeFont');
                window.dispatchEvent(event);
              }
            }
          }
        } catch (error) {
          console.error('人脸检测错误:', error);
        }
      }, 1000);
    } catch (error) {
      console.error('启动人脸检测失败:', error);
    }
  };

  // 停止人脸检测
  const stopDetection = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsDetecting(false);
  };

  // 当video或enabled状态改变时重新启动检测
  useEffect(() => {
    if (video && enabled) {
      startDetection();
    } else {
      stopDetection();
    }

    return stopDetection;
  }, [video, enabled]);

  // 组件卸载时清理
  useEffect(() => {
    return stopDetection;
  }, []);

  return {
    isDetecting,
    startDetection,
    stopDetection
  };
}