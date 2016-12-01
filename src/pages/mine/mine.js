const app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    list:[{"id":109,"title":"他是华为供应链管理工程师，多次实习经历成功转投通信行业","tags":null,"avatar":"http://cdn-img.duilu.me/FlGwREa-l8CGGVEXQmpsnRVvKxa5","name":"马灿"},{"id":31,"title":"如何拿到国内top律所的offer","tags":"Top 律所 offer","avatar":"http://cdn-img.duilu.me/675ca4736fc74a1a88285b7e7e705207","name":"聂朋云"},{"id":33,"title":"帝国理工高材生教你 BAT offer的正确打开方式","tags":"腾讯游戏国际管培offer","avatar":"http://cdn-img.duilu.me/b8a235371e0f40ee915cfc4fc25c4799","name":"刘遥"},{"id":34,"title":"如何“眼高手低”地拿下BAT产品offer","tags":"企鹅老司机","avatar":"http://cdn-img.duilu.me/c2f5389bf87d4bc08d0b33810dad5572","name":"隐士"}]
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    let that = this
    //调用应用实例的方法获取全局数据
    wx.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  }
})