import React, { useEffect, useMemo, useState } from 'react';
import { base64encode, base64decode } from 'nodejs-base64';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import { FormLabel, TextField, Input, InputAdornment, IconButton, InputLabel, FormControl, Checkbox, FormControlLabel, Dialog } from '@material-ui/core';
import FreshestLayout from '../../components/layout/freshestLayout';
import axios from '../../service/axios';
import solarImg from '../../asset/picture/solar.jpg';
import { Visibility, VisibilityOff } from '@material-ui/icons';

import './loginPage.scss';

const RememberKey = 'RememberKey';
const RememberIdKey = 'RememberIdKey';
const RememberPasswordKey = 'RememberPasswordKey';

const emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

const LoginPage = ({ onToken }) => {
    const [user, setUser] = useState({ email: '', password: '', passwordConfirm: '', name: '' });
    const [rememberPassword, setRememberPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isRegister, setIsRegister] = useState(false);
    const [error, setError] = useState('');

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const isRemember = !!localStorage.getItem(RememberKey) || false;
        setRememberPassword(isRemember);

        if (isRemember) {
            try {
                const email = localStorage.getItem(RememberIdKey) || '';
                let password = localStorage.getItem(RememberPasswordKey) || '';
                password = base64decode(password);
                setUser({ email, password, passwordConfirm: '', name: '' });
            } catch (e) {
                // ignore
            }
        }
    }, []);

    useEffect(() => setError(''), [isRegister]);

    const handleInput = (event) => {
        event.persist();
        setUser(prevState => {
            const newState = { ...prevState };
            newState[event.target.name] = event.target.value;
            return newState;
        });
    };

    const emailError = useMemo(() => user.email && !emailRegex.test(user.email) ? 'Email không hợp lệ' : '', [user]);
    const canLogin = useMemo(() => user.email && !emailError && user.password, [emailError, user]);

    const confirmPassError = useMemo(() => user.password && user.password !== user.passwordConfirm ? 'Mật khẩu xác nhận không khớp' : '', [user]);
    const canRegister = useMemo(() => user.email && !emailError && user.password && !confirmPassError, [emailError, confirmPassError, user]);

    const loginForm = useMemo(() => {
        if (isRegister) {
            return null;
        }

        const onLoginClick = (e) => {
            e.preventDefault();
            (async () => {
                setLoading(true);
                setError('');
                try {
                    const response = await axios.post('users/login', user);
                    localStorage.setItem(RememberKey, rememberPassword ? 'true' : '');
                    localStorage.setItem(RememberIdKey, rememberPassword ? user.email : '');
                    localStorage.setItem(RememberPasswordKey, rememberPassword ? base64encode(user.password) : '');
                    onToken(response.data.token);
                } catch (err) {
                    console.error(err);
                    if (err.response.status === 400) {
                        setError('Email hoặc mật khẩu không đúng');
                    } else {
                        setError('Đăng nhập không thành công');
                    }
                }
                setLoading(false);
            })();
        };

        return <form className={'loginForm'}>
            <img src={solarImg} alt={'solarPanel'}/>
            <FormControl>
                <TextField error={!!emailError} helperText={emailError} name='email' value={user.email} label='Email đăng nhập' disabled={loading} onChange={handleInput}/>
            </FormControl>
            <FormControl>
                <InputLabel htmlFor='standard-adornment-password'>Mật khẩu</InputLabel>
                <Input
                    id='standard-adornment-password'
                    type={showPassword ? 'text' : 'password'}
                    name='password'
                    value={user.password}
                    disabled={loading}
                    onChange={handleInput}
                    endAdornment={
                        <InputAdornment position={'end'}>
                            <IconButton onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <VisibilityOff/> : <Visibility/>}
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </FormControl>
            <FormControl>
                <FormControlLabel control={<Checkbox
                    checked={rememberPassword}
                    disabled={loading}
                    onChange={e => setRememberPassword(e.target.checked)}/>} label={'Nhớ tài khoản đăng nhập'}/>
            </FormControl>
            <FormLabel className={'errorText'} error={true}>{error}</FormLabel>
            <Button
                variant='primary'
                type='submit'
                onClick={onLoginClick}
                disabled={loading || !canLogin}
            >
                {loading ? <Spinner animation={'border'} size={'sm'}/> : 'Đăng Nhập'}
            </Button>
            <Button variant={'link'} disabled={loading} onClick={() => setIsRegister(true)}>Đăng ký tài khoản</Button>
        </form>;
    }, [loading, error, rememberPassword, user, isRegister, onToken, showPassword, emailError, canLogin]);

    const registerDom = useMemo(() => {
        if (!isRegister) {
            return null;
        }

        const onRegister = (e) => {
            e.preventDefault();
            (async () => {
                setLoading(true);
                setError('');
                try {
                    await axios.post('users/create', user);
                    setShowModal(true);
                    setIsRegister(false);
                } catch (err) {
                    console.error(err);
                    setError('Đăng ký không thành công');
                }
                setLoading(false);
            })();
        };

        const nameError = !user.name || user.name.length > 40 ? 'Tên không hợp lệ' : '';

        return <form>
            <FormControl>
                <TextField error={!!emailError} helperText={emailError} name='email' value={user.email} label='Email đăng nhập' disabled={loading} onChange={handleInput}/>
            </FormControl>
            <FormControl>
                <TextField error={!!nameError} name='name' value={user.name} label='Tên người dùng' disabled={loading} onChange={handleInput}/>
            </FormControl>
            <FormControl>
                <InputLabel htmlFor='standard-adornment-password'>Mật khẩu</InputLabel>
                <Input
                    id='standard-adornment-password'
                    type={showPassword ? 'text' : 'password'}
                    name='password'
                    value={user.password}
                    disabled={loading}
                    onChange={handleInput}
                    endAdornment={
                        <InputAdornment position={'end'}>
                            <IconButton onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <VisibilityOff/> : <Visibility/>}
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </FormControl>
            <FormControl>
                <InputLabel htmlFor='standard-adornment-passwordConfirm' error={!!confirmPassError}>Mật khẩu xác nhận</InputLabel>
                <Input
                    error={!!confirmPassError}
                    id='standard-adornment-passwordConfirm'
                    type={showPassword ? 'text' : 'password'}
                    name='passwordConfirm'
                    value={user.passwordConfirm}
                    disabled={loading}
                    onChange={handleInput}
                    endAdornment={
                        <InputAdornment position={'end'}>
                            <IconButton onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <VisibilityOff/> : <Visibility/>}
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </FormControl>
            <FormLabel className={'errorText'} error={true}>{error}</FormLabel>
            <Button
                variant='primary'
                type='submit'
                onClick={onRegister}
                disabled={loading || !canRegister || !!nameError}
            >
                {loading ? <Spinner animation={'border'} size={'sm'}/> : 'Đăng Ký'}
            </Button>
            <Button variant={'link'} disabled={loading} onClick={() => setIsRegister(false)}>Trờ về đăng nhập</Button>
        </form>;
    }, [isRegister, error, loading, user, showPassword, emailError, confirmPassError, canRegister]);

    const registerModal = useMemo(() => {
        const handleClose = () => {
            setShowModal(false);
        };
        return <Dialog className={'registerModal'} open={showModal} onClose={handleClose}>
            <p>
                Đăng ký thành công
            </p>
            <Button variant='primary' type='submit' onClick={handleClose}>
                Đóng
            </Button>
        </Dialog>;
    }, [showModal]);

    return <FreshestLayout className='loginPage' title={!isRegister ? 'Đăng Nhập' : 'Đăng Ký'}>
        <Container className='loginBody'>
            <Col>
                <Row>
                    {loginForm}
                    {registerDom}
                    {registerModal}
                </Row>
            </Col>
        </Container>
    </FreshestLayout>;
};

export default LoginPage;
