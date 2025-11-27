import { InputNumber } from 'antd';
import { Controller } from 'react-hook-form';
import './style.css';

const DInputNumber = ({
    name,
    control,
    label,
    placeholder = 'Nhập số',
    required = false,
    disabled = false,
    min,
    max,
    step = 1,
    precision,
    formatter,
    parser,
    addonBefore,
    addonAfter,
    prefix,
    suffix,
    rules = {},
    className = '',
    ...rest
}) => {
    const defaultRules = {
        ...(required && {
            required: `${label || 'Trường này'} là bắt buộc`,
        }),
        ...(min !== undefined && {
            min: {
                value: min,
                message: `Giá trị tối thiểu là ${min}`,
            },
        }),
        ...(max !== undefined && {
            max: {
                value: max,
                message: `Giá trị tối đa là ${max}`,
            },
        }),
        ...rules,
    };

    return (
        <div className={`d-input-number ${className}`}>
            {label && (
                <label className="d-input-number-label">
                    {label}
                    {required && <span className="required-mark">*</span>}
                </label>
            )}
            <Controller
                name={name}
                control={control}
                rules={defaultRules}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <div className="d-input-number-wrapper">
                        <InputNumber
                            {...rest}
                            placeholder={placeholder}
                            disabled={disabled}
                            min={min}
                            max={max}
                            step={step}
                            precision={precision}
                            formatter={formatter}
                            parser={parser}
                            addonBefore={addonBefore}
                            addonAfter={addonAfter}
                            prefix={prefix}
                            suffix={suffix}
                            value={value}
                            onChange={onChange}
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

export default DInputNumber;