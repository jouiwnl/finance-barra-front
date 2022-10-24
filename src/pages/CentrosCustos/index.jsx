import React from 'react';
import { Breadcrumb, Button, Layout, Skeleton, Table, Input, Popover  } from 'antd';

import ModalCentroCustos from './components/ModalCentroCustos';
import { CentroCustosService } from '../../services/CentroCustosService';
import Actions from './components/Actions';

const { Content } = Layout;
const { Search } = Input;

export default function() {
  const [loadingRegisters, setLoadingRegisters] = React.useState(false);
  const [centros, setCentros] = React.useState([]);
  const [centrosFiltered, setCentrosFiltered] = React.useState(null);
  const [triggerModal, setTriggerModal] = React.useState(false);

  function PopoverContent({ sinteticos }) {
    return (
      <ul>
        {sinteticos.map((sintetico, key) => {
          return (
            <li key={key}>{ sintetico.nome }</li>
          )
        })}
      </ul>
    )
  }

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
      title: 'Sigla',
      dataIndex: 'sigla',
      key: 'sigla',
    },
    {
      title: 'Sintéticas',
      key: 'sinteticas',
      render: (_, record) => (
        <Popover style={{ textDecoration: 'ellipsis' }} content={<PopoverContent sinteticos={record.sinteticos} />} title="Sintéticas">
          <a href='#'>{ record.sinteticos.length }</a>
        </Popover>
      )
    },
    {
      title: '',
      key: 'acoes',
      align: 'center',
      render: (_, record) => <Actions reload={init} record={record}/>
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

    CentroCustosService.findAll()
      .then(({ data }) => setCentros(data))
      .finally(() => setLoadingRegisters(false));
  }

  function filterCentros(event) {
    setCentrosFiltered(centros.filter(centro => {
      return centro.nome.toLowerCase().includes(event.target.value.toLowerCase()) ||
      centro.sigla.toLowerCase().includes(event.target.value.toLowerCase())
    }))
  }

  return (
    <Content style={{ margin: '0 16px'}}>
      <Breadcrumb style={{ margin: '16px 0', fontSize: 24, fontWeight: 500 }}>
        <Breadcrumb.Item>Centros de custos</Breadcrumb.Item>
      </Breadcrumb>

      <div className="site-layout-background" style={{ padding: 16, minHeight: 360 }}>
        <div className="content-header">
          <Button onClick={handleOpenModalRegister} type="primary">+ Centro de custo</Button>
          <div className="search-group">
            <Button onClick={init} loading={loadingRegisters} type='primary' style={{ marginRight: 10 }}>
              Atualizar
            </Button>
            
            <Search allowClear onChange={filterCentros} style={{ width: 300 }} placeholder="input search text" enterButton />
          </div>
        </div>

        {loadingRegisters ? (
          <Skeleton style={{ padding: 24, minHeight: 360 }} active />
        ) : (
          <Table columns={columns} dataSource={centrosFiltered ?? centros} rowKey={(row) => row.id} />
        )}
      </div>

      {triggerModal && <ModalCentroCustos onClose={onCloseModalRegister} triggerModal={triggerModal} />}  
    </Content>
  )
}