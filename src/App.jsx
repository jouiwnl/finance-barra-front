import React from 'react';

import {
  DollarCircleOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  SettingOutlined,
  HomeOutlined,
  UserOutlined, 
  BankOutlined
} from '@ant-design/icons';

import { Avatar, Button, Layout, Menu, Popover } from 'antd';
import { Link } from 'react-router-dom';
import { customHistory } from './CustomBrowserRouter'
import Routes from './routes'

import { AuthContext } from './contexts/AuthContext'

const { Sider, Header } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem('Lançamentos Englobados', '/lancamentos-englobados', <DollarCircleOutlined />),
  getItem('Centros de custo', '/centros-custos', <HomeOutlined />),
  getItem('Sintéticas', '/sinteticas', <SettingOutlined />),
  getItem('Analíticas', '/analiticas', <SettingOutlined />),
  getItem('Bancos', '/bancos', <BankOutlined />),
  getItem('Planos de contas', '/planos-contas', <ShoppingCartOutlined />),
  getItem('Impostos', '/impostos', <DollarCircleOutlined />),
  getItem('Pessoas', '/pessoas', <UserOutlined />),
  getItem('Usuários', '/usuarios', <TeamOutlined />),
];

export default function() {
  const { authenticated, handleLogout, getCurrentUser } = React.useContext(AuthContext);
  const [collapsed, setCollapsed] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState({});
  const [screenWidth, setScreenWidth] = React.useState(screen.width);

  React.useEffect(() => {
    if (screenWidth > 830) {
      getUser();
      return;
    }

    handleLogout()
  }, [authenticated])

  function handleSelectItem(selected) {
    customHistory.push(selected.key)
  }

  function getUser() {
    if (!authenticated) {
      return;
    }

    getCurrentUser().then(response => setCurrentUser(response.data))
  }

  function PopoverContent() {
    function logout() {
      handleLogout();
    }

    return (
      <div>
        <Button block onClick={logout}>Sair</Button>
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh'}}>
      {authenticated && (
        <Sider id="components-layout-demo-side" collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
          <Link to={'/'}>
            <div className="logo">
              <img src="https://upload.wikimedia.org/wikipedia/pt/9/90/BarraFC2020.png" alt="logo" />
              {!collapsed && <h2>Barra - FC</h2>}
            </div>
          </Link>
          <Menu 
            onSelect={handleSelectItem} 
            theme="dark" 
            defaultSelectedKeys={[`${customHistory.location.pathname}`]} 
            mode="inline" 
            items={items} 
          />
        </Sider>
      )}
      
      <Layout className="site-layout">
        {authenticated && (
          <Header className="page-header">
            <p>{currentUser.user}</p>
            <Popover style={{ textDecoration: 'ellipsis' }} content={<PopoverContent />} title={currentUser.nomeCompleto}>
              <Avatar size={40} icon={<UserOutlined />} />
            </Popover>
          </Header>
        )}

        <Routes />

      </Layout>
    </Layout>
  );
};