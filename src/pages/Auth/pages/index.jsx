import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { useSnackbar } from 'notistack';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { loginSchema, registerSchema } from '../validationSchema';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../../../store/slices/userSlice';
import { FacebookFilled, GoogleOutlined } from '@ant-design/icons';
import './style.css';

export const LoginPage = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [isSwitch, setIsSwitch] = useState(false);

    const changeForm = (e) => {
        e.preventDefault();
        setIsSignUp(!isSignUp);
        setIsSwitch(!isSwitch);
    };

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const handleLoginSubmit = async (values, { setSubmitting }) => {
        console.log('🚀 Form submitted with values:', values);
        
        try {
            const action = login(values);
            console.log('📤 Dispatching action...');
            
            const resultAction = await dispatch(action);
            console.log('📥 Result action:', resultAction);
            
            const result = unwrapResult(resultAction);
            console.log('✅ Login result:', result);

            enqueueSnackbar('☕ Welcome back to Caffinder!', { variant: 'success' });

            const userRole = result.user.role;
            console.log('👤 User role:', userRole);
            
            switch (userRole) {
                case 'admin':
                    navigate('/admin/dashboard');
                    break;
                case 'owner':
                    navigate('/owner/dashboard');
                    break;
                case 'user':
                    navigate('/user');
                    break;
                default:
                    navigate('/');
            }
        } catch (error) {
            console.error('❌ Login error:', error);
            const errMessage = error.response?.data?.message || error.message || 'Login failed';
            console.log('Failed to login : ', errMessage);
            enqueueSnackbar(errMessage, { variant: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleRegisterSubmit = async (values, { setSubmitting, resetForm }) => {
        const { confirmPassword, ...submitValues } = values;
        console.log('🚀 Register form submitted:', submitValues);

        try {
            const action = register(submitValues);
            console.log('📤 Dispatching register action...');
            
            const resultAction = await dispatch(action);
            console.log('📥 Register result:', resultAction);
            
            unwrapResult(resultAction);
            
            enqueueSnackbar('☕ Registration successful! Welcome to Caffinder community!', { 
                variant: 'success' 
            });
            
            resetForm();
            setTimeout(() => {
                setIsSignUp(false);
                setIsSwitch(false);
            }, 500);
        } catch (error) {
            console.error('❌ Register error:', error);
            const errMessage =
                error.response?.data?.message || error.message || 'Registration failed';
            console.log('Failed to register : ', errMessage);
            enqueueSnackbar(errMessage, { variant: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    const HandleLoginWithFacebook = () => {
        window.location.href = 'http://localhost:5000/api/auth/facebook/login';
    };

    const HandleLoginWithGoogle = () => {
        window.location.href = 'http://localhost:5000/api/auth/google/login';
    };

    return (
        <div className='login-page'>
            {/* Caffinder Logo */}
            <div className='caffinder-logo'>
                ☕ Caffinder
            </div>

            <div className='main-login-page'>
                {/* Register Form */}
                <div className={`a-container ${isSwitch && 'is-txl is-z200'}`}>
                    <Formik
                        initialValues={{
                            username: '',
                            displayName: '',
                            password: '',
                            confirmPassword: '',
                            role: 'user'
                        }}
                        validationSchema={registerSchema}
                        onSubmit={handleRegisterSubmit}
                        enableReinitialize
                    >
                        {({ isSubmitting }) => (
                            <Form className='form' id='a-form'>
                                <h2 className='form_title title'>Join Caffinder</h2>
                                <span className='form__span'>
                                    Start your coffee journey today
                                </span>
                                
                                <Field
                                    className='form__input'
                                    name='username'
                                    type='text'
                                    placeholder='Username'
                                />
                                <ErrorMessage
                                    name='username'
                                    component='div'
                                    className='text-danger'
                                />
                                
                                <Field
                                    className='form__input displayName'
                                    name='displayName'
                                    type='text'
                                    placeholder='Display Name'
                                />
                                <ErrorMessage
                                    name='displayName'
                                    component='div'
                                    className='text-danger'
                                />
                                
                                <Field
                                    className='form__input password'
                                    name='password'
                                    type='password'
                                    placeholder='Password'
                                />
                                <ErrorMessage
                                    name='password'
                                    component='div'
                                    className='text-danger'
                                />
                                
                                <Field
                                    className='form__input'
                                    name='confirmPassword'
                                    type='password'
                                    placeholder='Confirm Password'
                                />
                                <ErrorMessage
                                    name='confirmPassword'
                                    component='div'
                                    className='text-danger'
                                />

                                <Field
                                    as='select'
                                    className='form__input'
                                    name='role'
                                >
                                    <option value='user'>User - Coffee Lover</option>
                                    <option value='owner'>Owner - Coffee Shop Owner</option>
                                </Field>
                                <ErrorMessage
                                    name='role'
                                    component='div'
                                    className='text-danger'
                                />

                                <button
                                    className='form__button button submit'
                                    type='submit'
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'CREATING...' : 'SIGN UP'}
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>

                {/* Login Form */}
                <div className={`b-container ${isSwitch && 'is-txl'}`}>
                    <Formik
                        initialValues={{
                            username: '',
                            password: '',
                        }}
                        validationSchema={loginSchema}
                        onSubmit={handleLoginSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form className='form'>
                                <h2 className='form_title title'>Welcome Back</h2>
                                
                                <div className='form__icons'>
                                    <div 
                                        className='form__icon'
                                        onClick={HandleLoginWithFacebook}
                                        title='Continue with Facebook'
                                    >
                                        <FacebookFilled style={{ fontSize: '24px', color: '#FFFFFF' }} />
                                    </div>
                                    <div 
                                        className='form__icon'
                                        onClick={HandleLoginWithGoogle}
                                        title='Continue with Google'
                                    >
                                        <GoogleOutlined style={{ fontSize: '24px', color: '#FFFFFF' }} />
                                    </div>
                                </div>
                                
                                <span className='form__span'>or sign in with your account</span>
                                
                                <Field
                                    className='form__input'
                                    name='username'
                                    type='text'
                                    placeholder='Username or Email'
                                />
                                <ErrorMessage
                                    name='username'
                                    component='div'
                                    className='text-danger'
                                />
                                
                                <Field
                                    className='form__input'
                                    name='password'
                                    type='password'
                                    placeholder='Password'
                                />
                                <ErrorMessage
                                    name='password'
                                    component='div'
                                    className='text-danger'
                                />
                                
                                <a href='/forgotPassword' className='form__link'>
                                    Forgot your password?
                                </a>
                                
                                <button
                                    className='form__button button submit'
                                    type='submit'
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'SIGNING IN...' : 'SIGN IN'}
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>

                {/* Switch Panel */}
                <div className={isSwitch ? 'switch is-gx is-txr' : 'switch'} id='switch-cnt'>
                    <div className={`switch__circle ${isSwitch && 'is-txr'}`}></div>
                    <div
                        className={`switch__circle switch__circle--t ${isSwitch && 'is-txr'}`}
                    ></div>
                    
                    {/* Welcome Back Panel */}
                    <div
                        className={`switch__container ${isSwitch && 'is-hidden'}`}
                        id='switch-c1'
                    >
                        <h2 className='switch__title title'>Hello, Coffee Lover!</h2>
                        <p className='switch__description description'>
                            Don't have an account yet? Join our community and discover amazing coffee shops near you!
                        </p>
                        <button onClick={changeForm} className='switch__button button switch-btn'>
                            SIGN UP
                        </button>
                    </div>
                    
                    {/* Hello Friend Panel */}
                    <div
                        className={`switch__container ${!isSwitch && 'is-hidden'}`}
                        id='switch-c2'
                    >
                        <h2 className='switch__title title'>Welcome Back!</h2>
                        <p className='switch__description description'>
                            Already have an account? Sign in to continue your coffee discovery journey!
                        </p>
                        <button onClick={changeForm} className='switch__button button switch-btn'>
                            SIGN IN
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};