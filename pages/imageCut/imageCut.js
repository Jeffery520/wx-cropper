// pages/user/test/test.js
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