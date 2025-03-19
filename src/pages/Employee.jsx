import React, { useState, useEffect } from 'react';
import { Space, Popconfirm, Form, Input, Select } from 'antd';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import Search from '@/components/Search';
import { Table, Drawer } from 'antd';
import ModalProject from '@/components/modal/Modal';
import FormProject from '@/components/form/Form';
import PageHeader from '@/components/PageHeader';
import ButtonIcon from '@/components/ButtonIcon';
import { employeeGetAPI, employeePostAPI } from '@/Services/EmployeeService';
import {departmentGetAPI, departmentPostAPI, updateManagerForDepartmentAPI} from '@/Services/DepartmentService'

const Employee = () => {
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(16);
  const [useData, setUseData] = useState(null);

  const [departmentData, setDepartmentData] = useState(null);
  const [departmentDataFilter, setDepartmentDataFilter] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [mode, setMode] = useState("");
  const [form] = Form.useForm();
  const [data, setData] = useState(null);

  const handleChange = (value) => {
    console.log(`selected ${value}`);
    if(value === "TP"){
      setDepartmentDataFilter(departmentData
      ?.filter((item) => !item.managerID))
    }else{
      setDepartmentDataFilter(departmentData)
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      const data = await employeeGetAPI();
      const dataDepartment = await departmentGetAPI();
      dataDepartment ? setDepartmentData(dataDepartment) : console.log("error");
      console.log("dataDepartment",dataDepartment);
    
      if (data) {
        const dataItem = data.map((item) => ({
          key: item.id,
          name: item.employeeName,
          position: item.positionName === "TP"? "Trưởng Phòng" : "Nhân Viên",
          phone: item.employeePhone,
          email: item.employeeEmail,
          departmentID: item.departmentID,
          status: item.status ? "Hoạt Động" : "Ngưng Hoạt Động",
        }));
        setData(dataItem);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (useData) {
      form.setFieldsValue(useData);
    }
  }, [form, useData]);

  // tùy chỉnh form kích thước input
  const formItemLayout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };


  const formItems = [
    {
      name: "key",
      label: "Mã nhân viên",
      component: <Input readOnly />,
      hidden: mode === "Add" ? true : false,
    },
    {
      name: "employeeName",
      label: "Tên nhân viên",
      component: <Input placeholder="Nhập tên nhân viên" />,
      rules: [{ required: true, message: "Vui lòng nhập tên nhân viên" }],
    },
    {
      name: "positionName",
      label: "Chức vụ",
      component: <Select   
      // defaultValue={'NV'}
       placeholder="Chọn chức vụ"
      onChange={handleChange}
      options={[
        { value: 'NV', label: 'Nhân Viên' },
        { value: 'TP', label: 'Trường Phòng' },
        
      ]}></Select>,
      rules: [{ required: true, message: "Vui lòng chọn chức vụ" }],
    },
    {
      name: "employeePhone",
      label: "Số điện thoại",
      component: <Input placeholder="Nhập số điện thoại" />,
      rules: [{ required: true, message: "Vui lòng nhập số điện thoại" }],
    },
    {
      name: "employeeEmail",
      label: "Email",
      component: <Input placeholder="Nhập email" />,
      rules: [{ required: true, message: "Vui lòng nhập email" }],
    },
    {
      name: "departmentID",
      label: "Phòng ban",
      component: <Select   
    
        placeholder="Chọn phòng ban"
        options={
          departmentDataFilter?.map((item) => ({
          value: item.id,
          label: item.departmentName,
        })) 
      }
        
        ></Select>,
        rules: [{ required: true, message: "Vui lòng chọn phòng ban" }],
    },
  ];

  const columns = [
    { title: 'ID', dataIndex: 'key', key: 'key' },
    { title: 'Tên Nhân Viên', dataIndex: 'name', key: 'name' },
    { title: 'Chức Vụ', dataIndex: 'position', key: 'position' },
    { title: 'Số Điện Thoại', dataIndex: 'phone', key: 'phone' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Trạng Thái', dataIndex: 'status', key: 'status' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleEditEmployee(record)}><Pencil size={20} /></a>
          <Popconfirm title="Xóa nhân viên?" okText="Có" cancelText="Không">
            <a><Trash2 size={20} /></a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log("values",values);
      const newData = await employeePostAPI(values);
      if (newData) {
        setData([...data, 
          { 
            key: newData.id,
            name: newData.employeeName,
            position: newData.positionName === "TP"? "Trưởng Phòng" : "Nhân Viên",
            phone: newData.employeePhone,
            email: newData.employeeEmail,
            departmentID: newData.departmentID,
            status: newData.status ? "Hoạt Động" : "Ngưng Hoạt Động",
           }
        ]);
        if(newData.positionName === "TP") {
           await updateManagerForDepartmentAPI(newData.departmentID, newData.id)
        }
        setIsModalOpen(false);
      }else {

      }
    } catch (error) {
      console.log(error);
    }
    
  };

  const handleEditEmployee = (value) => {
    setTitle("Sửa Nhân Viên");
    setUseData(value);
    showModal();
    setMode("Edit");
  };

  
  return (
    <>
      <PageHeader title={'Nhân Viên'}>
        <ButtonIcon handleEvent={() => { setDepartmentDataFilter(departmentData),form.resetFields();setTitle("Thêm Nhân Viên"); setMode("Add"); showModal(); }}>
          <Plus /> Thêm Nhân Viên
        </ButtonIcon>
      </PageHeader>

      <div className='mt-5'>
        <Search size={20} />
        <Table columns={columns} dataSource={data} pagination={{ total, defaultCurrent: current, pageSize: 10 }} />
      </div>

      <Drawer title="Thông tin Nhân Viên" onClose={() => setOpen(false)} open={open} width={'30%'}>
        <FormProject form={form} formItems={formItems} />
      </Drawer>

      <ModalProject isModalOpen={isModalOpen} handleOk={handleOk} handleCancel={() => setIsModalOpen(false)} title={title} form={form}>
        <FormProject form={form} formItems={formItems} formItemLayout={formItemLayout} 
           initialValues={{
            positionName: "NV"
            }}
        />
      </ModalProject>
    </>
  );
};

export default Employee;
