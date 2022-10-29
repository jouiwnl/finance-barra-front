import { Breadcrumb, Button, Layout, Skeleton } from 'antd';
import { Table, Input  } from 'antd';
import React from 'react';

import { UsuariosService } from '../../services/UsuariosService';
import Actions from './components/Actions';
import ModalUsuarios from './components/ModalUsuarios';

const { Content } = Layout;
const { Search } = Input;

export default function() {
  const [usuarios, setUsuarios] = React.useState([])
  const [usuariosFiltered, setUsuariosFiltered] = React.useState(null)
  const [loadingRegisters, setLoadingRegisters] = React.useState(false);
  const [triggerModal, setTriggerModal] = React.useState(false)

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'nomeCompleto',
      key: 'nome'
    },
    {
      title: 'Usuário',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: 'Cargo',
      dataIndex: 'tipo',
      key: 'cargo',
    },
    {
      title: '',
      key: 'acoes',
      align: 'center',
      render: (_, record) => 
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
          <Actions reload={init} record={record} />
        </div>
    },
  ];

	function handleOpenModalRegister() {
		setTriggerModal(true)
	}

	function onCloseModalRegister(recordSaved) {
		setTriggerModal(false)

		if (recordSaved) {
			init();
		}
	}

  React.useEffect(() => {
    init();
  }, [])

  function init() {
    setLoadingRegisters(true)

    UsuariosService.findAll()
      .then(({ data }) => setUsuarios(data))
      .finally(() => setLoadingRegisters(false));
    
  }

  function filterFuncionarios(event) {
    setUsuariosFiltered(
      usuarios
        .filter(f => f.nomeCompleto.toLowerCase().includes(event.target.value.toLowerCase()))
    )
  }

  return (
    <Content style={{ margin: '0 16px'}}>
      <Breadcrumb style={{ margin: '16px 0', fontSize: 24, fontWeight: 500 }}>
        <Breadcrumb.Item>Usuários</Breadcrumb.Item>
      </Breadcrumb>

      <div className="site-layout-background" style={{ padding: 16, minHeight: 360 }}>
        <div className="content-header">
          <Button onClick={handleOpenModalRegister} type="primary">+ Usuário</Button>
          <div className="search-group">
            <Button onClick={init} loading={loadingRegisters} type='primary' style={{ marginRight: 10 }}>
              Atualizar
            </Button>
            
            <Search allowClear onChange={filterFuncionarios} style={{ width: 300 }} placeholder="input search text" enterButton />
          </div>
        </div>

        {loadingRegisters ? (
          <Skeleton style={{ padding: 24, minHeight: 360 }} active />
        ) : (
          <Table size='small' columns={columns} dataSource={usuariosFiltered ?? usuarios} rowKey={(row) => row.id} />
        )}
      </div>

      {triggerModal && <ModalUsuarios onClose={onCloseModalRegister} triggerModal={triggerModal} />}  
    </Content>
  )
}