import React from 'react';
import { Breadcrumb, Button, Layout, Skeleton, Table, Input, Popover  } from 'antd';

import ModalAnaliticas from './components/ModalAnaliticas';
import { AnaliticosService } from '../../services/AnaliticosService';
import Actions from './components/Actions';

const { Content } = Layout;
const { Search } = Input;

export default function() {
  const [loadingRegisters, setLoadingRegisters] = React.useState(false);
  const [analiticos, setAnaliticos] = React.useState([]);
  const [analiticosFiltered, setAnaliticosFiltered] = React.useState(null);
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
      title: 'Sintéticos',
      key: 'sinteticos',
      render: (_, record) => {
        if (record.sinteticos.length) {
          return <Popover style={{ textDecoration: 'ellipsis' }} content={<PopoverContent sinteticos={record.sinteticos} />} title="Sintéticos">
                  <a href='#'>{ record.sinteticos.length }</a>
                </Popover>
        }

        return <span>{record.sinteticos.length}</span>
      }
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

    AnaliticosService.findAll()
      .then(({ data }) => setAnaliticos(data))
      .finally(() => setLoadingRegisters(false));
  }

  function filterAnaliticos(event) {
    setAnaliticosFiltered(analiticos.filter(analitico => {
      return analitico.nome.toLowerCase().includes(event.target.value.toLowerCase())
    }))
  }

  return (
    <Content style={{ margin: '0 16px'}}>
      <Breadcrumb style={{ margin: '16px 0', fontSize: 24, fontWeight: 500 }}>
        <Breadcrumb.Item>Analíticos</Breadcrumb.Item>
      </Breadcrumb>

      <div className="site-layout-background" style={{ padding: 16, minHeight: 360 }}>
        <div className="content-header">
          <Button onClick={handleOpenModalRegister} type="primary">+ Analítico</Button>
          <div className="search-group">
            <Button onClick={init} loading={loadingRegisters} type='primary' style={{ marginRight: 10 }}>
              Atualizar
            </Button>
            
            <Search allowClear onChange={filterAnaliticos} style={{ width: 300 }} placeholder="input search text" enterButton />
          </div>
        </div>

        {loadingRegisters ? (
          <Skeleton style={{ padding: 24, minHeight: 360 }} active />
        ) : (
          <Table size='small' columns={columns} dataSource={analiticosFiltered ?? analiticos} rowKey={(row) => row.id} />
        )}
      </div>

      {triggerModal && <ModalAnaliticas onClose={onCloseModalRegister} triggerModal={triggerModal} />}  
    </Content>
  )
}