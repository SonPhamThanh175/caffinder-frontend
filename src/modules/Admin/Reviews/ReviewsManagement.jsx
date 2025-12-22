import React, { useState, useEffect } from 'react';
import { Card, Space, message } from 'antd';
import { ShopOutlined } from '@ant-design/icons';
import ShopSelect from './components/ShopSelect';
import StatsCards from './components/StatsCards';
import ReviewsTable from './components/ReviewsTable';
import { mockShops, mockReviews } from './data/mockData';
import './ReviewsManagement.css';
import shopAdminApi from './../../../api/shopAdminApi';

const ReviewsManagement = () => {
    const [shops, setShops] = useState([]);
    const [selectedShop, setSelectedShop] = useState();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchShops = async () => {
            try {
                const res = await shopAdminApi.getAll();
                setShops(res.data);
            } catch (error) {
                console.error('Fetch shops failed:', error);
            }
        };

        fetchShops();
    }, []);

    useEffect(() => {
        if (shops.length > 0) {
            setSelectedShop(shops[0].id);
        }
    }, [shops]);

    useEffect(() => {
        if (!selectedShop) return;

        setLoading(true);

        const filteredReviews = shops.filter((shop) => shop.id === selectedShop);
        setReviews(filteredReviews);
        setLoading(false);
    }, [selectedShop, shops]);

    const handleShopChange = (value) => {
        setSelectedShop(value);
    };

    useEffect(() => {
        if (!selectedShop) return;

        const fetchReviews = async () => {
            setLoading(true);
            try {
                const res = await shopAdminApi.getReviewsByShopId(selectedShop);
                setReviews(res.data);
            } catch (error) {
                console.error('Fetch reviews failed:', error);
                message.error('Không thể tải reviews');
                setReviews([]);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [selectedShop]);

    const handleDelete = async (reviewId) => {
        setLoading(true);
        try {
            await shopAdminApi.deleteReview(reviewId);
            setReviews(reviews.filter((r) => r.id !== reviewId));
            message.success('Đã xóa review thành công!');
        } catch (error) {
            console.error('Delete review failed:', error);
            message.error('Xóa review thất bại');
        } finally {
            setLoading(false);
        }
    };

    const stats = {
        total: reviews.length,
        approved: reviews.filter((r) => r.status === 'approved').length,
        pending: reviews.filter((r) => r.status === 'pending').length,
        avgRating:
            reviews.length > 0 && reviews.some((r) => r.rating)
                ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length).toFixed(1)
                : '0.0',
    };

    return (
        <div className='reviews-management-container'>
            <Card>
                <Space
                    direction='vertical'
                    size='large'
                    style={{ width: '100%' }}
                >
                    <div className='reviews-header'>
                        <div className='reviews-header-content'>
                            <h2 className='reviews-title'>Quản lý Reviews</h2>
                            <p className='reviews-subtitle'>
                                Xem và quản lý đánh giá từ khách hàng
                            </p>
                        </div>
                        <div className='reviews-header-actions'>
                            <ShopOutlined className='shop-icon' />
                            <ShopSelect
                                value={selectedShop}
                                onChange={handleShopChange}
                                shops={shops ? shops : []}
                            />
                        </div>
                    </div>

                    <StatsCards stats={stats} />

                    <ReviewsTable
                        reviews={reviews}
                        loading={loading}
                        onDelete={handleDelete}
                    />
                </Space>
            </Card>
        </div>
    );
};

export default ReviewsManagement;
