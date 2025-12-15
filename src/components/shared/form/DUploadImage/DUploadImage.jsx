import { useState } from 'react';
import { Upload, message } from 'antd';
import { Upload as UploadIcon, X, Image as ImageIcon } from 'lucide-react';
import './style.css';

const DUploadImage = ({ 
    value = [], 
    onChange, 
    maxCount = 5, 
    maxSize = 5, // MB
    accept = 'image/*',
    listType = 'picture-card' // 'picture-card' | 'picture' | 'text'
}) => {
    const [fileList, setFileList] = useState(
        value.map((url, index) => ({
            uid: `-${index}`,
            name: `image-${index}`,
            status: 'done',
            url: url,
            thumbUrl: url
        }))
    );
    const [previewImage, setPreviewImage] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);

    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const beforeUpload = (file) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('Bạn chỉ có thể upload file ảnh!');
            return Upload.LIST_IGNORE;
        }

        const isLtMaxSize = file.size / 1024 / 1024 < maxSize;
        if (!isLtMaxSize) {
            message.error(`Ảnh phải nhỏ hơn ${maxSize}MB!`);
            return Upload.LIST_IGNORE;
        }

        return false;
    };

    const handleChange = async ({ fileList: newFileList }) => {
        setFileList(newFileList);

        const urls = await Promise.all(
            newFileList.map(async (file) => {
                if (file.url) {
                    return file.url;
                }
                if (file.originFileObj) {
                    return await getBase64(file.originFileObj);
                }
                return null;
            })
        );

        const validUrls = urls.filter(url => url !== null);
        onChange && onChange(validUrls);
    };

    const handleRemove = (file) => {
        const newFileList = fileList.filter(item => item.uid !== file.uid);
        setFileList(newFileList);
        
        const urls = newFileList.map(item => item.url || item.thumbUrl).filter(Boolean);
        onChange && onChange(urls);
    };

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const handleClosePreview = () => {
        setPreviewOpen(false);
        setPreviewImage('');
    };

    const uploadButton = (
        <div className="upload-button">
            <UploadIcon size={32} />
            <div className="upload-text">
                <span className="upload-title">Tải ảnh lên</span>
                <span className="upload-hint">
                    Tối đa {maxCount} ảnh, mỗi ảnh &lt; {maxSize}MB
                </span>
            </div>
        </div>
    );

    return (
        <div className="d-upload-image">
            <Upload
                listType={listType}
                fileList={fileList}
                beforeUpload={beforeUpload}
                onChange={handleChange}
                onRemove={handleRemove}
                onPreview={handlePreview}
                accept={accept}
                multiple
                maxCount={maxCount}
                className="d-upload-wrapper"
            >
                {fileList.length >= maxCount ? null : uploadButton}
            </Upload>

            {previewOpen && (
                <div className="preview-modal" onClick={handleClosePreview}>
                    <div className="preview-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="preview-close-btn" onClick={handleClosePreview}>
                            <X size={24} />
                        </button>
                        <img src={previewImage} alt="Preview" className="preview-image" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default DUploadImage;