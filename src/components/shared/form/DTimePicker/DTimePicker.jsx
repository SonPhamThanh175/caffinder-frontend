import { TimePicker } from 'antd';
import { Controller } from 'react-hook-form';
import dayjs from 'dayjs';
import './style.css';

const DTimePicker = ({
    name,
    control,
    label,
    placeholder = 'Chọn giờ',
    format = 'HH:mm',
    required = false,
    disabled = false,
    disabledTime,
    hourStep = 1,
    minuteStep = 1,
    secondStep = 1,
    use12Hours = false,
    showNow = true,
    rules = {},
    className = '',
    ...rest
}) => {
    const defaultRules = {
        ...(required && {
            required: `${label || 'Trường này'} là bắt buộc`,
        }),
        ...rules,
    };

    return (
        <div className={`d-timepicker ${className}`}>
            {label && (
                <label className="d-timepicker-label">
                    {label}
                    {required && <span className="required-mark">*</span>}
                </label>
            )}
            <Controller
                name={name}
                control={control}
                rules={defaultRules}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <div className="d-timepicker-wrapper">
                        <TimePicker
                            {...rest}
                            format={format}
                            placeholder={placeholder}
                            disabled={disabled}
                            disabledTime={disabledTime}
                            hourStep={hourStep}
                            minuteStep={minuteStep}
                            secondStep={secondStep}
                            use12Hours={use12Hours}
                            showNow={showNow}
                            value={value ? dayjs(value, format) : null}
                            onChange={(time) => {
                                onChange(time ? time.format(format) : null);
                            }}
                            status={error ? 'error' : ''}
                            style={{ width: '100%' }}
                        />
                        {error && (
                            <span className="error-message">{error.message}</span>
                        )}
                    </div>
                )}
            />
        </div>
    );
};

export default DTimePicker;