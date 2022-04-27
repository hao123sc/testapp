from time import timezone
from django.db import models

# Create your models here.


# 教师信息表
class UserTeacher(models.Model):
    loginName = models.CharField(max_length=50,verbose_name='登录账号',unique=True)
    password = models.CharField(max_length=128,verbose_name='登录密码')
    name = models.CharField(max_length=50,verbose_name='姓名')
    teacherId = models.CharField(max_length=20,unique=True,verbose_name='工号')
    def __str__(self) -> str:
        return '%s %s %s %s'%(self.pk,self.loginName,self.name,self.teacherId)

# 班级表
class GradeClassInfo(models.Model):
    name = models.CharField(max_length=50,verbose_name='班级名')
    teacher = models.ForeignKey(UserTeacher,on_delete=models.CASCADE,verbose_name='班主任')
    def __str__(self) -> str:
        return '%s %s'%(self.name,self.teacher)


# 学生信息表
class UserStudent(models.Model):
    loginName = models.CharField(max_length=50,verbose_name='登录账号',unique=True)
    password = models.CharField(max_length=50,verbose_name='登录密码')
    name = models.CharField(max_length=50,verbose_name='姓名')
    studentId = models.CharField(max_length=20,unique=True,verbose_name='学籍号')
    gradeClass = models.ForeignKey(GradeClassInfo,on_delete=models.CASCADE,verbose_name='班级')
    teacher = models.ForeignKey(UserTeacher,on_delete=models.CASCADE,verbose_name='班主任')
    def __str__(self) -> str:
        return '%s %s %s %s'.format(self.pk,self.name,self.studentId,self.teacher)


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
        return '%s %s %s %s'.format( self.pk,self.name,self.examId,self.examDate)


# 题库表
class Subject(models.Model):
    subjectText = models.CharField(max_length=200,verbose_name='题目内容')
    lesson = models.CharField(max_length=50,verbose_name='课程名')
    grade = models.FloatField(verbose_name='分数')
    answerText = models.CharField(max_length=200,verbose_name='答案')
    def __str__(self) -> str:
        return '%s %s %s %s %s %s %s %s'.format(self.pk,self.questionId,self.questionText,self.student,self.exam,self.grade,self.score,self.weight)



# 学生答题
class studentAnswer(models.Model):
    answerText = models.TextField(verbose_name='学生答题内容')
    userScore = models.FloatField(verbose_name='人工评分')
    autoScore = models.FloatField(verbose_name='自动评分')
    gradeClass = models.ForeignKey(GradeClassInfo,on_delete=models.CASCADE,verbose_name='班级')
    subject = models.ForeignKey(Subject,on_delete=models.CASCADE,verbose_name='题目')
    student = models.ForeignKey(UserStudent,on_delete=models.CASCADE,verbose_name='学生')
    def __str__(self) -> str:
        return '%s %s'.format(self.pk,self.answerText)



class MyTest():
    def index():
        return 0




