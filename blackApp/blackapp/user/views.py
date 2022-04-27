from cgitb import reset
from functools import cache
import http
import imp
import re
from sre_parse import State
from telnetlib import STATUS
from urllib import request
from django.contrib.auth.hashers import make_password,check_password
from django.contrib.auth import authenticate
from ast import If
from itertools import count
import json
from socket import if_indextoname
from unicodedata import name
from django.db import IntegrityError, connection
from django.forms import ValidationError
from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_list_or_404, get_object_or_404, render

from .models import UserStudent,UserTeacher,GradeClassInfo,Admin
import openpyxl




# Create your views here.

#account {"status":"error","type":"account","currentAuthority":"guest"}
#account {"status":"ok","type":"account","currentAuthority":"admin"}
#currentUser {"success":true,"data":{"name":"Serati Ma","avatar":"https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png","userid":"00000001","email":"antdesign@alipay.com","signature":"海纳百川，有容乃大","title":"交互专家","group":"蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED",}
#notices {"data":[{"id":"000000001","avatar":"https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png","title":"你收到了 14 份新周报","datetime":"2017-08-09","type":"notification"},{"id":"000000002","avatar":"https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png","title":"你推荐的 曲妮妮 已通过第三轮面试","datetime":"2017-08-08","type":"notification"},{"id":"000000003","avatar":"https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png","title":"这种模板可以区分多种通知类型","datetime":"2017-08-07","read":true,"type":"notification"},{"id":"000000004","avatar":"https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png","title":"左侧图标用于区分不同的类型","datetime":"2017-08-07","type":"notification"},{"id":"000000005","avatar":"https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png","title":"内容不要超过两行字，超出时自动截断","datetime":"2017-08-07","type":"notification"},{"id":"000000006","avatar":"https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg","title":"曲丽丽 评论了你","description":"描述信息描述信息描述信息","datetime":"2017-08-07","type":"message","clickClose":true},{"id":"000000007","avatar":"https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg","title":"朱偏右 回复了你","description":"这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像","datetime":"2017-08-07","type":"message","clickClose":true},{"id":"000000008","avatar":"https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg","title":"标题","description":"这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像","datetime":"2017-08-07","type":"message","clickClose":true},{"id":"000000009","title":"任务名称","description":"任务需要在 2017-01-12 20:00 前启动","extra":"未开始","status":"todo","type":"event"},{"id":"000000010","title":"第三方紧急代码变更","description":"冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务","extra":"马上到期","status":"urgent","type":"event"},{"id":"000000011","title":"信息安全考试","description":"指派竹尔于 2017-01-09 前完成更新并发布","extra":"已耗时 8 天","status":"doing","type":"event"},{"id":"000000012","title":"ABCD 版本发布","description":"冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务","extra":"进行中","status":"processing","type":"event"}]}
#



# 模板视图
# def login(request):
#     return render(request, 'user/index.html')



# 前端非模板视图

def initial(request):
    # loginName = 'admin'
    # password = 'admin'
    # name = 'admin'
    Admin.objects.create(loginName = 'admin',name = 'admin',password=make_password('admin','ab'))
    UserTeacher.objects.create(loginName = 'teacher',name = 'teacher',password=make_password('teacher','ab'))
    return HttpResponse("管理员帐号初始化为帐号admin密码admin")

def notices(request):
        return JsonResponse({'data':[]})


def login(request):
    req = json.loads(request.body)
    username = req['username']
    password = req['password']
    autoLogin = req['autoLogin']
    loginRole = req['loginRole']
    type = req['type']
    id = ''
    cot = 0

    if loginRole == 1:
        use = UserTeacher.objects.filter(loginName = username,password = make_password(password,'ab')).first()        
    elif loginRole == 2:
        use = UserStudent.objects.filter(loginName = username,password = make_password(password,'ab')).first()
    elif loginRole == 3:
        use = Admin.objects.filter(loginName = username,password = make_password(password,'ab')).first()
    else: loginRole = 4
    if use:
        id = use.id
        loginName = use.loginName
        request.session['loginID'] = id
        request.session['loginRole'] = loginRole
        cot = 1
    
    res = {}
    res['status'] = 'ok' if cot > 0 else 'error'
    res['type'] = 'account'
    res['loginRole'] = loginRole
    res['id'] = id
    res['loginName'] = username

    if loginRole == 1:
        res['currentAuthority'] = 'teacher'
    elif loginRole == 2:
        res['currentAuthority'] = 'student'
    elif loginRole == 3:
        res['currentAuthority'] = 'admin'
    else:
        res['currentAuthority'] = 'guest'
        
    return JsonResponse(res)

