export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    hidden:true,
    component: './Welcome',
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './Welcome',
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: 'list.table-list',
    icon: 'table',
    path: '/list',
    component: './TableList',
  },
  {
    name: 'subject',
    icon: 'FormOutlined',
    path: '/subject',
    component: './subject',
  },
  {
    name: 'examine',
    icon: 'EditOutlined',
    path: '/examine',
    component: './examine',
  },
  {
    name: 'student',
    icon: 'UserAddOutlined',
    path: '/student',
    component: './student',
  },
  {
    name: 'gradeClass',
    icon: 'BankOutlined',
    path: '/gradeclass',
    component: './gradeclass',
  },
  {
    name: 'teacher',
    icon: 'TeamOutlined',
    path: '/teacher',
    component: './teacher',
  },
  {
    name: 'course',
    icon: 'ReadOutlined',
    path: '/course',
    component: './course',
  },
  {
    name: 'grading',
    icon: 'HighlightOutlined',
    path: '/grading',
    component: './grading',
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
