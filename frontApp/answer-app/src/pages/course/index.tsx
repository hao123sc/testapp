import ProForm, { ProFormDateRangePicker, ProFormDigit, ProFormRadio, ProFormSelect, ProFormText, ProFormTextArea, ProFormUploadButton } from '@ant-design/pro-form'
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout'
import { Card } from 'antd'
import React from 'react'

const formconst = (
    <PageContainer>
        <Card>
          <ProForm
            submitter={{
              render: (_, dom) => <FooterToolbar>{dom}</FooterToolbar>,
            }}
            onFinish={async (values) => console.log(values)}
          >
           
              <ProFormText
                name="name"
                label="课程名称"
                tooltip="最长为 24 位"
                placeholder="请输入名称"
                width='lg'
                rules={[{required:true}]}
              />

              <br/>
              <ProFormDigit
              width='lg'
              name='count'
              label='每周节数'
              placeholder="请输入数字"
              rules={[{required:true,message:'请输入每周课程节数！'}]}

              />

          </ProForm>
        </Card>

      </PageContainer>
)

export default function index() {
  return (
      formconst
      

    
  )
}
