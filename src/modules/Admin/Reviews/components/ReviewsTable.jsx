import React from 'react';
import { Table, Tag, Rate, Button, Space, Avatar, Popconfirm } from 'antd';
import { DeleteOutlined, UserOutlined } from '@ant-design/icons';

const ReviewsTable = ({ reviews, loading, onDelete }) => {
    const columns = [
        {
            title: 'Khách hàng',
            dataIndex: 'customerName',
            key: 'customerName',
            render: (text, record) => (
                <Space>
                    <Avatar
                        className='customer-avatar'
                        icon={<UserOutlined />}
                    />
                    <div className='customer-info'>
                        <div className='customer-name'>{text}</div>
                        <div className='customer-email'>{record.customerEmail}</div>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Đánh giá',
            dataIndex: 'rating',
            key: 'rating',
            width: 150,
            render: (rating) => (
                <Rate
                    disabled
                    defaultValue={rating}
                />
            ),
        },
        {
            title: 'Nhận xét',
            dataIndex: 'comment',
            key: 'comment',
            ellipsis: true,
        },
        {
            title: 'Ngày',
            dataIndex: 'createdAt',
            key: 'date',
            width: 120,
            render: (createdAt) => new Date(createdAt).toLocaleDateString('vi-VN'),
        },

        {
            title: 'Hành động',
            key: 'action',
            width: 100,
            render: (_, record) => (
                <Popconfirm
                    title='Xóa review'
                    description='Bạn có chắc chắn muốn xóa review này?'
                    onConfirm={() => onDelete(record.id)}
                    okText='Xóa'
                    cancelText='Hủy'
                    okButtonProps={{ danger: true }}
                >
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        type='text'
                    >
                        Xóa
                    </Button>
                </Popconfirm>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={reviews}
            rowKey='id'
            loading={loading}
            pagination={{
                pageSize: 10,
                showTotal: (total) => `Tổng ${total} reviews`,
            }}
            className='reviews-table'
        />
    );
};

export default ReviewsTable;
