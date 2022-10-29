import React from 'react';
import { Breadcrumb, Button, Layout, Skeleton, Table, Input, Popover  } from 'antd';

import ModalBancos from './components/ModalBancos';
import { BancosService } from '../../services/BancosService';
import Actions from './components/Actions';

const { Content } = Layout;
const { Search } = Input;

export default function() {
  const [loadingRegisters, setLoadingRegisters] = React.useState(false);
  const [bancos, setBancos] = React.useState([]);
  const [bancosFiltered, setBancosFiltered] = React.useState(null);
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
      key: 'nome',
    },
    {
      title: 'Conta corrente',
      dataIndex: 'contaCorrente',
      key: 'contaCorrente',
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

    BancosService.findAll()
      .then(({ data }) => setBancos(data))
      .finally(() => setLoadingRegisters(false));
  }

  function filterBancos(event) {
    setBancosFiltered(bancos.filter(banco => {
      return banco.nome.toLowerCase().includes(event.target.value.toLowerCase())
    }))
  }

  return (
    <Content style={{ margin: '0 16px'}}>
      <Breadcrumb style={{ margin: '16px 0', fontSize: 24, fontWeight: 500 }}>
        <Breadcrumb.Item>Bancos</Breadcrumb.Item>
      </Breadcrumb>

      <div className="site-layout-background" style={{ padding: 16, minHeight: 360 }}>
        <div className="content-header">
          <Button onClick={handleOpenModalRegister} type="primary">+ Banco</Button>
          <div className="search-group">
            <Button onClick={init} loading={loadingRegisters} type='primary' style={{ marginRight: 10 }}>
              Atualizar
            </Button>
            
            <Search allowClear onChange={filterBancos} style={{ width: 300 }} placeholder="input search text" enterButton />
          </div>
        </div>

        {loadingRegisters ? (
          <Skeleton style={{ padding: 24, minHeight: 360 }} active />
        ) : (
          <Table size='small' columns={columns} dataSource={bancosFiltered ?? bancos} rowKey={(row) => row.id} />
        )}
      </div>

      {triggerModal && <ModalBancos onClose={onCloseModalRegister} triggerModal={triggerModal} />}  
    </Content>
  )
}