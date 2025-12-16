import { supabase } from '../utils/supabaseClient';
import { message } from 'antd';

class UpLoadService {
    constructor() {
        this.bucketName = 'image';
    }

    async uploadImages(files) {
        const uploadPromises = files.map(async (file) => {
            try {
                const fileName = `${Date.now()}_${file.name}`;
                const filePath = `uploads/${fileName}`;

                const { error } = await supabase.storage
                    .from(this.bucketName)
                    .upload(filePath, file, {
                        cacheControl: '3600',
                        upsert: false,
                    });

                if (error) throw error;

                return this.getUrl(filePath);
            } catch (err) {
                message.error('Có lỗi xảy ra khi upload ảnh');
                return null;
            }
        });

        const results = await Promise.all(uploadPromises);
        return results.filter((url) => url !== null);
    }

    getUrl(path) {
        const { data } = supabase.storage.from(this.bucketName).getPublicUrl(path);

        return data.publicUrl;
    }
}

export default new UpLoadService();
