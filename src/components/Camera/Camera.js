// 摄像头组件
import React, { useState, useEffect } from 'react';
import { useCamera } from '../../hooks/useCamera';
import { useFaceDetection } from '../../hooks/useFaceDetection';
import './Camera.css';

function Camera({ largeFont, onToggleLargeFont }) {
  const [visible, setVisible] = useState(true);
  const [smallSize, setSmallSize] = useState(false);
  const { videoRef, stream, error, startCamera, stopCamera } = useCamera();
  
  // 启用人脸检测（在大字体模式下禁用）
  const faceDetectionEnabled = !largeFont;
  useFaceDetection(videoRef.current, faceDetectionEnabled);

  // 监听大字体切换事件
  useEffect(() => {
    const handleToggleLargeFont = () => {
      onToggleLargeFont();
    };

    window.addEventListener('toggleLargeFont', handleToggleLargeFont);
    return () => {
      window.removeEventListener('toggleLargeFont', handleToggleLargeFont);
    };
  }, [onToggleLargeFont]);

  // 组件挂载时启动摄像头
  useEffect(() => {
    startCamera();
    return stopCamera;
  }, []);

  // 切换显示/隐藏
  const toggleVisibility = () => {
    setVisible(!visible);
  };

  // 切换大小
  const toggleSize = () => {
    setSmallSize(!smallSize);
  };

  if (error) {
    return (
      <div className="camera-error">
        <div className="error-content">
          <p>摄像头错误</p>
          <button onClick={startCamera}>重试</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <video
        ref={videoRef}
        className={`camera-feed ${smallSize ? 'small' : ''} ${!visible ? 'hidden' : ''}`}
        autoPlay
        muted
        playsInline
      />
      <div className="camera-controls">
        <button onClick={toggleVisibility}>
          {visible ? '隐藏摄像头' : '显示摄像头'}
        </button>
        <button onClick={toggleSize}>
          {smallSize ? '放大' : '缩小'}
        </button>
      </div>
    </>
  );
}

export default Camera;