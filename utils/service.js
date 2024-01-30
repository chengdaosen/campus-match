let ajaxTimes = 0

export const myRequest = async (params) => {
  ajaxTimes++
  wx.showLoading({
    title: '加载中',
    mask: true,
  })

  let myHeader = { ...params.header }
  if (params.url.startsWith('/needToken/')) {
    myHeader['Authorization'] = wx.getStorageSync('token')
  }

  const baseUrl = 'http://127.0.0.1:3000'

  try {
    const result = await new Promise((resolve, reject) => {
      wx.request({
        ...params,
        url: `${baseUrl}${params.url}`,
        header: { 'content-type': 'application/json', ...myHeader },
        success: resolve,
        fail: reject,
        complete: () => {
          ajaxTimes--
          if (ajaxTimes === 0) {
            wx.hideLoading()
          }
        },
      })
    })

    return result
  } catch (error) {
    // 处理请求失败的情况
    console.error('请求失败', error)
    throw error
  }
}
