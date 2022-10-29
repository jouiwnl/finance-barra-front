import React from 'react';
import { Breadcrumb, Button, Layout, Skeleton, Table, Input, Popover  } from 'antd';

import ModalSinteticas from './components/ModalSinteticas';
import { SinteticosService } from '../../services/SinteticosService';
import Actions from './components/Actions';

const { Content } = Layout;
const { Search } = Input;

export default function() {
  const [loadingRegisters, setLoadingRegisters] = React.useState(false);
  const [sinteticos, setSinteticos] = React.useState([]);
  const [sinteticosFiltered, setSinteticosFiltered] = React.useState(null);
  const [triggerModal, setTriggerModal] = React.useState(false);

  function PopoverContent({ analiticas }) {
    return (
      <ul>
        {analiticas.map((analitica, key) => {
          return (
            <li key={key}>{ analitica.nome }</li>
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
      title: 'Analíticas',
      key: 'analiticas',
      render: (_, record) => {
        if (record.analiticos.length) {
          return <Popover style={{ textDecoration: 'ellipsis' }} content={<PopoverContent analiticas={record.analiticos} />} title="Analíticas">
                    <a href='#'>{ record.analiticos.length }</a>
                  </Popover>
        }

        return <span>{record.analiticos.length}</span>
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

    SinteticosService.findAll()
      .then(({ data }) => setSinteticos(data))
      .finally(() => setLoadingRegisters(false));
  }

  function filterSinteticos(event) {
    setSinteticosFiltered(sinteticos.filter(sintetico => {
      return sintetico.nome.toLowerCase().includes(event.target.value.toLowerCase())
    }))
  }

  return (
    <Content style={{ margin: '0 16px'}}>
      <Breadcrumb style={{ margin: '16px 0', fontSize: 24, fontWeight: 500 }}>
        <Breadcrumb.Item>Sintéticos</Breadcrumb.Item>
      </Breadcrumb>

      <div className="site-layout-background" style={{ padding: 16, minHeight: 360 }}>
        <div className="content-header">
          <Button onClick={handleOpenModalRegister} type="primary">+ Sintético</Button>
          <div className="search-group">
            <Button onClick={init} loading={loadingRegisters} type='primary' style={{ marginRight: 10 }}>
              Atualizar
            </Button>
            
            <Search allowClear onChange={filterSinteticos} style={{ width: 300 }} placeholder="input search text" enterButton />
          </div>
        </div>

        {loadingRegisters ? (
          <Skeleton style={{ padding: 24, minHeight: 360 }} active />
        ) : (
          <Table size='small' columns={columns} dataSource={sinteticosFiltered ?? sinteticos} rowKey={(row) => row.id} />
        )}
      </div>

      {triggerModal && <ModalSinteticas onClose={onCloseModalRegister} triggerModal={triggerModal} />}  
    </Content>
  )
}