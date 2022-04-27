from tkinter.messagebox import QUESTION
from django.contrib import admin
from .models import UserTeacher,UserStudent,GradeClassInfo,Examine,Subject,studentAnswer


admin.site.register([UserTeacher,UserStudent,GradeClassInfo,Examine,Subject,studentAnswer])

# Register your models here.
