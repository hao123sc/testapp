from rest_framework.authentication import BaseAuthentication
from spd_app import models
from rest_framework.exceptions import NotAuthenticated
# get_token生成加密token,out_token解密token
from spd_app.token_module import get_token, out_token


# 存储在前端的token解密比对
class TokenAuth2(BaseAuthentication):
    def authenticate(self, request):
        token = request.GET.get("token")
        name = request.GET.get("name")
        token_obj = out_token(name, token)
        if token_obj:
            return
        else:
            raise NotAuthenticated("你没有登入")

