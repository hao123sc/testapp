from enum import unique
from operator import mod
from time import timezone
from django.db import models

# Create your models here.

# 超级管理员
class Admin(models.Model):
    loginName = models.CharField(max_length=50,verbose_name='登录账号',unique=True)
    password = models.CharField(max_length=128,verbose_name='登录密码')
    name = models.CharField(max_length=50,verbose_name='姓名')    
    def __str__(self) -> str:
        return '%s %s %s'%(self.pk,self.loginName,self.name)

# 教师信息表
class UserTeacher(models.Model):
    loginName = models.CharField(max_length=50,verbose_name='登录账号',unique=True)
    password = models.CharField(max_length=128,verbose_name='登录密码')
    name = models.CharField(max_length=50,verbose_name='姓名')
    course = models.CharField(max_length=50,verbose_name='课程')
    teacherId = models.CharField(max_length=20,unique=True,verbose_name='工号')
    def __str__(self) -> str:
        return '%s %s %s %s'%(self.pk,self.loginName,self.name,self.teacherId)



# 班级表
class GradeClassInfo(models.Model):
    gradeName = models.CharField(max_length=50,verbose_name='年级名',null=True)
    className = models.CharField(max_length=50,verbose_name='级名',null=True)
    yuwen = models.ForeignKey(UserTeacher,verbose_name='语文',on_delete=models.SET_NULL,null=True,related_name='yuwen')
    shuxue = models.ForeignKey(UserTeacher,verbose_name='数学',on_delete=models.SET_NULL,null=True,related_name='shuxue')
    waiyu = models.ForeignKey(UserTeacher,verbose_name='外语',null=True,on_delete=models.SET_NULL,related_name='waiyu')
    zhengzhi = models.ForeignKey(UserTeacher,verbose_name='政治',null=True,on_delete=models.SET_NULL,related_name='zhengzhi')
    lishi = models.ForeignKey(UserTeacher,verbose_name='历史',null=True,on_delete=models.SET_NULL,related_name='lishi')
    dili = models.ForeignKey(UserTeacher,verbose_name='地理',null=True,on_delete=models.SET_NULL,related_name='dili')
    wuli = models.ForeignKey(UserTeacher,verbose_name='物理',null=True,on_delete=models.SET_NULL,related_name='wuli')
    huaxue = models.ForeignKey(UserTeacher,verbose_name='化学',null=True,on_delete=models.SET_NULL,related_name='huaxue')
    shenwu = models.ForeignKey(UserTeacher,verbose_name='生物',null=True,on_delete=models.SET_NULL,related_name='shenwu')
    xinxijishu = models.ForeignKey(UserTeacher,verbose_name='信息技术',null=True,on_delete=models.SET_NULL,related_name='xinxijishu')
    teacherMain = models.ForeignKey(UserTeacher,on_delete=models.SET_NULL,verbose_name='班主任',related_name='teacherMain',null=True,)

    class Meta:
        unique_together = ('gradeName', 'className')

    def __str__(self) -> str:
        return '%s %s'%(self.gradeName,self.teacherMain)


# 学生信息表
class UserStudent(models.Model):
    loginName = models.CharField(max_length=50,verbose_name='登录账号',unique=True)
    password = models.CharField(max_length=128,verbose_name='登录密码')
    name = models.CharField(max_length=50,verbose_name='姓名')
    studentId = models.CharField(max_length=20,unique=True,verbose_name='学籍号')
    gradeClass = models.ForeignKey(GradeClassInfo,on_delete=models.CASCADE,verbose_name='班级')
    def __str__(self) -> str:
        return '%s %s %s %s'.format(self.pk,self.name,self.studentId,self.gradeClass)


# 考试信息表
class Examine(models.Model):
    name = models.CharField(max_length=50,verbose_name='考试名称')
    examId = models.CharField(max_length=50,unique=True,verbose_name='考试编号')
    starDate = models.DateTimeField(verbose_name='开始考试日期',auto_now_add=True)
    endDate = models.DateTimeField(verbose_name='考试结束日期',auto_now_add=True)
    lesson = models.CharField(max_length=50,verbose_name='课程名',null=True)
    gradeClass = models.ForeignKey(GradeClassInfo,on_delete=models.CASCADE,verbose_name='班级')
    subject = models.CharField(max_length=50,verbose_name='考试题目列表',null=True)
    def __str__(self) -> str:
        return '%s %s %s %s'.format( self.pk,self.name,self.examId,self.lesson)


# 题库表
class Subject(models.Model):
    subjectText = models.CharField(max_length=200,verbose_name='题目内容')
    lesson = models.CharField(max_length=50,verbose_name='课程名')
    grade = models.FloatField(verbose_name='分数')
    answerText = models.CharField(max_length=200,verbose_name='答案')
    def __str__(self) -> str:
        return '%s %s'.format(self.pk,self.lesson)



# 学生答题
class studentAnswer(models.Model):
    answerText = models.TextField(verbose_name='学生答题内容')
    userScore = models.FloatField(verbose_name='人工评分')
    autoScore = models.FloatField(verbose_name='自动评分')
    gradeClass = models.ForeignKey(GradeClassInfo,on_delete=models.CASCADE,verbose_name='班级')
    subject = models.ForeignKey(Subject,on_delete=models.CASCADE,verbose_name='题目')
    student = models.ForeignKey(UserStudent,on_delete=models.CASCADE,verbose_name='学生')
    def __str__(self) -> str:
        return '%s %s'.format(self.pk,self.student)


#消息表
class Notices(models.Model):
    avatar = models.TextField(verbose_name='消息图标')
    datetime = models.DateTimeField(verbose_name='消息时间')
    memberId = models.TextField(verbose_name='消息人员ID')
    memberRole = models.TextField(verbose_name='消息人员角色')
    title = models.TextField(verbose_name='消息标题')
    notitype = models.TextField(verbose_name='消息类型',default='notification')

#



