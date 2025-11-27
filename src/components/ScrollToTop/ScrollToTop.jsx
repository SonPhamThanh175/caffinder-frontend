import { ArrowUpOutlined } from '@ant-design/icons';
import { Button } from 'antd';

export default function ScrollToTop() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <Button
            type='primary'
            icon={<ArrowUpOutlined />}
            size='large'
            style={{
                marginRight: '40px',
                marginBottom: '40px',
                position: 'fixed',
                bottom: '0',
                right: '0',
                background: 'linear-gradient(135deg, #8b5a2b 0%, #6b4423 100%)',
            }}
            onClick={scrollToTop}
        />
    );
}
