import React from 'react';
import { Card } from 'antd';

const StatsCards = ({ stats }) => {
    return (
        <div className='stats-cards-container'>
            <Card className='stat-card stat-card-total'>
                <div className='stat-label'>Tổng reviews</div>
                <div className='stat-value stat-value-total'>{stats.total}</div>
            </Card>
            {/* <Card className='stat-card stat-card-approved'>
                <div className='stat-label'>Đã duyệt</div>
                <div className='stat-value stat-value-approved'>{stats.approved}</div>
            </Card>
            <Card className='stat-card stat-card-pending'>
                <div className='stat-label'>Chờ duyệt</div>
                <div className='stat-value stat-value-pending'>{stats.pending}</div>
            </Card> */}
            <Card className='stat-card stat-card-rating'>
                <div className='stat-label'>Đánh giá TB</div>
                <div className='stat-value stat-value-rating'>{stats.avgRating}</div>
            </Card>
        </div>
    );
};

export default StatsCards;
