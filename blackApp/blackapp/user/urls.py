"""blackapp URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from . import views
from django.urls import path,re_path

urlpatterns = [
    
    path('notices', views.notices,name='notices'),
    path('currentUserDetail', views.currentUserDetail,name='currentUserDetail'),
    path('user/initial', views.initial,name='initial'),
    path('user/login/', views.login,name='login'),
    path('login/account', views.login,name='account'),
    path('login/outLogin', views.outLogin,name='outLogin'),
    path('currentUser', views.currentUser,name='currentUser'),

    path('GradeClassInfo', views.Grade_Class_Info.getInfo,name='GradeClassInfoGet'),
    path('GradeClassInfo/getInfo', views.Grade_Class_Info.getInfo,name='GradeClassInfoGet'),
    path('GradeClassInfo/getInfoId/<int:id>', views.Grade_Class_Info.getInfoId,name='GradeClassInfoGetId'),
    path('GradeClassInfo/getInfoAll', views.Grade_Class_Info.getInfoAll,name='GradeClassInfoGetAll'),
    path('GradeClassInfo/add', views.Grade_Class_Info.add,name='GradeClassInfoAdd'),
    path('GradeClassInfo/delete', views.Grade_Class_Info.delete,name='GradeClassInfoDelete'),

    path('teacher', views.User_Teacher.getInfo,name='TeacherGetInfo'),
    path('teacher/update', views.User_Teacher.update,name='TeacherInfoUpdate'),
    path('teacher/getInfo', views.User_Teacher.getInfo,name='TeacherGetInfo'),     
    path('teacher/add', views.User_Teacher.add,name='TeacherInfoAdd'),
    path('teacher/import', views.User_Teacher.importdata,name='TeacherInfoImport'),
    path('teacher/importexcel', views.User_Teacher.importExceldata,name='importExceldata'),
    path('teacher/delete', views.User_Teacher.delete,name='TeacherInfoDelete'),
  #  path('getAll',views,name='examine'),

]
