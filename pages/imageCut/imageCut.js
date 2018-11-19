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
    const that = this;
    wx.showToast({
      title: '正在保存',
      icon: 'success',
      duration: 6000
    })
    //保存到系统相册
    //裁剪后图片的临时路径：e.detail
    wx.saveImageToPhotosAlbum({
      filePath: e.detail,
      success(res) {
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail(err) {
        wx.hideToast()
        wx.showModal({
          title: '提示',
          content: '图片保存失败,请尝试重新保存:' + err.errMsg,
        })
      }
    })
    wx.redirectTo({
      url: `../test/test?imageSrc=${e.detail}`
    })
  }
})