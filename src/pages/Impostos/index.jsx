import React from 'react';
import { Breadcrumb, Button, Layout, Skeleton, Table, Input  } from 'antd';

import ModalImpostos from './components/ModalImpostos';
import { ImpostosService } from '../../services/ImpostosService';
import Actions from './components/Actions';

const { Content } = Layout;
const { Search } = Input;

export default function() {
  const [loadingRegisters, setLoadingRegisters] = React.useState(false);
  const [impostos, setImpostos] = React.useState([]);
  const [impostosFiltered, setImpostosFiltered] = React.useState(null);
  const [triggerModal, setTriggerModal] = React.useState(false);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Nome',
      dataIndex: 'nome',
      key: 'nome'
    },
    {
      title: 'Sigla',
      dataIndex: 'sigla',
      key: 'sigla'
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

    ImpostosService.findAll()
      .then(({ data }) => setImpostos(data))
      .finally(() => setLoadingRegisters(false));
  }

  function filterImpostos(event) {
    setImpostosFiltered(impostos.filter(imposto => {
      return imposto.nome.toLowerCase().includes(event.target.value.toLowerCase())
    }))
  }

  return (
    <Content style={{ margin: '0 16px'}}>
      <Breadcrumb style={{ margin: '16px 0', fontSize: 24, fontWeight: 500 }}>
        <Breadcrumb.Item>Impostos</Breadcrumb.Item>
      </Breadcrumb>

      <div className="site-layout-background" style={{ padding: 16, minHeight: 360 }}>
        <div className="content-header">
          <Button onClick={handleOpenModalRegister} type="primary">+ Imposto</Button>
          <div className="search-group">
            <Button onClick={init} loading={loadingRegisters} type='primary' style={{ marginRight: 10 }}>
              Atualizar
            </Button>
            
            <Search allowClear onChange={filterImpostos} style={{ width: 300 }} placeholder="input search text" enterButton />
          </div>
        </div>

        {loadingRegisters ? (
          <Skeleton style={{ padding: 24, minHeight: 360 }} active />
        ) : (
          <Table size='small' columns={columns} dataSource={impostosFiltered ?? impostos} rowKey={(row) => row.id} />
        )}
      </div>

      {triggerModal && <ModalImpostos onClose={onCloseModalRegister} triggerModal={triggerModal} />}  
    </Content>
  )
}