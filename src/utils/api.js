'use strict';
import {Promise} from '../libs/promise';

const _HOST_URI = 'http://www.duilu.me';

const _TALKS_LIST = '/consultation/talks.json'

const _SEARCH_API = '/consultation/search.json?type=lectures&utf8=✓'

const _TALK_INFO = '/consultation/talks/'

function _fetchApi(path, params) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${_HOST_URI}${path}`,
      data: Object.assign({}, params),
      header: { 'Content-Type': 'application/json' },
      success: resolve,
      fail: reject
    })
  }).then(res => res.data)
}

export function getTalksList(params) {
  return _fetchApi(_TALKS_LIST, params)
}

export function getSearchList(params) {
  return _fetchApi(_SEARCH_API, params)
}

export function getTalkDetail(id, params) {
  const path = `${_TALK_INFO}${id}.json`
  return _fetchApi(path, params)
}

export function getTalkQuestionList(id, params) {
  const path = `${_TALK_INFO}${id}/questions.json`
  return _fetchApi(path, params)
}

export function getTalkCommentList(id, params) {
  const path = `${_TALK_INFO}${id}/comments.json`
  return _fetchApi(path, params)
}

