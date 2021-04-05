import React from 'react';
import FreshestLayout from '../../components/layout/freshestLayout';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { navigate } from "@reach/router"

import './loginPage.scss';

const LoginPage = () => {
    const onLoginClick = (e) => {
        e.preventDefault();
        console.log('click login');
    };

    return <FreshestLayout className='loginPage' title={'Đăng Nhập'}>
        <Container className='loginBody'>
            <Col>
                <Row>
                    <Form className={'loginForm'}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Control type="text" placeholder="Tên đăng nhập"/>
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Control type="password" placeholder="Mật khẩu"/>
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