def outLogin(request):
    del request.session['loginID']
    del request.session['loginRole']
    return JsonResponse({"data":{},"success":True})

def currentUser(request):
    id = request.session.get('loginID',0)
    loginRole = request.session.get('loginRole',0)
    
    if id == 0:
        return JsonResponse({"data":{"isLogin":False},"errorCode":"401","errorMessage":"请先登录！","success":True},status=401)


    if loginRole == 1:
        userSet = UserTeacher.objects.filter(pk = id)
    elif loginRole == 2:
        userSet = UserStudent.objects.filter(pk = id)
    elif loginRole == 3:
        userSet = Admin.objects.filter(pk = id)

    date ={
        'id':userSet[0].id,
        'name':userSet[0].name,
        'avatar':'icons/headico.png',
    }
           


    res = {}
    res['id'] = id
    res['loginRole'] = loginRole
    res['success'] = 'true'
    res['data'] = date
    
    return JsonResponse(res)

def currentUserDetail(request):
    id = request.session.get('loginID',0)
    if id == 0:
        return JsonResponse({"data":{"isLogin":False},"errorCode":"401","errorMessage":"请先登录！","success":True})

    loginRole = request.session.get('loginRole',0)  


    if loginRole == 1:
        userSet = UserTeacher.objects.filter(pk = id)
    elif loginRole == 2:
        userSet = UserStudent.objects.filter(pk = id)
    elif loginRole == 3:
        userSet = Admin.objects.filter(pk = id)
    
    date ={
        'id':userSet[0].id,
        'name':userSet[0].name,
        'avatar':'icons/headico.png',
    }           


    res = {}
    res['id'] = id
    res['loginRole'] = loginRole
    res['success'] = 'true'
    res['data'] = date
    
    return JsonResponse(res)

