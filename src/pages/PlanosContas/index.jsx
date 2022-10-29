import React from 'react';
import { Breadcrumb, Button, Layout, Skeleton, Table, Input  } from 'antd';

import ModalPlanosContas from './components/ModalPlanosContas';
import { PlanosContasService } from '../../services/PlanosContasService';
import Actions from './components/Actions';

const { Content } = Layout;
const { Search } = Input;

export default function() {
  const [loadingRegisters, setLoadingRegisters] = React.useState(false);
  const [planos, setPlanos] = React.useState([]);
  const [planosFiltered, setPlanosFiltered] = React.useState(null);
  const [triggerModal, setTriggerModal] = React.useState(false);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Código',
      dataIndex: 'codigo',
      key: 'codigo'
    },
    {
      title: 'Descrição',
      dataIndex: 'descricao',
      key: 'descricao'
    },
    {
      title: 'Alocação contábil',
      dataIndex: 'alocacaoContabil',
      key: 'alocacaoContabil'
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

  React.useEffect(() => {
    init();
  }, [])

  function handleOpenModalRegister() {
		setTriggerModal(true)
	}

	function onCloseModalRegister(recordSaved) {
		setTriggerModal(false)

		if (recordSaved) {
			init();
		}
	}

  function init() {
    setLoadingRegisters(true)

    PlanosContasService.findAll()
      .then(({ data }) => setPlanos(data))
      .finally(() => setLoadingRegisters(false));
  }

  function filterPlanos(event) {
    setPlanosFiltered(planos.filter(plano => {
      return plano.nome.toLowerCase().includes(event.target.value.toLowerCase())
    }))
  }

  return (
    <Content style={{ margin: '0 16px'}}>
      <Breadcrumb style={{ margin: '16px 0', fontSize: 24, fontWeight: 500 }}>
        <Breadcrumb.Item>Planos de conta</Breadcrumb.Item>
      </Breadcrumb>

      <div className="site-layout-background" style={{ padding: 16, minHeight: 360 }}>
        <div className="content-header">
          <Button onClick={handleOpenModalRegister} type="primary">+ Plano de conta</Button>
          <div className="search-group">
            <Button onClick={init} loading={loadingRegisters} type='primary' style={{ marginRight: 10 }}>
              Atualizar
            </Button>
            
            <Search allowClear onChange={filterPlanos} style={{ width: 300 }} placeholder="input search text" enterButton />
          </div>
        </div>

        {loadingRegisters ? (
          <Skeleton style={{ padding: 24, minHeight: 360 }} active />
        ) : (
          <Table size='small' columns={columns} dataSource={planosFiltered ?? planos} rowKey={(row) => row.id} />
        )}
      </div>

      {triggerModal && <ModalPlanosContas onClose={onCloseModalRegister} triggerModal={triggerModal} />}  
    </Content>
  )
}