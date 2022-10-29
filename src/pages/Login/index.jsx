import { Alert, Button, Col, Form, Input, Row } from 'antd';
import React from 'react';
import './styles.css'

import { AuthContext } from '../../contexts/AuthContext'

import {
  UserOutlined,
  LockOutlined
} from '@ant-design/icons';
import CustomLabel from '../../components/CustomLabel';
import { notificar } from '../../utils/Notification';

export default function() {
  const [isLogging, setIsLogging] = React.useState(false);
  const formRef = React.useRef();

  const [form] = Form.useForm();

  const { handleLogin } = React.useContext(AuthContext);

  function onLogin() {
    form.validateFields()
      .then(values => {
        login(values);
      })
      .catch((info) => {
        notificar('error', 'Houve um erro ao validar o formulário. Preencha os campos corretamente');
      });
  }

  async function login(values) {
    setIsLogging(true);
    await handleLogin(values);
    setIsLogging(false);
  }

  function handleKeyUp(event) {
    if (event.keyCode === 13) {
      onLogin();
    }
  }
  
	return (
    <div className="wrapper">
      <div className="form-container">
        <div className="img-container">
          <img src="https://upload.wikimedia.org/wikipedia/pt/9/90/BarraFC2020.png" alt="logo" />
        </div>
          <Form onKeyUp={handleKeyUp} ref={formRef} layout="vertical" form={form}>
            <Row>
              <Col span={24}>
                <CustomLabel htmlFor="username" labelText="Usuário" required={true} />
                <Form.Item 
                  rules={[{ required: true, message: '' }]} 
                  name="username"
                  id='username' 
                  style={{ marginBottom: 10 }}
                >
                  <Input 
                    autoComplete='off' 
                    size="large" 
                    prefix={<UserOutlined />} 
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <CustomLabel htmlFor="password" labelText="Senha" required={true} />
                <Form.Item 
                    rules={[{ required: true, message: '' }]} 
                    name="password"
                    style={{ marginBottom: 10 }}
                    id='senha' 
                  >
                    <Input 
                      size="large" 
                      prefix={<LockOutlined />} 
                      type='password' 
                    />
                </Form.Item>
              </Col>
            </Row>

            <Alert style={{ marginTop: 20 }} message="Caso não possua uma conta, contate o admnistrador do sistema!" />

            <Button onClick={onLogin} loading={isLogging} block className="button-login" type="primary">
              Login
            </Button>
          </Form>
      </div>
    </div>
  )
}