class Grade_Class_Info:
    def getInfo(request):
        params = json.loads(request.GET.get('params',''))
        sort = json.loads(request.GET.get('sort',''))
        filter = json.loads(request.GET.get('filter',''))

        current = params.get('current','')
        pageSize = params.get('pageSize','')

        id = params.get('id','')
        gradeName = params.get('gradeName','')
        className = params.get('className','')
        yuwen = params.get('yuwen','')
        shuxue = params.get('shuxue')
        waiyu = params.get('waiyu','')
        zhengzhi = params.get('zhengzhi','')
        lishi = params.get('lishi','')
        dili = params.get('dili','')
        wuli = params.get('wuli','')
        huaxue = params.get('huaxue','')
        shenwu = params.get('shenwu','')
        xinxijishu = params.get('xinxijishu','')
        teacherMain = params.get('teacherMain','')



        if current == '' or pageSize == '':
            current = '0'
            pageSize = '0'
        current = int(current)
        pageSize = int(pageSize)
        star = (current - 1)* pageSize
        end = current*pageSize

        sort_key = ''
        sort_val = ''
        if sort:
            for i,v in sort.items():
                sort_key = i
                sort_val = v

       

        data = []
        res = GradeClassInfo.objects.all()



        if id:
            res = res.filter(pk = id)
        if gradeName:
            res = res.filter(gradeName = gradeName)
        if className:
            res = res.filter(className = className)
        if yuwen:
            res = res.filter(yuwen = yuwen)
        if shuxue:
            res = res.filter(shuxue = shuxue)
        if waiyu:
            res = res.filter(waiyu = waiyu)
        if zhengzhi:
            res = res.filter(zhengzhi = zhengzhi)
        if lishi:
            res = res.filter(lishi = lishi)
        if dili:
            res = res.filter(dili = dili)
        if wuli:
            res = res.filter(wuli = wuli)
        if huaxue:
            res = res.filter(huaxue = huaxue)
        if shenwu:
            res = res.filter(shenwu = shenwu)
        if xinxijishu:
            res = res.filter(xinxijishu = xinxijishu)
        if teacherMain:
            res = res.filter(teacherMain = teacherMain)



        if sort_key:
            if sort_val == 'descend':
                sort_key = '-'+sort_key

            res = res.order_by(sort_key)
        
        total = res.count()



        if end == 0:
            res = res[:]
        else:
            res = res[star:end]

        for i in res:
            data.append({'id':i.id,'gradeName':i.gradeName,'className':i.className,'yuwen':i.yuwen.name if i.yuwen else '-',
            'shuxue':i.shuxue.name if i.shuxue else '-','waiyu':i.waiyu.name if i.waiyu else '-','zhengzhi':i.zhengzhi.name if i.zhengzhi else '-','lishi':i.lishi.name if i.lishi else '-','dili':i.dili.name if i.dili else '-',
            'wuli':i.wuli.name if i.wuli else '-','huaxue':i.huaxue.name if i.huaxue else '-','shenwu':i.shenwu.name if i.shenwu else '-','xinxijishu':i.xinxijishu.name if i.xinxijishu else '-','teacherMain':i.teacherMain.name if i.teacherMain else '-'})

            

        return JsonResponse({'success':True,'pageSize':pageSize,'current':current,'code':0,'msg':'查找成功!','data':data,'total':total})



    def getInfoId(request,id):
        gradeSet = GradeClassInfo.objects.filter(pk = id)
        if  gradeSet.count():
            date = {}
            date['name'] = gradeSet.name
            date['teacher'] = gradeSet.teacher.name
            res = {
                'status':'success',
                'code':0,
                'msg':'ok',
                'date':date,
            }
            return JsonResponse(res)
        else:
            return JsonResponse({
                'state':'faull',
                'code':1,
                'msg':'fall',
                'date':'',
            })

    def getInfoAll(request):
      #  gradeSet = GradeClassInfo.objects.get(pk=id)
        gradeSet = get_list_or_404(GradeClassInfo)
        dates = []
        for k in gradeSet:
            dates.append({
                'name':k.name,
                'teacher':k.teacher.name
            })

        res = {
            'stata':'success',
            'code':0,
            'total':len(gradeSet),
            'data':dates
        }
        
        return JsonResponse(res)

    def add(request):
        item = (json.loads(request.body))['item']
        gradeName = item.get('gradeName','')
        className = item.get('className','')
        if gradeName == '' or className == '':
            return JsonResponse({'stata':'fall','code':'1','msg':'年级或班级不能为空！'},status = 500)
        teacherMain = 0 if item.get('teacherMain','') == '' else item.get('teacherMain','').get('key',0)
        yuwen = 0 if item.get('yuwen','') == '' else item.get('yuwen','').get('key',0)
        shuxue = 0 if item.get('shuxue','') == '' else item.get('shuxue','').get('key',0)
        waiyu = 0 if item.get('waiyu','') == '' else item.get('waiyu','').get('key',0)
        wuli = 0 if item.get('wuli','') == '' else item.get('wuli','').get('key',0)
        huaxue = 0 if item.get('huaxue','') == '' else item.get('huaxue','').get('key',0)
        shengwu = 0 if item.get('shengwu','') == '' else item.get('shengwu','').get('key',0)
        zhengzhi = 0 if item.get('zhengzhi','') == '' else item.get('zhengzhi','').get('key',0)
        lishi = 0 if item.get('lishi','') == '' else item.get('lishi','').get('key',0)
        dili = 0 if item.get('dili','') == '' else item.get('dili','').get('key',0)
        xinxijishu = 0 if item.get('xinxijishu','') == '' else item.get('xinxijishu','').get('key',0)


       
     
        teacher = UserTeacher.objects.filter(pk = teacherMain).first()
        teacher_yw = UserTeacher.objects.filter(pk = yuwen).first()
        teacher_sx = UserTeacher.objects.filter(pk = shuxue).first()
        teacher_wy = UserTeacher.objects.filter(pk = waiyu).first()
        teacher_wl = UserTeacher.objects.filter(pk = wuli).first()
        teacher_hx = UserTeacher.objects.filter(pk = huaxue).first()
        teacher_sw = UserTeacher.objects.filter(pk = shengwu).first()
        teacher_ls = UserTeacher.objects.filter(pk = lishi).first()
        teacher_zz = UserTeacher.objects.filter(pk = zhengzhi).first()
        teacher_dl = UserTeacher.objects.filter(pk = dili).first()
        teacher_xxjs = UserTeacher.objects.filter(pk = xinxijishu).first()

   

        
        # if GradeClassInfo.objects.filter(gradeName = gradeName,className = className).count():
        #     return JsonResponse({'stata':'fall','code':'1','msg':'班级已经存在！'},status = 500)

        try:
            GradeClassInfo(gradeName = gradeName,className = className, teacherMain = teacher, 
            yuwen = teacher_yw, shuxue = teacher_sx, waiyu = teacher_wy, wuli = teacher_wl, huaxue = teacher_hx, shenwu = teacher_sw, lishi = teacher_ls, zhengzhi = teacher_zz, 
            dili = teacher_dl, xinxijishu = teacher_xxjs).save()            
        except IntegrityError:
            return JsonResponse({'stata':'fall','code':'1','msg':'班级已经存在！'},status = 500)






        GradeClassInfo(gradeName = gradeName,className = className, teacherMain = teacher, 
        yuwen = teacher_yw, shuxue = teacher_sx, waiyu = teacher_wy, wuli = teacher_wl, huaxue = teacher_hx, shenwu = teacher_sw, lishi = teacher_ls, zhengzhi = teacher_zz, 
        dili = teacher_dl, xinxijishu = teacher_xxjs).save()
        

        res = {
            'stata':'success',
            'code':0,
        }
        return JsonResponse(res)



    def delete(request):        
        id = request.POST.get('id','')
        GradeClassInfo.objects.get(pk = id).delete()

        res = {
            'stata':'success',
            'code':0,
        }
        return JsonResponse(res)

