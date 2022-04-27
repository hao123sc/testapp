// @ts-ignore
/* eslint-disable */
import { SortOrder } from 'antd/lib/table/interface';
import { ReactText } from 'react';
import { request } from 'umi';

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/api/currentUser', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/login/account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'DELETE',
    ...(options || {}),
  });
}

/** 新建规则 GET /api/teacher */
export async function getTeacher(
  params:{
  pageSize?: number | undefined;
  current?: number | undefined;
  keyword?: string | undefined;
},
sort:Record<string, SortOrder>,
filter:Record<string, ReactText[] | null>,
) {
  return request<API.TeacherList>('/api/teacher', {
    method: 'GET',
    params: {
      params,
      sort,
      filter,
    },
  });
}

/** 新建规则 POST /api/teacher/update */
export async function updateTeacher(
  item:API.Teacher,
options?: { [key: string]: any },) {
  return request('/api/teacher/update', {
    method: 'POST',
    data: {
      item,
    },
    ...(options || {}),
  });
}



/** 新建规则 POST /api/teacher/delete */
export async function removeTeacher(
  id:string[],
  options?: { [key: string]: any }){
  return request('/api/teacher/delete', {
    method: 'POST',
    data: {
      id,
    },
    ...(options || {}), 
  });
}


/** 新建规则 POST /api/teacher/add */
export async function addTeacher(
  item:API.Teacher,
  options?: { [key: string]: any }){
  return request('/api/teacher/add', {
    method: 'POST',
    data: {
      item,
    },
    ...(options || {}), 
  });
}

/** 新建规则 GET /api/studentAnswer */
export async function getStudentAnswer(
  params:{
  pageSize?: number | undefined;
  current?: number | undefined;
  keyword?: string | undefined;
},
options?: { [key: string]: any },) {
  return request<API.StudentAnswerList>('/api/studentAnswer', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
/** 新建规则 GET /api/getGradeClass */
export async function getGradeClassInfo(
  params:{
  pageSize?: number | undefined;
  current?: number | undefined;
  keyword?: string | undefined;
},
sort:Record<string, SortOrder>,
filter:Record<string, ReactText[] | null>,
) {
  return request<API.GradeClassInfoList>('/api/GradeClassInfo', {
    method: 'GET',
    params: {
      params,
      sort,
      filter,
    },
  });
}

/** 新建规则 POST /api/gradeClassInfo/add */
export async function addGradeClassInfo(
  item:API.GradeClassInfo,
  options?: { [key: string]: any }){
  return request('/api/GradeClassInfo/add', {
    method: 'POST',
    data: {
      item,
    },
    ...(options || {}), 
  });
}


/** 新建规则 POST /api/gradeClassInfo/update */
export async function updateGradeClassInfo(
  item:API.GradeClassInfo,
options?: { [key: string]: any },) {
  return request('/api/GradeClassInfo/update', {
    method: 'POST',
    data: {
      item,
    },
    ...(options || {}),
  });
}
