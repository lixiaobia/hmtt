import request from '@/utils/request'
import { getStorages } from '@/utils/storage.js'
// import { getToken } from '@/u = tils/token.js'

// 获取所有频道列表
export const allChannelListAPI = () => request({
  url: '/v1_0/channels',
  method: 'GET'
})
// 登录注册
export const loginAPI = ({ mobile, code }) => request({
  url: '/v1_0/authorizations',
  method: 'POST',
  data: {
    mobile,
    code
  }
})
// 获取用户的频道
// 不强制用户登录，匿名用户返回后台设置的默认频道列表
export const getChannelsAPI = () => request({
  url: '/v1_0/user/channels',
  method: 'GET'
  // headers: {
  //   Authorization: `Bearer ${getToken()}`
  // }
})
// 获取文章新闻推荐
// 文章 - 获取列表
export const articlesListAPI = ({ channelId }) => {
  return request({
    url: '/v1_0/articles',
    params: {
      channel_id: channelId,
      timestamp: (new Date()).getTime()
    }
  })
}
// 对文章不喜欢 /v1_0/article/dislikes
export const dislikesArticleAPI = ({ artId }) => request({
  url: '/v1_0/article/dislikes',
  method: 'POST',
  // headers: {
  //   Authorization: `Bearer ${getToken()}`
  // },
  data: {
    target: artId
  }
})
// 举报文章/v1_0/article/reports
export const reportsArticleAPI = ({ artId, value }) => request({
  url: '/v1_0/article/reports',
  method: 'POST',
  // headers: {
  //   Authorization: `Bearer ${getToken()}`
  // },
  data: {
    target: artId, // 举报的文章id
    type: value, // 举报类型
    remark: '自定义判断 给个弹出框' // 其他问题 的附加说明
  }
})
// /v1_0/articles/:article_id获取新闻详情
export const detailAPI = ({ id }) => request({
  url: `/v1_0/articles/${id}`
})
// 定义更新频道接口方法
export const updateChannelAPI = ({ channels }) => request({
  url: '/v1_0/user/channels',
  method: 'PUT',
  data: {
    channels
  }
})
// 删除指定用户频道
export const removeTheChannelAPI = ({ channelId }) => request({
  url: `/v1_0/user/channels/${channelId}`,
  method: 'DELETE'
})
// 获取联想搜索建议
export const suggestListAPI = ({ keywords }) => request({
  url: '/v1_0/suggestion',
  method: 'GET',
  params: {
    q: keywords
  }
})
// 获取搜索结果
export const searchAPI = ({ page = 1, perPage = 10, q }) => request({
  url: '/v1_0/search',
  method: 'GET',
  params: {
    page,
    per_page: perPage,
    q
  }
})
// 关注用户
export const followedUserAPI = ({ artId }) => request({
  url: '/v1_0/user/followings',
  method: 'POST',
  data: {
    target: artId
  }
})
// 取消关注用户unFollowedUserAPI
export const unFollowedUserAPI = ({ artId }) => request({
  url: `/v1_0/user/followings/${artId}`,
  method: 'DELETE'
})
// 对文章点赞
export const articleLikeAPI = ({ artId }) => request({
  url: '/v1_0/article/likings',
  method: 'POST',
  data: {
    target: artId
  }
})
// 取消对文章点赞
export const articleDisLikeAPI = ({ artId }) => request({
  url: `/v1_0/article/likings/${artId}`,
  method: 'DELETE'
})
// 获取评论或评论回复
export const commentListAPI = ({ id, offset = null, limit = 10 }) => request({
  url: '/v1_0/comments',
  method: 'GET',
  params: {
    type: 'a', // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
    source: id,
    offset,
    limit
  }
})
// 对评论或评论回复点赞
export const commentLikingAPI = ({ artId }) => request({
  url: '/v1_0/comment/likings',
  method: 'POST',
  data: {
    target: artId // 点赞的评论id
  }
})
// 取消对评论或评论回复点赞
export const uncommentLikingAPI = ({ artId }) => request({
  url: `/v1_0/comment/likings/${artId}`,
  method: 'DELETE'
  // 要取消点赞的评论id或评论回复id

})
// 对文章或者评论进行评论
export const sendCommentAPI = ({ id, content }) => {
  // const obj = {

  // }
  // if (artId != null) {
  //   obj.art_id = artId
  // }
  return request({
    url: '/v1_0/comments',
    method: 'POST',
    data: {
      target: id,
      content
    }

  })
}
// 获取用户自己信息
export const getUserinfoAPI = () => request({
  url: '/v1_0/user',
  method: 'GET'
})
// 获取用户个人资料
export const userProfileAPI = () => request({
  url: '/v1_0/user/profile',
  method: 'GET'
})
// 编辑用户照片资料（头像、身份证照片）
export const updatePhotoAPI = (fd) => request({
  url: '/v1_0/user/photo',
  method: 'PATCH',
  data: fd
})
// 更新用户个人资料
export const updateProfileAPI = (dataobj) => {
  // 定义一个对象 里面是所有参数
  const obj = {
    name: '',
    gender: 0,
    birthday: '',
    intro: ''
  }
  // 循环遍历这个对象
  for (const key in obj) {
    // 传进来的数据去obj里面匹配 如果没有就是undefined 就从obj身上移除这个属性和值
    if (dataobj[key] === undefined) {
      delete obj[key]
    } else {
      obj[key] = dataobj[key]// 如果有就把 传进来的值赋值给obj
    }
  }
  return request({
    url: '/v1_0/user/profile',
    method: 'PATCH',
    data: obj
  })
}
// 刷新用户token
export const refreshTokenAPI = () => request({
  url: '/v1_0/authorizations',
  method: 'PUT',
  headers: {
    Authorization: 'Bearer ' + getStorages('refresh_token')
  }
})
