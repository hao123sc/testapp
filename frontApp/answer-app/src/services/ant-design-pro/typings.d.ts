// @ts-ignore
/* eslint-disable */

declare namespace API {
  type CurrentUser = {
    name?: string;
    id?: string;
    loginRole?:string;
    avatar?: string;
    userid?: string;
    email?: string;
    signature?: string;
    title?: string;
    group?: string;
    tags?: { key?: string; label?: string }[];
    notifyCount?: number;
    unreadCount?: number;
    country?: string;
    access?: string;
    geographic?: {
      province?: { label?: string; key?: string };
      city?: { label?: string; key?: string };
    };
    address?: string;
    phone?: string;
  };

  type LoginResult = {
    status?: string;
    type?: string;
    currentAuthority?: string;
    loginName?:string;
    loginRole?:string;
    id?:string;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };
  type GradeClassInfo = {
    id:string;
    gradeName?: string;
    className?:string;
    teacherMain?:string;
    yuwen?:string;
    shuxue?:string;
    waiyu?:string;
    zhengzhi?:string;
    lishi?:string;
    dili?:string;
    wuli?:string;
    huaxue?:string;
    shenwu?:string;
    xinxijishu?:string;
  };
  type GradeClassInfoList = {
    data?: GradeClassInfo[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };
  type Teacher = {
    id:string;
    loginName?:string;
    password?:string;
    name: string;
    teacherId?:string;
    course:string;
    teacherOfClass?:string;
  };
  type TeacherList = {
    data?: Teacher[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };
  type Student = {
    id?:string;
    loginName?:string;
    password?:string;
    name?: string;
    studentId?:string;
    gradeClass?:string;
  };
  type Subject = {
    id?:string;
    subjectText?:string;
    lesson?:string;
    grade?: string;
    answerText?:string;
  };
  type Examine = {
    id?:string;
    name?:string;
    starDate?:string;
    endDate?: string;
    gradeClass?:string;
    subjectList?:string;
  };

  type StudentAnswer = {
    id:string;
    answerText?:string;
    userScore?:string;
    autoScore?:string;
    grade?:string;
    vclass?:string;
    values?:string;
    studentId?:string;
    studentName?:string;
    lesson?:string;
    subjectText?:string;
    standText?:string;
  };
  type StudentAnswerList = {
    data?: StudentAnswer[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type TableListPagination = {
    total: number;
    pageSize: number;
    current: number;
  };

  type Grading = {
    id?:string;
    loginName?:string;
    name?: string;
    subjectText?:string;
    lesson?:string;
    grade?: string;
    answerText?:string;
  };
}
