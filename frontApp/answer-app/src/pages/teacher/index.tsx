import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Input, Drawer, Card, Modal } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { ProColumns, ActionType, TableDropdown } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import { addTeacher, getTeacher, removeTeacher, updateTeacher } from '@/services/ant-design-pro/api';
import { RecordKey } from '@ant-design/pro-utils/lib/useEditableArray';
import { useRequest } from 'umi';
//import { Key } from 'antd/lib/table/interface';


/**
 * 添加节点
 *
 * @param fields
 */

const handleAdd = async (fields: API.Teacher) => {
  const hide = message.loading('正在添加');


  try {
    await  addTeacher(fields);
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
 * 删除节点
 *
 * @param selectedRows
 */

const handleRemove = async (selectedRows: API.Teacher[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;

  try {
    await removeTeacher(
      selectedRows.map((row) => row.id),
    );
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};





const TeacherTable: React.FC = () => {
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** 分布更新窗口的弹窗 */

  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<Partial<API.Teacher> | undefined>(undefined);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.Teacher>();
  const [selectedRowsState, setSelectedRows] = useState<API.Teacher[]>([]);
  /** 国际化配置 */


  
  const { run: postRun } = useRequest(
    (method, params) => {
      if (method === 'remove') {
        return removeTeacher([params]);
      }
      if (method === 'update') {
        return updateTeacher(params);
      }
      return;
    },   
  );
  

  
  const deleteItem = (id: string) => {
    console.log('删除记录'+id)
    postRun('remove', id);
  };
  
  const deleteRecord = (currentItem: API.Teacher) => {
    Modal.confirm({
      title: '删除记录',
      content: '确定删除'+currentItem.name+'这条记录吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => removeTeacher([currentItem.id]),
      
    });
  };

  const columns: ProColumns<API.Teacher>[] = [
    {
      title: '登录帐号',
      dataIndex: 'loginName',
      tip: '登录帐号必须唯一！',
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
      title: '登录密码',
      dataIndex: 'password',
      valueType: 'password',
      search:false,
    },
    {
      title: '教师姓名',
      dataIndex: 'name',
      sorter: true,
    },
    {
      title: '教师工号',
      dataIndex: 'teacherId',
      valueType: 'text',
      sorter: true,
    },
    {
      title: '任教课程',
      dataIndex: 'course',
      valueType: 'text',      
      valueEnum: {
        '语文': {
           text: '语文', 
           status: 'Default'
           },
        '数学': {
          text: '数学',
          status: 'Error',
        },
        '外语': {
          text: '外语',
          status: 'Success',
        },
        '物理': {
          text: '物理',
          status: 'Processing',
        },
        '化学': {
          text: '化学',
          status: 'Processing',
        },
        '生物': {
          text: '生物',
          status: 'Processing',
        },
        '历史': {
          text: '历史',
          status: 'Processing',
        },
        '地理': {
          text: '地理',
          status: 'Processing',
        },
        '信息技术': {
          text: '信息技术',
          status: 'Processing',
        },
      },
    },   
    
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (text, record, _, action) => [
        <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        编辑
      </a>,
      <a
      key="" 
      onClick={()=>{
        deleteRecord(record);
        actionRef.current?.reload;
      }}
      >
       删除
      </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <Card>
      <ProTable<API.Teacher, API.TableListPagination>
        headerTitle="查询表格"
        actionRef={actionRef}
        editable={{
          onDelete:(key: RecordKey,row: API.Teacher) => {
            console.log(key,row,'onDelete')
            removeTeacher([row.id])
            return Promise.resolve()
          },
          onSave:(key: RecordKey,row: API.Teacher) => {
            console.log(key,row,'onSave')
            updateTeacher(row)
            return Promise.resolve()
          },
          
        }}
        rowKey="id"
        search={{
          labelWidth: 120,
          span:4,          
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={getTeacher}
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

          valueEnum={{
            语文: '语文',
            数学: '数学',
            外语: '外语',
            政治: '政治',
            历史: '历史',
            地理: '地理',
            物理: '物理',
            化学: '化学',
            生物: '生物',
            信息技术: '信息技术',
          }}

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

export default TeacherTable;
