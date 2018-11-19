//获取应用实例
const app = getApp();
const { util } = app;
// 获取显示区域长宽
const device = wx.getSystemInfoSync()
const W = device.windowWidth;
const H = device.windowHeight;
// 裁剪后图片宽高cutW*2
const cutW = 260;
//截取点坐标
const coordinate = [{
  x: (W - cutW) / 2,
  y: (H - cutW) / 2,
}, {
  x: (W - cutW) / 2 + cutW,
  y: (H - cutW) / 2,
}, {
  x: (W - cutW) / 2,
  y: (H - cutW) / 2 + cutW,
}, {
  x: (W - cutW) / 2 + cutW,
  y: (H - cutW) / 2 + cutW,
}];
//截取图片的坐标
let cutDta={
  x: (W - cutW) / 2,
  y: (H - cutW) / 2
}
//图片在画布上的位置
let X = 0, Y = 0;
//图片伸缩后的宽高/初始宽高
let imgW = 0, imgH = 0, initialW = 0, initialH = 0;
//单指拖动的初始位置
let oldX = 0, oldY = 0;
//多指间的初始距离,图片放大的倍数
let oldDistance = 0, scale = 1;
//判断手指用户操作动作
let touch=false;

Component({
  properties: {
    imageSrc: {
      type: String,
      value: '',
      observer: function (newVal, oldVal) {
        if (newVal != oldVal) {
          this._init();
        }
      }
    }
  },
  data: {

  },
  methods: {
    //初始化函数
    _init() {
      let that = this;
      wx.showToast({
        title: 'loading...',
        duration: 60000
      })
      that.ctx1 = wx.createCanvasContext('moveCanvas', that);
      that.ctx2 = wx.createCanvasContext('originCanvas', that);
      //绘制遮罩层
      that.ctx1.setFillStyle('rgba(0, 0, 0, 0.4)')
      that.ctx1.fillRect(0, 0, W, H)
      that.ctx1.clearRect(W / 2 - cutW / 2, H / 2 - cutW / 2, cutW, cutW)
      that.ctx1.setStrokeStyle('green')
      that.ctx1.strokeRect(W / 2 - cutW / 2, H / 2 - cutW / 2, cutW, cutW)

      that.ctx1.beginPath()
      that.ctx1.setStrokeStyle('rgba(255,255,255,0.4)')
      that.ctx1.moveTo(W / 2 - cutW / 6, H / 2 - cutW / 2)
      that.ctx1.lineTo(W / 2 - cutW / 6, H / 2 + cutW / 2)
      that.ctx1.stroke()

      that.ctx1.beginPath()
      that.ctx1.setStrokeStyle('rgba(255,255,255,0.4)')
      that.ctx1.moveTo(W / 2 + cutW / 6, H / 2 - cutW / 2)
      that.ctx1.lineTo(W / 2 + cutW / 6, H / 2 + cutW / 2)
      that.ctx1.stroke()

      that.ctx1.beginPath()
      that.ctx1.setStrokeStyle('rgba(255,255,255,0.4)')
      that.ctx1.moveTo(W / 2 - cutW / 2, H / 2 - cutW / 6)
      that.ctx1.lineTo(W / 2 + cutW / 2, H / 2 - cutW / 6)
      that.ctx1.stroke()

      that.ctx1.beginPath()
      that.ctx1.setStrokeStyle('rgba(255,255,255,0.4)')
      that.ctx1.moveTo(W / 2 + cutW / 2, H / 2 + cutW / 6)
      that.ctx1.lineTo(W / 2 - cutW / 2, H / 2 + cutW / 6)
      that.ctx1.stroke()

      that.ctx1.draw()

      //获取图片信息，绘制底层图片
      wx.getImageInfo({
        src: that.data.imageSrc,
        success: function (res) {
          if (res.width > res.height) {
            imgW = cutW * res.width / res.height;
            imgH = cutW;
          } else {
            imgH = cutW * res.height / res.width;
            imgW = cutW;
          }
          //图片载入的初始尺寸
          initialW = imgW;
          initialH = imgH;
          //图片在画布上的初始位置
          X = (W - imgW) / 2;
          Y = (H - imgH) / 2;
          that.setData({
            X: X + 'px',
            Y: Y + 'px',
            imgW: imgW + 'px',
            imgH: imgH + 'px',
          })
          cutDta.x = Math.abs(W - cutW) / 2;
          cutDta.y = Math.abs(H - cutW) / 2;
          wx.hideToast()
        },
        fail:function(){
          wx.showModal({
            title: '提示',
            content: '图片加载失败，请重新选择',
            showCancel:false,
            success: function (res) {
              wx.navigateBack({
                delta: 1
              })
            }
          })
        }
      })

    },
    //移动图片
    move() {
      let that = this;
      that.setData({
        X: X + 'px',
        Y: Y + 'px',
        imgW: imgW + 'px',
        imgH: imgH + 'px',
      })
    },
    //缩放图片
    scale() {
      let that = this;
      imgW = scale * initialW;
      imgH = scale * initialH;
      X = (W - imgW) / 2;
      Y = (H - imgH) / 2;

      that.setData({
        X: X + 'px',
        Y: Y + 'px',
        imgW: imgW + 'px',
        imgH: imgH + 'px',
      })
    },
    touchstart(e) {
      let that = this;
      touch=true;
      oldX = e.touches[0].x;
      oldY = e.touches[0].y;
      //判断如果是多指操作则记录手指初始距离
      if (e.touches.length >= 2) {
        let xMove = e.touches[1].x - e.touches[0].x;
        let yMove = e.touches[1].y - e.touches[0].y;
        oldDistance = Math.sqrt(xMove * xMove + yMove * yMove);
      }
    },
    touchmove(e) {
      let that = this;
      console.log(e)
      if (touch){
        if (e.touches.length >= 2) {
          // console.log('缩放')
          let xMove = e.touches[1].x - e.touches[0].x;
          let yMove = e.touches[1].y - e.touches[0].y;
          let distance = Math.sqrt(xMove * xMove + yMove * yMove);
          let distanceDiff = (distance - oldDistance);
          //如果滑动距离大于5再进行缩放
          if (Math.abs(distanceDiff)>=5){
            scale = scale + 0.0004 * distanceDiff
            if (scale > 2) {
              scale = 2
            }
            if (scale < 1) {
              scale = 1
            }
            that.scale()
          }
          return false
        } else {
          // console.log('移动')
          let xMove = (e.touches[0].x - oldX)*0.05;
          let yMove = (e.touches[0].y - oldY)*0.05;


          if (Math.abs(xMove) >= 2 && Math.abs(yMove) < 2) {
            X = X + Math.round(xMove)
            //禁止超出边框
            if (X >= coordinate[0].x) {
              X = coordinate[0].x
            }
            if (X <= -(imgW - coordinate[1].x)) {
              X = -(imgW - coordinate[1].x)
            }
            that.move()
          }

          if (Math.abs(xMove) < 2 && Math.abs(yMove) >= 2) {
            Y = Y + Math.round(yMove)
            //禁止超出边框
            if (Y >= coordinate[0].y) {
              Y = coordinate[0].y
            }
            if (Y <= -(imgH - coordinate[2].y)) {
              Y = -(imgH - coordinate[2].y)
            }
            that.move()
          }

          if (Math.abs(xMove) >= 2 && Math.abs(yMove) >= 2) {
            X = X + Math.round(xMove)
            Y = Y + Math.round(yMove)
            //禁止超出边框
            if (X >= coordinate[0].x) {
              X = coordinate[0].x
            }
            if (X <= -(imgW - coordinate[1].x)) {
              X = -(imgW - coordinate[1].x)
            }
            if (Y >= coordinate[0].y) {
              Y = coordinate[0].y
            }
            if (Y <= -(imgH - coordinate[2].y)) {
              Y = -(imgH - coordinate[2].y)
            }
            that.move()
          }
        }
      }
    },
    touchend() {
      let that=this;
      touch=false;
      cutDta.x = Math.abs(W - cutW) / 2;
      cutDta.y = Math.abs(H - cutW) / 2;
      oldX = 0;
      oldY = 0;
    },
    //保存裁剪后的图片
    saveImg() {
      let that = this;
      wx.showToast({
        title: '正在生成...',
        duration: 60000
      })
      //原图画布绘制
      that.ctx2.drawImage(that.data.imageSrc, X * 2, Y * 2, imgW * 2, imgH * 2)
      that.ctx2.draw()
      setTimeout(function(){
        wx.canvasToTempFilePath({
          x: cutDta.x * 2,
          y: cutDta.y * 2,
          width: cutW * 2,
          height: cutW * 2,
          destWidth: cutW * 2,
          destHeight: cutW * 2,
          canvasId: 'originCanvas',
          fileType: 'jpg',
          quality: 1,
          success: function (res) {
            wx.hideToast()
            //自定义事件导出画布
            //裁剪后图片的临时路径：res.tempFilePath
            that.triggerEvent('saveImg', res.tempFilePath)
          },
          fail(err) {
            wx.hideToast()
            wx.showModal({
              title: '保存失败',
              content: '图片保存失败，请重新选择',
              showCancel:false
            })
          }
        }, that)
      },1000)
    },
    //取消裁剪
    cancel(){
      wx.navigateBack({
        data:1
      })
    }
  }
})


