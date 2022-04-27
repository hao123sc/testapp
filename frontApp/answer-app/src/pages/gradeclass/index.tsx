import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Input, Drawer, Card, Modal } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { ProColumns, ActionType, TableDropdown } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import { addGradeClassInfo, addTeacher,  getGradeClassInfo,  getTeacher,  removeTeacher, updateGradeClassInfo, updateTeacher } from '@/services/ant-design-pro/api';
import { RecordKey } from '@ant-design/pro-utils/lib/useEditableArray';
import { useRequest } from 'umi';

//import { Key } from 'antd/lib/table/interface';


/**
 * 添加节点
 *
 * @param fields
 */

const handleAdd = async (fields: API.GradeClassInfo) => {
  const hide = message.loading('正在添加'); 

  try {
    await addGradeClassInfo(fields);    
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

const handleRemove = async (selectedRows: API.GradeClassInfo[]) => {
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





const GradeClassTable: React.FC = () => {
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** 分布更新窗口的弹窗 */


  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.GradeClassInfo>();
  const [selectedRowsState, setSelectedRows] = useState<API.GradeClassInfo[]>([]);
  const [teacherList,setTeacherList] = useState<{label:string,value:string,course:string}[]>([]);
  /** 国际化配置 */


  const getTeacherList =async () => {
    let data = await getTeacher({},{},{})
    let teacherData:{label:string,value:string,course:string}[]=[]
    data.data?.forEach((item)=>{
      let tempData = {label:"",value:"",course:""}
      tempData.label = item.name
      tempData.value = item.id
      tempData.course = item.course
      teacherData.push(tempData)
    })
    setTeacherList(teacherData)
    
  }

  useEffect(()=>{
    getTeacherList();   
  },[])


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
  
  const  teacherCourseList = async (course:string) :Promise<{ label: string; value: string; }[]>=> {
    let res:{label:string,value:string}[]=[]
    teacherList.map(item=>{
      if (item.course==course){
        res.push({label:item.label,value:item.value})
      }
    })
    return res           
    }
  
  const deleteItem = (id: string) => {
    console.log('删除记录'+id)
    postRun('remove', id);
  };
  
  const deleteRecord = (currentItem: API.GradeClassInfo) => {
    Modal.confirm({
      title: '删除记录',
      content: '确定删除'+currentItem.className+currentItem.gradeName+'这条记录吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => removeTeacher([currentItem.id]),
      
    });
  };

  const columns: ProColumns<API.GradeClassInfo>[] = [
    {
      title: '年级',
      dataIndex: 'gradeName',
      sorter: true,
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
      title: '班级',
      dataIndex: 'className',
      sorter: true,      
    },
    {
      title: '班主任',
      dataIndex: 'teacherMain',
      sorter: true,
    },
    {
      title: '语文',
      dataIndex: 'yuwen',
      search:false,
    },
    {
      title: '数学',
      dataIndex: 'shuxue',
      search:false,
    },
    {
      title: '外语',
      dataIndex: 'waiyu',
      search:false,
      valueType: 'text', 
    },
    {
      title: '政治',
      dataIndex: 'zhengzhi',
      search:false,
      valueType: 'text', 
    },
    {
      title: '历史',
      dataIndex: 'lishi',
      search:false,
      valueType: 'text', 
    },
    {
      title: '地理',
      dataIndex: 'dili',
      search:false,
      valueType: 'text', 
    },
    {
      title: '物理',
      dataIndex: 'wuli',
      search:false,
      valueType: 'text', 
    },
    {
      title: '化学',
      dataIndex: 'huaxue',
      search:false,
      valueType: 'text', 
    },
    {
      title: '生物',
      dataIndex: 'shenwu',
      search:false,
      valueType: 'text', 
    },
    {
      title: '信息技术',
      dataIndex: 'xinxijishu',
      search:false,
      valueType: 'text', 
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
      <ProTable<API.GradeClassInfo, API.TableListPagination>
        headerTitle="查询表格"
        actionRef={actionRef}
        editable={{
          onDelete:(key: RecordKey,row: API.GradeClassInfo) => {
            console.log(key,row,'onDelete')
            removeTeacher([row.id])
            return Promise.resolve()
          },
          onSave:(key: RecordKey,row: API.GradeClassInfo) => {
            console.log(key,row,'onSave')
            updateGradeClassInfo(row)
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
        request={getGradeClassInfo}
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
        title="添加班级信息"
        width="400px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.GradeClassInfo);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();              
            }
          }
        }}
      >
        <ProFormText
          label='年级'
          placeholder='年级'
          rules={[
            {
              required: true,
              message: '年级必填！',
            },
          ]}
          width="md"
          name="gradeName"
        />
        <ProFormText
          label='班级'
          placeholder='班级'
          rules={[
            {
              required: true,
              message: '班级必填',
            },
          ]}
          width="md"
          name="className"
        />
        <ProFormSelect
          width="sm"
          fieldProps={{
            labelInValue: true,
          }}

          options={teacherList}

          name="teacherMain"
          label="班主任"
          rules={[
            {
              required: true,
              message: '班主任必选',
            },
          ]}
        />
        <ProFormSelect
          width="sm"
          fieldProps={{
            labelInValue: true,
          }}

          request={()=>{
            return teacherCourseList('语文')
           }}

          name="yuwen"
          label="语文"
        />
        <ProFormSelect
          width="sm"
          fieldProps={{
            labelInValue: true,
          }}

         request={()=>{
          return teacherCourseList('数学')
         }}

          name="shuxue"
          label="数学"
        />
        <ProFormSelect
          width="sm"
          fieldProps={{
            labelInValue: true,
          }}

          request={()=>{
            return teacherCourseList('外语')
           }}

          name="waiyu"
          label="外语"
        />
        <ProFormSelect
          width="sm"
          fieldProps={{
            labelInValue: true,
          }}

          request={()=>{
            return teacherCourseList('政治')
           }}

          name="zhengzhi"
          label="政治"
        />
        <ProFormSelect
          width="sm"
          fieldProps={{
            labelInValue: true,
          }}

          request={()=>{
            return teacherCourseList('历史')
           }}

          name="lishi"
          label="历史"
        />
        <ProFormSelect
          width="sm"
          fieldProps={{
            labelInValue: true,
          }}

          request={()=>{
            return teacherCourseList('地理')
           }}

          name="dili"
          label="地理"
        />
        <ProFormSelect
          width="sm"
          fieldProps={{
            labelInValue: true,
          }}

          request={()=>{
            return teacherCourseList('物理')
           }}         

          name="wuli"
          label="物理"
        />
        <ProFormSelect
          width="sm"
          fieldProps={{
            labelInValue: true,
          }}


          request={()=>{
            return teacherCourseList('化学')
           }}

          name="huaxue"
          label="化学"
        />
        <ProFormSelect
          width="sm"
          fieldProps={{
            labelInValue: true,
          }}


          request={()=>{
            return teacherCourseList('生物')
           }}

          name="shengwu"
          label="生物"         
        />
        <ProFormSelect
          width="sm"
          fieldProps={{
            labelInValue: true,
          }}

          request={()=>{
            return teacherCourseList('信息技术')
           }}
          name="xinxijishu"
          label="信息技术"          
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

export default GradeClassTable;
