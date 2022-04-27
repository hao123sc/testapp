import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, message,  Drawer, Card, Modal, Upload, Radio, Form } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { ProColumns, ActionType, TableDropdown } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormDigit, ProFormSelect, ProFormText, } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import { getStudentAnswer, getTeacher } from '@/services/ant-design-pro/api';
import { RecordKey } from '@ant-design/pro-utils/lib/useEditableArray';
import { useRequest } from 'umi';
import { render } from 'react-dom';
import { values } from 'lodash';



/**
 * 添加节点
 *
 * @param fields
 */

const handleAdd = async (fields: API.StudentAnswer) => {
  const hide = message.loading('正在添加');

  try {
    await addTeacher({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};
/**
 * 更新节点
 *
 * @param fields
 */

const handleUpdate = async (currentRow?: API.StudentAnswer) => {
  const hide = message.loading('正在配置');

  try {
    await updateTeacher({
      ...currentRow,
      ...fields,
    });
    hide();
    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};
/**
 * 删除节点
 *
 * @param selectedRows
 */

const handleRemove = async (selectedRows: API.Teacher[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;

  try {
    await removeTeacher({
      key: selectedRows.map((row) => row.id),
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};





const MyTableList: React.FC = () => {
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [createGradeModalVisible, handleGradeModalVisible] = useState<boolean>(false);
  /** 分布更新窗口的弹窗 */

  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<Partial<API.Teacher> | undefined>(undefined);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.Teacher>();
  const [selectedRowsState, setSelectedRows] = useState<API.Teacher[]>([]);
  const [radiogroupModel, setRadiogroupModel] = useState<string>('1');
  /** 国际化配置 */


  
  const { run: postRun } = useRequest(
    (method, params) => {
      if (method === 'remove') {
        return removeFakeList(params);
      }
      if (method === 'update') {
        return updateFakeList(params);
      }
      return addFakeList(params);
    },
    {
      manual: true,
      onSuccess: (result) => {
        mutate(result);
      },
    },
  );

  const file_props = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };



  type UpdateFormProps = {
    onSubmit: (e: React.MouseEvent<HTMLElement>) => void;
    updateModalVisible: boolean;
    values: Partial<API.StudentAnswer>;
  };


  const UserGradeFrom: React.FC<UpdateFormProps> = (props) => {
    return(      
        <Modal 
        visible = {props.updateModalVisible}
        onCancel = {()=>{handleUpdateModalVisible(false)}}
        onOk = {props.onSubmit}
        >      
          <Card title="人工评分" >
              <h2>题目</h2>
              <p>{props.values.subjectText}</p>
              <h2>参考答案</h2>
              <p>{props.values.standText}</p>
              <h2>分值</h2>
              <p>{props.values.values}</p>
              <h2>学生答题</h2>
              <p>{props.values.answerText}</p>
              <ProFormDigit
              label='分数'          
              width="md"
              name = {props.values.userScore}
            />
          </Card>          
        </Modal>

  
    )


  }

  

  

  
  const deleteItem = (id: string) => {
    console.log('删除记录'+id)
    postRun('remove', { id });
  };
  
  const deleteRecord = (currentItem: API.StudentAnswer) => {
    Modal.confirm({
      title: '删除记录',
      content: '确定删除'+currentItem.studentName+'这条记录吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => deleteItem(currentItem.id),
    });
  };

  const columns: ProColumns<API.StudentAnswer>[] = [
    {
      title: '考号',
      dataIndex: 'studentId',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '姓名',
      dataIndex: 'studentName',
      valueType: 'text',
    },
    {
      title: '年级',
      dataIndex: 'grade',
      sorter: true,      
    },
    {
      title: '班级',
      dataIndex: 'vclass',
      sorter: true,
    },
    {
      title: '题目',
      dataIndex: 'subjectText',
      sorter: false,
      hideInSearch:true,
    },
    {
      title: '学生答题',
      dataIndex: 'answerText',
      sorter: false,
      hideInSearch:true,
    },
    {
      title: '标准答案',
      dataIndex: 'standText',
      sorter: false,
      hideInSearch:true,
    },
    {
      title: '课程',
      dataIndex: 'lesson',
      sorter: false,
    },
    {
      title: '分值',
      dataIndex: 'values',
      sorter: false,
      hideInSearch:true,
    },
    {
      title: '人工评分',
      dataIndex: 'userScore',
      sorter: false,
      hideInSearch:true,
    },
    {
      title: '自动评分',
      dataIndex: 'autoScore',
      sorter: false,
      hideInSearch:true,
    },    
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (text, record, _, action) => [
        <Button
        key="editable"
        type='primary' 
        onClick={() => {
          handleUpdateModalVisible(true);
          setCurrentRow(record);
        }}
      >
        人工评分
      </Button>,
      <Button
      key=''
      type='primary'       
      onClick={()=>{
        console.log('评分模式：'+radiogroupModel)
        deleteRecord(record)
      }}
      >
       自动评分
      </Button>,
      ],
    },
  ];

  return (
    <PageContainer>
      <Card>
      <ProTable<API.StudentAnswer, API.TableListPagination>
        headerTitle="查询表格"
        actionRef={actionRef}
        editable={{
          onDelete:(key: RecordKey,row: API.StudentAnswer) => {
            console.log(key,row,'onDelete')
            return Promise.resolve()
          },
          onSave:(key: RecordKey,row: API.StudentAnswer) => {
            console.log(key,row,'onSave')
            return Promise.resolve()
          },
          
        }}
        rowKey="id"
        search={{
          labelWidth: 120,
          span:4,          
        }}
        toolBarRender={() => [
          <label>自动评分模式：</label>,


          <Radio.Group  name="radiogroupModel" key='radiogroupModel' defaultValue={parseInt(radiogroupModel)} onChange = {(e)=>{setRadiogroupModel(e.target.value)}}>
          <Radio value={1}>模式一</Radio>
          <Radio value={2}>模式二</Radio>
          <Radio value={3}>模式三</Radio>
          </Radio.Group>,



          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
          <Upload {...file_props} key='upfilename'>
          <Button icon={<UploadOutlined/>}  key='upfile' >导入数据</Button>
          </Upload>,

        ]}
        request={getStudentAnswer}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              项 &nbsp;&nbsp;              
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
          <Button type="primary">批量审批</Button>
        </FooterToolbar>
      )}
      <ModalForm
        title="添加教师信息"
        width="400px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.Teacher);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          label='登录帐号'
          placeholder='登录帐号'
          rules={[
            {
              required: true,
              message: '登录帐号必填',
            },
          ]}
          width="md"
          name="loginName"
        />
        <ProFormText.Password
          label='登录密码'
          placeholder='登录密码'
          rules={[
            {
              required: true,
              message: '登录密码必填',
            },
          ]}
          width="md"
          name="password"
        />
        <ProFormText
          label='教师姓名'
          placeholder='教师姓名'
          rules={[
            {
              required: true,
              message: '教师姓名',
            },
          ]}
          width="md"
          name="name"
        />
        <ProFormText
          label='教师工号'
          placeholder='教师工号'
          rules={[
            {
              required: true,
              message: '教师工号',
            },
          ]}
          width="md"
          name="teacherId"
        />
        <ProFormSelect
          width="sm"
          fieldProps={{
            labelInValue: true,
          }}
          request={async () => [
            { label: '语文', value: '1' },
            { label: '数学', value: '2' },
            { label: '外语', value: '3' },
            { label: '政治', value: '4' },
            { label: '历史', value: '5' },
            { label: '地理', value: '6' },
            { label: '物理', value: '7' },
            { label: '化学', value: '8' },
            { label: '生物', value: '9' },
            { label: '信息技术', value: '10' },
          ]}
          name="course"
          label="课程"
          rules={[
            {
              required: true,
              message: '课程',
            },
          ]}
        />
      </ModalForm>

      <UserGradeFrom
      updateModalVisible = {updateModalVisible}
      values = {currentRow || {}}
      onSubmit = {async (value) => {
        console.log('人工评分成功');
          handleUpdateModalVisible(false);
          setCurrentRow(undefined);
          if (actionRef.current) {
            actionRef.current.reload();
          }        
      }}     
      />     


      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.Teacher>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.Teacher>[]}
          />
        )}
      </Drawer>
      </Card>
    </PageContainer>
  );
};

export default MyTableList;
