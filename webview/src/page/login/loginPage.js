import React, { useState } from 'react';
import FreshestLayout from '../../components/layout/freshestLayout';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { navigate } from '@reach/router';
import axios from '../../service/axios';

import './loginPage.scss';

const LoginPage = () => {
    const [user, setUser] = useState({ id: '', password: '' });

    const onLoginClick = (e) => {
        e.preventDefault();
        console.log('click login');
        (async () => {
            try {
                const response = await axios.post('/login', { user });
                navigate('/sites?token=' + encodeURIComponent(response.data.token));
            } catch (err) {
                console.error(err);
            }
        })();
    };

    const handleInput = (event) => {
        event.persist();
        setUser(prevState => {
            const newState = { ...prevState };
            newState[event.target.name] = event.target.value;
            return newState;
        });
    };

    return <FreshestLayout className='loginPage' title={'Đăng Nhập'}>
        <Container className='loginBody'>
            <Col>
                <Row>
                    <Form className={'loginForm'}>
                        <Form.Group controlId='formBasicEmail'>
                            <Form.Control type='text' name='id' value={user.id} placeholder='Tên đăng nhập' onChange={handleInput}/>
                        </Form.Group>

                        <Form.Group controlId='formBasicPassword'>
                            <Form.Control type='password' name='password' value={user.password} placeholder='Mật khẩu' onChange={handleInput}/>
                        </Form.Group>
                        <Button variant="primary" type="submit" onClick={onLoginClick}>
                            Đăng Nhập
                        </Button>
                    </Form>
                </Row>
            </Col>
        </Container>
    </FreshestLayout>;
};

export default LoginPage;
