// 人脸识别API服务
import * as faceapi from 'face-api.js';
import { FACE_DETECTION_CONFIG } from '../utils/constants';

export const faceApiService = {
  isModelLoaded: false,

  // 加载人脸识别模型
  async loadModels() {
    if (this.isModelLoaded) return;
    
    try {
      await faceapi.nets.tinyFaceDetector.loadFromUri(FACE_DETECTION_CONFIG.MODEL_URL);
      this.isModelLoaded = true;
      console.log('人脸识别模型加载成功');
    } catch (error) {
      console.error('人脸识别模型加载失败:', error);
      throw new Error('人脸识别模型加载失败');
    }
  },

  // 检测人脸
  async detectFaces(video) {
    if (!this.isModelLoaded) {
      await this.loadModels();
    }
    
    const options = new faceapi.TinyFaceDetectorOptions();
    return await faceapi.detectAllFaces(video, options);
  },

  // 计算人脸面积
  calculateFaceArea(detection) {
    const box = detection.box;
    return box.width * box.height;
  },

  // 判断是否需要提示切换大字体
  shouldPromptLargeFont(detections) {
    if (detections.length === 0) return false;
    
    const faceArea = this.calculateFaceArea(detections[0]);
    return faceArea > FACE_DETECTION_CONFIG.FACE_AREA_THRESHOLD;
  }
};