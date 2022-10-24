import { Breadcrumb, Button, Layout, Skeleton } from 'antd';
import { Table, Input  } from 'antd';
import React from 'react';

import { api } from '../../config/axiosConfig';
import Actions from './components/Actions';
import ModalFuncionarios from './components/ModalFuncionarios';

const { Content } = Layout;
const { Search } = Input;

export default function() {
  const [funcionarios, setFuncionarios] = React.useState([])
  const [funcionariosFiltered, setFuncionariosFiltered] = React.useState(null)
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
      dataIndex: 'usuario',
      key: 'usuario',
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
      render: (_, record) => <Actions reload={init} record={record}/>
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

    api.get('/funcionarios')
      .then(({ data }) => setFuncionarios(data))
      .finally(() => setLoadingRegisters(false));
    
  }

  function filterFuncionarios(event) {
    setFuncionariosFiltered(
      funcionarios
        .filter(f => f.nomeCompleto.toLowerCase().includes(event.target.value.toLowerCase()))
    )
  }

  return (
    <Content style={{ margin: '0 16px'}}>
      <Breadcrumb style={{ margin: '16px 0', fontSize: 24, fontWeight: 500 }}>
        <Breadcrumb.Item>Funcionários</Breadcrumb.Item>
      </Breadcrumb>

      <div className="site-layout-background" style={{ padding: 16, minHeight: 360 }}>
        <div className="content-header">
          <Button onClick={handleOpenModalRegister} type="primary">+ Funcionario</Button>
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
          <Table columns={columns} dataSource={funcionariosFiltered ?? funcionarios} rowKey={(row) => row.id} />
        )}
      </div>

      {triggerModal && <ModalFuncionarios onClose={onCloseModalRegister} triggerModal={triggerModal} />}  
    </Content>
  )
}