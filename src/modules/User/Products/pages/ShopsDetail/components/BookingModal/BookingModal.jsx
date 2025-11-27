import { Modal, Button, Input, message, Alert, Spin } from 'antd';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import dayjs from 'dayjs';
import DDatePicker from '../../../../../../../components/shared/form/DDatePicker/DDatePicker';
import DTimePicker from '../../../../../../../components/shared/form/DTimePicker/DTimePicker';
import DInputNumber from '../../../../../../../components/shared/form/DInputNumber/DInputNumber';
import bookingApi from '../../../../../../../api/bookingApi';
import './style.css';

const { TextArea } = Input;

const BookingModal = ({ visible, onCancel, shop }) => {
    const [availability, setAvailability] = useState(null);
    const [checking, setChecking] = useState(false);
    const [creating, setCreating] = useState(false);

    const { control, handleSubmit, watch, reset, setValue } = useForm({
        defaultValues: {
            bookingDate: null,
            bookingTime: null,
            numberOfGuests: 1,
            customerName: '',
            customerPhone: '',
            note: '',
        },
    });

    const watchDate = watch('bookingDate');
    const watchTime = watch('bookingTime');
    const watchGuests = watch('numberOfGuests');

    const handleClose = () => {
        reset();
        setAvailability(null);
        onCancel();
    };

    const handleCheckAvailability = async () => {
        if (!watchDate || !watchTime || !watchGuests) {
            message.warning('Vui lòng điền đầy đủ thông tin ngày, giờ và số khách');
            return;
        }

        try {
            setChecking(true);
            const formData = {
                shopId: shop.id,
                date: dayjs(watchDate).format('YYYY-MM-DD'),
                time: watchTime,
                numberOfGuests: watchGuests,
            };

            const response = await bookingApi.checkAvailability(formData);
            setAvailability(response);

            if (response.isAvailable) {
                message.success('Còn chỗ trống! Bạn có thể đặt bàn.');
            } else {
                message.warning('Không còn chỗ trống cho thời gian này.');
            }
        } catch (error) {
            console.error('Error checking availability:', error);
            message.error('Có lỗi khi kiểm tra chỗ trống');
        } finally {
            setChecking(false);
        }
    };

    const onSubmit = async (data) => {
        if (!availability?.isAvailable) {
            message.error('Vui lòng kiểm tra chỗ trống trước khi đặt bàn');
            return;
        }

        try {
            setCreating(true);
            const bookingData = {
                shopId: shop.id,
                bookingDate: dayjs(data.bookingDate).format('YYYY-MM-DD'),
                bookingTime: data.bookingTime,
                numberOfGuests: data.numberOfGuests,
                customerName: data.customerName,
                customerPhone: data.customerPhone,
                note: data.note,
            };

            await bookingApi.createBooking(bookingData);
            message.success('Đặt bàn thành công!');
            handleClose();
        } catch (error) {
            console.error('Error creating booking:', error);
            message.error('Có lỗi khi đặt bàn. Vui lòng thử lại.');
        } finally {
            setCreating(false);
        }
    };

    const disabledDate = (current) => {
        return current && current < dayjs().startOf('day');
    };

    const disabledTime = () => {
        const selectedDate = dayjs(watchDate);
        const now = dayjs();
        
        if (selectedDate.isSame(now, 'day')) {
            return {
                disabledHours: () => {
                    const hours = [];
                    for (let i = 0; i < now.hour(); i++) {
                        hours.push(i);
                    }
                    return hours;
                },
            };
        }
        return {};
    };

    const handleFieldChange = () => {
        setAvailability(null);
    };

    return (
        <Modal
            title={`Đặt bàn tại ${shop?.name}`}
            open={visible}
            onCancel={handleClose}
            footer={null}
            width={600}
            className="booking-modal"
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <DDatePicker
                    name="bookingDate"
                    control={control}
                    label="Ngày đặt bàn"
                    placeholder="Chọn ngày"
                    required
                    disabledDate={disabledDate}
                    onChange={handleFieldChange}
                />

                <DTimePicker
                    name="bookingTime"
                    control={control}
                    label="Giờ đặt bàn"
                    placeholder="Chọn giờ"
                    required
                    format="HH:mm"
                    minuteStep={15}
                    disabledTime={disabledTime}
                    onChange={handleFieldChange}
                />

                <DInputNumber
                    name="numberOfGuests"
                    control={control}
                    label="Số lượng khách"
                    placeholder="Nhập số khách"
                    required
                    min={1}
                    max={shop?.totalCapacity || 20}
                    addonAfter="người"
                    onChange={handleFieldChange}
                />

                <Button
                    type="dashed"
                    onClick={handleCheckAvailability}
                    loading={checking}
                    block
                    style={{ marginBottom: 20 }}
                    disabled={!watchDate || !watchTime || !watchGuests}
                >
                    Kiểm tra chỗ trống
                </Button>

                {checking && (
                    <div style={{ textAlign: 'center', marginBottom: 20 }}>
                        <Spin tip="Đang kiểm tra..." />
                    </div>
                )}

                {availability && (
                    <Alert
                        message={availability.message}
                        description={
                            <div className="availability-info">
                                <div className="info-row">
                                    <span>Số chỗ yêu cầu:</span>
                                    <strong>{availability.requestedSeats} người</strong>
                                </div>
                                <div className="info-row">
                                    <span>Số chỗ trống:</span>
                                    <strong>{availability.availableSeats} người</strong>
                                </div>
                                <div className="info-row">
                                    <span>Thời gian dự kiến:</span>
                                    <strong>{availability.duration} phút</strong>
                                </div>
                                <div className="info-row">
                                    <span>Kết thúc lúc:</span>
                                    <strong>{availability.estimatedEndTime}</strong>
                                </div>
                                {availability.suggestedTimes && (
                                    <div className="suggested-times">
                                        <p>Thời gian gợi ý khác:</p>
                                        {availability.suggestedTimes.map((time, index) => (
                                            <Button
                                                key={index}
                                                size="small"
                                                onClick={() => setValue('bookingTime', time)}
                                            >
                                                {time}
                                            </Button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        }
                        type={availability.isAvailable ? 'success' : 'warning'}
                        showIcon
                        style={{ marginBottom: 20 }}
                    />
                )}

                {availability?.isAvailable && (
                    <>
                        <div className="customer-info-section">
                            <h4>Thông tin khách hàng</h4>
                            
                            <div className="form-item">
                                <label className="form-label">
                                    Họ và tên <span className="required-mark">*</span>
                                </label>
                                <Input
                                    placeholder="Nhập họ và tên"
                                    value={watch('customerName')}
                                    onChange={(e) => setValue('customerName', e.target.value)}
                                />
                            </div>

                            <div className="form-item">
                                <label className="form-label">
                                    Số điện thoại <span className="required-mark">*</span>
                                </label>
                                <Input
                                    placeholder="Nhập số điện thoại"
                                    value={watch('customerPhone')}
                                    onChange={(e) => setValue('customerPhone', e.target.value)}
                                />
                            </div>

                            <div className="form-item">
                                <label className="form-label">Ghi chú</label>
                                <TextArea
                                    placeholder="Ghi chú thêm (nếu có)"
                                    rows={3}
                                    value={watch('note')}
                                    onChange={(e) => setValue('note', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <Button onClick={handleClose}>
                                Hủy
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={creating}
                            >
                                Xác nhận đặt bàn
                            </Button>
                        </div>
                    </>
                )}
            </form>
        </Modal>
    );
};

export default BookingModal;