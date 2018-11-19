# wx-cropper
微信小程序基于canvas的图片裁剪组件

## 演示：支持缩放拖动截取图片

![Image text](https://raw.githubusercontent.com/Jeffery520/wx-cropper/master/screenshots/20180302150454.jpg)

![Image text](https://raw.githubusercontent.com/Jeffery520/wx-cropper/master/screenshots/20180302150717.jpg)

![Image text](https://raw.githubusercontent.com/Jeffery520/wx-cropper/master/screenshots/20180302150755.jpg)

## 目录结构

![Image text](https://raw.githubusercontent.com/Jeffery520/wx-cropper/master/screenshots/2345%E6%88%AA%E5%9B%BE20180302150950.jpg)

## 用方法
### 1.json引入
```html{
  "disableScroll": true,
  "usingComponents": {
    "cropper": "/components/cropper/cropper"
  }
}
```
### 2.wxml引入
```html
<cropper wx:if="{{imageSrc}}" image-src="{{imageSrc}}" bind:saveImg="saveImg"></cropper>
```
### 3.js调用
```html
Page({
  data: {
    imageSrc:''
  },
  onLoad(e){ 
    this.setData({
      imageSrc: e.imageSrc
    })
  },
  saveImg(e){  
    wx.redirectTo({
      url: `../test/test?imageSrc=${e.detail}`
    })
  }
})
```
- 保证图片质量，也可以选择压缩图或原图
- 支持图片放大缩小
- 支持图片移动
- 修复图片无法保存到本地问题



