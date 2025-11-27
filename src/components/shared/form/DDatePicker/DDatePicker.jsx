import { DatePicker } from 'antd';
import { Controller } from 'react-hook-form';
import dayjs from 'dayjs';
import './style.css';

const DDatePicker = ({
    name,
    control,
    label,
    placeholder = 'Chọn ngày',
    format = 'DD/MM/YYYY',
    required = false,
    disabled = false,
    disabledDate,
    showTime = false,
    picker = 'date',
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
        <div className={`d-datepicker ${className}`}>
            {label && (
                <label className="d-datepicker-label">
                    {label}
                    {required && <span className="required-mark">*</span>}
                </label>
            )}
            <Controller
                name={name}
                control={control}
                rules={defaultRules}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <div className="d-datepicker-wrapper">
                        <DatePicker
                            {...rest}
                            picker={picker}
                            format={format}
                            placeholder={placeholder}
                            disabled={disabled}
                            disabledDate={disabledDate}
                            showTime={showTime}
                            value={value ? dayjs(value) : null}
                            onChange={(date) => {
                                onChange(date ? date.toISOString() : null);
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

export default DDatePicker;