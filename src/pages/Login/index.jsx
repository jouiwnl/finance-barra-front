import { Alert, Button, Col, Input, Row } from 'antd';
import React from 'react';
import './styles.css'

import { AuthContext } from '../../contexts/AuthContext'

import {
  UserOutlined,
  LockOutlined
} from '@ant-design/icons';

export default function() {
  const [user, setUser] = React.useState({});
  const [isLogging, setIsLogging] = React.useState(false);

  const { handleLogin } = React.useContext(AuthContext);

  async function login() {
    setIsLogging(true);
    await handleLogin(user);
    setIsLogging(false);
  }

  function handleInputChange(name, value) {
    setUser({...user, [name]: value});
  }
  
	return (
    <div className="wrapper">
      <div className="form-container">
        <div className="img-container">
          <img src="https://upload.wikimedia.org/wikipedia/pt/9/90/BarraFC2020.png" alt="logo" />
        </div>
        <Row>
          <Col span={24}>
            <label htmlFor="usuario">Usuário</label>
            <Input 
              autoComplete='off' 
              size="large" 
              prefix={<UserOutlined />} 
              onChange={(e) => handleInputChange('username', e.target.value)}
              required 
              id='usuario' 
              value={user.username}
            />
          </Col>
        </Row>

        <Row>
          <Col span={24} style={{ marginTop: 15 }}>
            <label htmlFor="senha">Senha</label>
            <Input 
              size="large" 
              prefix={<LockOutlined />} 
              type='password' 
              onChange={(e) => handleInputChange('password', e.target.value)}
              required 
              id='senha' 
              value={user.password}
            />
          </Col>
        </Row>

        <Alert style={{ marginTop: 20 }} message="Caso não possua uma conta, contate o admnistrador do sistema!" />

        <Button onClick={login} loading={isLogging} block className="button-login" type="primary">
          Login
        </Button>
      </div>
    </div>
  )
}