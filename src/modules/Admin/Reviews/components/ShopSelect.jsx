// FILE: src/pages/ReviewsManagement/components/ShopSelect.jsx
import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

const ShopSelect = ({ value, onChange, shops }) => {
    return (
        <Select
            value={value}
            onChange={onChange}
            className='shop-select'
            size='large'
        >
            {shops.map((shop) => (
                <Option
                    key={shop.id}
                    value={shop.id}
                >
                    <div className='shop-option'>
                        <div className='shop-option-name'>
                            {shop.displayName || shop.name || 'Unnamed Shop'}
                        </div>
                        <div className='shop-option-owner'>{shop.owner.displayName || 'N/A'}</div>
                    </div>
                </Option>
            ))}
        </Select>
    );
};

export default ShopSelect;
