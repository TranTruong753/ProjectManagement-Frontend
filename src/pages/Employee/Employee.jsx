import React, { useState, useEffect } from "react";
import { Space, Popconfirm, Form, Input, Select, Descriptions } from "antd";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import Search from "@/components/Search";
import { Table, Drawer } from "antd";
import ModalProject from "@/components/modal/Modal";
import FormProject from "@/components/form/Form";
import PageHeader from "@/components/PageHeader";
import ButtonIcon from "@/components/ButtonIcon";
import { employeeGetAPI, employeePostAPI, employeePutAPI, employeeDeleteAPI } from "@/Services/EmployeeService";
import { departmentGetAPI, departmentPostAPI, updateManagerForDepartmentAPI } from "@/Services/DepartmentService";
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
        if (value === "TP") {
            setDepartmentDataFilter(departmentData?.filter((item) => item.manager === null));
        } else {
            setDepartmentDataFilter(departmentData);
        }
    };

    function setDataEmployees(employees) {
        return employees?.map((item) => ({
            key: item.id,
            name: item.name,
            position: item.position === "TP" ? "Trưởng Phòng" : "Nhân Viên",
            phone_number: item.phone_number,
            email: item.email,
            department: item.department,
            is_deleted: item.is_deleted,
        }));
    }
    //xu lý khi nv là trưởng phòng
    function updateDepartmentManager(newData, departmentData, mutatePutDepartment) {
        if (newData?.position === "TP") {
            const department = departmentData.find((item) => item.id === newData.department);

            if (department) {
                const updatedDepartment = { ...department, manager: newData.id };
                mutatePutDepartment(updatedDepartment);
            }
        }
    }
    const queryClient = useQueryClient();
    //lấy ds nv
    const { data: employees } = useQuery({
        queryKey: ["employees"],
        queryFn: employeeGetAPI,
    });
    //lấy ds phòng ban
    const { data: dataDepartment } = useQuery({
        queryKey: ["departments"],
        queryFn: departmentGetAPI,
    });
    // sửa,xóa nv
    const { data: employeData, mutate: mutatePut } = useMutation({
        mutationFn: employeePutAPI,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["employees"],
            });
        },
    });
    //thêm nv
    const { data: newData, mutate: mutatePost } = useMutation({
        mutationFn: employeePostAPI,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["employees"],
            });
        },
    });
    //cap nhat lại trưởng phòng trong phòng ban
    const { mutate: mutatePutDepartment } = useMutation({
        mutationFn: updateManagerForDepartmentAPI,
    });
    // Cập nhật state chỉ khi `employees` thay đổi
    useEffect(() => {
        if (employees) {
            const employeData = employees.filter((item) => {
                return item.is_deleted !== true;
            });
            console.log("employ", employeData);
            setData(setDataEmployees(employeData));
        }
        dataDepartment ? setDepartmentData(dataDepartment.results) : "";
    }, [employees, dataDepartment]);

    useEffect(() => {
        updateDepartmentManager(newData, departmentData, mutatePutDepartment);
    }, [newData, departmentData, mutatePutDepartment]);

    useEffect(() => {
        updateDepartmentManager(employeData, departmentData, mutatePutDepartment);
    }, [employeData, departmentData, mutatePutDepartment]);
    
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
            name: "name",
            label: "Tên nhân viên",
            component: <Input placeholder="Nhập tên nhân viên" />,
            rules: [{ required: true, message: "Vui lòng nhập tên nhân viên" }],
        },
        {
            name: "position",
            label: "Chức vụ",
            component: (
                <Select
                    // defaultValue={'NV'}
                    placeholder="Chọn chức vụ"
                    onChange={handleChange}
                    options={[
                        { value: "NV", label: "Nhân Viên" },
                        { value: "TP", label: "Trường Phòng" },
                    ]}
                ></Select>
            ),
            rules: [{ required: true, message: "Vui lòng chọn chức vụ" }],
        },
        {
            name: "phone_number",
            label: "Số điện thoại",
            component: <Input placeholder="Nhập số điện thoại" />,
            rules: [{ required: true, message: "Vui lòng nhập số điện thoại" }],
        },
        {
            name: "email",
            label: "Email",
            component: <Input placeholder="Nhập email" />,
            rules: [{ required: true, message: "Vui lòng nhập email" }],
        },
        {
            name: "department",
            label: "Phòng ban",
            component: (
                <Select
                    placeholder="Chọn phòng ban"
                    options={departmentDataFilter?.map((item) => ({
                        value: item.id,
                        label: item.department_name,
                    }))}
                ></Select>
            ),
            rules: [{ required: true, message: "Vui lòng chọn phòng ban" }],
        },
    ];

    const columns = [
        { title: "ID", dataIndex: "key", key: "key" },
        { title: "Tên Nhân Viên", dataIndex: "name", key: "name" },
        { title: "Chức Vụ", dataIndex: "position", key: "position" },
        { title: "Số Điện Thoại", dataIndex: "phone_number", key: "phone" },
        { title: "Email", dataIndex: "email", key: "email" },

        {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <a
                        onClick={() =>
                            handleEditEmployee(record.position === "Trưởng Phòng" ? { ...record, position: "TP" } : { ...record, position: "NV" })
                        }
                    >
                        <Pencil size={20} />
                    </a>
                    <Popconfirm
                        title="Xóa nhân viên?"
                        onConfirm={() => handleDeleteEmployee(record.key)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <a>
                            <Trash2 size={20} />
                        </a>
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
            const values = await form.validateFields(); // Kiểm tra dữ liệu nhập vào form

            if (mode === "Edit") {
                mutatePut({ id: useData.key, obj: values });
            } else {
                // Thêm nhân viên mới
                mutatePost(values);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.log(error);
        }
    };

    const handleEditEmployee = (record) => {
        console.log("Editing record:", record); // Kiểm tra dữ liệu được truyền vào
        setTitle("Sửa Nhân Viên");
        //setUseData(record.position === "Trưởng phòng" ? { ...record, position: "TP" } : { ...record, position: "NV" });
        setUseData(record);
        form.setFieldsValue(record); // Đổ dữ liệu vào form
        setMode("Edit");
        setIsModalOpen(true);
    };

    const handleDeleteEmployee = async (id) => {
        try {
            const deleteEmploye = employees.find((item) => item.id === id);
            if (deleteEmploye) {
                const updatedEmploye = { ...deleteEmploye, is_deleted: true };
                mutatePut({ id: updatedEmploye.id, obj: updatedEmploye });
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <>
            <PageHeader title={"Nhân Viên"}>
                <ButtonIcon
                    handleEvent={() => {
                        setDepartmentDataFilter(departmentData), form.resetFields();
                        setTitle("Thêm Nhân Viên");
                        setMode("Add");
                        showModal();
                    }}
                >
                    <Plus /> Thêm Nhân Viên
                </ButtonIcon>
            </PageHeader>

            <div className="mt-5">
                <Search size={20} />
                <Table
                    columns={columns}
                    dataSource={data}
                    pagination={{ total, defaultCurrent: current, pageSize: 10 }}
                />
            </div>

            <Drawer
                title="Thông tin Nhân Viên"
                onClose={() => setOpen(false)}
                open={open}
                width={"30%"}
            >
                <FormProject
                    form={form}
                    formItems={formItems}
                />
            </Drawer>

            <ModalProject
                isModalOpen={isModalOpen}
                handleOk={handleOk}
                handleCancel={() => setIsModalOpen(false)}
                title={title}
                form={form}
            >
                <FormProject
                    form={form}
                    formItems={formItems}
                    formItemLayout={formItemLayout}
                    initialValues={{
                        positionName: "NV",
                    }}
                />
            </ModalProject>
        </>
    );
};

export default Employee;
