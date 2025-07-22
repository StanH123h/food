// 摄像头Hook
import { useState, useRef, useEffect } from 'react';

export function useCamera() {
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const videoRef = useRef(null);

  // 检查摄像头权限
  const checkCameraPermission = async () => {
    if (!navigator.permissions) {
      return 'unavailable';
    }
    
    try {
      const result = await navigator.permissions.query({ name: 'camera' });
      return result.state; // 'granted', 'denied', 'prompt'
    } catch (err) {
      console.log('权限查询不支持:', err);
      return 'unavailable';
    }
  };

  // 启动摄像头
  const startCamera = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 检查权限状态
      const permissionState = await checkCameraPermission();
      console.log('摄像头权限状态:', permissionState);
      
      if (permissionState === 'denied') {
        throw new Error('摄像头权限被拒绝。请在浏览器设置中允许此网站访问摄像头，然后刷新页面。');
      }

      // 检查浏览器支持
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('您的浏览器不支持摄像头功能，请使用Chrome/Firefox/Safari等现代浏览器');
      }

      // 检查HTTPS或localhost
      const isSecure = window.location.protocol === 'https:' || 
                      window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';
      if (!isSecure) {
        console.warn('摄像头需要在HTTPS环境或localhost下才能使用');
      }

      // 获取摄像头流
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'  // 前置摄像头
        }
      });

      setStream(mediaStream);
      setHasPermission(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      console.log('摄像头启动成功');
    } catch (err) {
      let errorMsg = '摄像头启动失败：';
      
      switch(err.name) {
        case 'NotAllowedError':
          errorMsg += '用户拒绝了摄像头权限。请点击地址栏左侧的摄像头图标，允许访问摄像头。';
          setHasPermission(false);
          break;
        case 'NotFoundError':
          errorMsg += '未找到摄像头设备。请确保您的设备有摄像头并且驱动正常。';
          break;
        case 'NotReadableError':
          errorMsg += '摄像头被其他应用占用。请关闭其他使用摄像头的程序后刷新页面。';
          break;
        case 'OverconstrainedError':
          errorMsg += '摄像头不支持请求的分辨率。';
          break;
        case 'SecurityError':
          errorMsg += '安全错误，请确保在HTTPS或localhost环境下访问。';
          break;
        default:
          errorMsg += err.message || '未知错误';
      }
      
      setError(errorMsg);
      console.error('摄像头错误详情:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 停止摄像头
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // 组件卸载时清理资源
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return {
    videoRef,
    stream,
    error,
    isLoading,
    hasPermission,
    startCamera,
    stopCamera
  };
}