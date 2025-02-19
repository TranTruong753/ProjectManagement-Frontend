import React from 'react'

import ModalDepartment from '@/components/modal/ModalDepartment'

import FormDepartment from '@/components/form/FormDepartment'

import PageHeader from '../components/PageHeader';

import { Table, Drawer  } from 'antd';

import { Search } from 'lucide-react';

const DepartmentSection = (props) => {
    const {
        handleNewDepartment,
        columns,
        data,
        isModalOpen,
        setIsModalOpen,
        handleOk,
        handleCancel,
        titleModal,
        useData,
        setUseData,
        onClose,
        open,
        form,
        formItemLayout,
        formItems,
        type,
        itemsBreadcrumb,
    } = props 

   

  return (
    <>
        <PageHeader 
            title={'Phòng Ban'} 
            titleButton={'Thêm Phòng Ban Mới'} 
            itemsBreadcrumb={itemsBreadcrumb}
            handleNewDepartment={handleNewDepartment}
        />


        <div className="input bg-white mb-5 dark:bg-slate-900">
            <Search
                size={20}
                className="text-slate-300"
            />
            <input
                type="text"
                name="search"
                id="search"
                placeholder="Search..."
                className="w-full bg-transparent text-slate-900 outline-0 placeholder:text-slate-300 dark:text-slate-50"
            />
        </div>

        <Table className='select-none' columns={columns} dataSource={data} 
            pagination={{
                // pageSize: , // Mặc định 10 dòng mỗi trang
                showSizeChanger: true, // Cho phép chọn số dòng mỗi trang
                pageSizeOptions: ['10', '20', '50', '100'], // Các tùy chọn số dòng
              }}
        />

        <ModalDepartment
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            handleOk={handleOk}
            handleCancel={handleCancel}
            title={titleModal}
            useData={useData}
            setUseData={setUseData}
            formItemLayout={formItemLayout}
            form={form} 
            type={type}
            formItems={formItems}
         
        />

        <Drawer title="Thông tin Phòng Ban" onClose={onClose} open={open} width={'30%'}>
            <FormDepartment form={form} formItemLayout={formItemLayout} formItems={formItems}></FormDepartment>
        </Drawer>
    </>
  )
}

export default DepartmentSection