class User_Teacher:
    def getInfo(request):
        params = json.loads(request.GET.get('params',''))
        sort = json.loads(request.GET.get('sort',''))
        filter = json.loads(request.GET.get('filter',''))

        current = params.get('current','')       
        pageSize = params.get('pageSize','')
        loginName = params.get('loginName','')
        name = params.get('name','')
        course = params.get('course','')
        teacherId = params.get('teacherId')
        id = params.get('id','')

        if current == '' or pageSize == '':
            current = 0
            pageSize = 0
           
        current = int(current)
        pageSize = int(pageSize)
        star = (current - 1)* pageSize
        end = current*pageSize

        sort_key = ''
        sort_val = ''
        if sort:
            for i,v in sort.items():
                sort_key = i
                sort_val = v
        # if sort:
        #     sort_key = sort.keys()
        #     sort_val = sort.values()

       

        data = []
        res = UserTeacher.objects.all()
        if id:
            res = res.filter(pk = id)
        if loginName:
            res = res.filter(loginName = loginName)
        if name:
            res = res.filter(name = name)
        if course:
            res = res.filter(course = course)
        if teacherId:
            res = res.filter(teacherId = teacherId)

        if sort_key:
            if sort_val == 'descend':
                sort_key = '-'+sort_key

            res = res.order_by(sort_key)
        
        total = res.count()
        if end == 0:
            res = res[:]
        else:
            res = res[star:end]

        for i in res:
            data.append({'id':i.id,'loginName':i.loginName,'password':i.loginName,'name':i.name,'course':i.course,'teacherId':i.teacherId})
            

        return JsonResponse({'success':True,'pageSize':pageSize,'current':current,'code':0,'msg':'查找成功!','data':data,'total':total})




    def add(request):
        item = (json.loads(request.body))['item']
        
        loginName = item['loginName']
        password = item['password']
        name = item['name']
        teacherId = item['teacherId']
        course = item['course']
        course = course['value']

        if UserTeacher.objects.filter(loginName = loginName).count() or UserTeacher.objects.filter(teacherId = teacherId).count():
            return JsonResponse({'stata':'fall','code':'1','msg':'帐号或员工号已经存在！'},status = 500)

        UserTeacher.objects.create(loginName = loginName,name = name,teacherId = teacherId,password=make_password(password,'ab'),course =course)

        res = {
            'stata':'success',
            'code':0,
        }
        return JsonResponse(res)

    def delete(request):
        req = json.loads(request.body)
        ids = [i for i in req['id']]
        for id in ids:
            UserTeacher.objects.get(pk = id).delete()
        res = {
            'stata':'success',
            'code':0,
        }
        return JsonResponse(res)

    def update(request):
        item = (json.loads(request.body))['item']

        id = item['id']
        loginName = item['loginName']
        password = item['password']
        name = item['name']
        teacherId = item['teacherId']
        course = item['course']

        res = UserTeacher.objects.filter(pk = id)
        if res.count == 0:
            return HttpResponse(status = 500)
        r = res.update(loginName = loginName,password = make_password(password,'ab'),name = name,course = course,teacherId = teacherId)

        return JsonResponse({'success':True,'code':0,'msg':'更新成功'+str(r)+'条记录!','count':r})


    def importdata(request):
        
        loginName = request.POST.get('loginName','')
        password = request.POST.get('password','')
        name = request.POST.get('name','')
        course = request.POST.get('course','')
        teacherId = request.POST.get('id','')
        with open('t.json', 'r',encoding='utf-8') as destination:
            load_dict = json.load(destination)
            for r in load_dict['data']:
                loginName = r['loginName']
                password = r['password']
                name = r['name']
                course = r['course']
                teacherId = r['teacherId']
                UserTeacher.objects.create(loginName = loginName,name = name,course = course,teacherId = teacherId,password=make_password(password,'ab'))
            

        return HttpResponse(load_dict['data'][0]['name'])

    def importExceldata(request):
        student = ''
        subject = 1
        out = [] 
        wb=openpyxl.load_workbook('test.xlsx')
        sheet=wb.worksheets[0]
        for row in sheet.iter_rows():
            for cell in row:
                out.append(cell.value)

                

        return HttpResponse(out)


    
   





