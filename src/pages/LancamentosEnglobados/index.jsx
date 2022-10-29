import React from 'react';
import { Breadcrumb, Button, Layout, Skeleton, Table, Input, Tag  } from 'antd';

import { SyncOutlined, CheckCircleOutlined } from '@ant-design/icons';

import ModalLancamentosEnglobados from './components/ModalLancamentosEnglobados';
import { LancamentosEnglobadosService } from '../../services/LancamentosEnglobadosService';
import Actions from './components/Actions';

const { Content } = Layout;
const { Search } = Input;

export default function() {
  const [loadingRegisters, setLoadingRegisters] = React.useState(false);
  const [lancamentoEnglobados, setLancamentosEnglobados] = React.useState([]);
  const [lancamentoEnglobadosFiltered, setLancamentosEnglobadosFiltered] = React.useState(null);
  const [triggerModal, setTriggerModal] = React.useState(false);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Banco',
      key: 'banco',
      render: (_, record) => <span>{record.banco.nome}</span>
    },
    {
      title: 'Data',
      dataIndex: 'dataLancamento',
      key: 'dataLancamento',
    },
    {
      title: 'Número do cheque',
      dataIndex: 'numeroCheque',
      key: 'numeroCheque',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (_, record) => {
        if (record.status === 'EM_PROCESSAMENTO') {
          return <Tag icon={<SyncOutlined spin />} color='processing'>EM PROCESSAMENTO</Tag>
        }

        return <Tag icon={<CheckCircleOutlined />} color='success'>HOMOLOGADO</Tag>
      },
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

    LancamentosEnglobadosService.findAll()
      .then(({ data }) => setLancamentosEnglobados(data))
      .finally(() => setLoadingRegisters(false));
  }

  function filterLancamentosEnglobados(event) {
    setLancamentosEnglobadosFiltered(lancamentoEnglobados.filter(lancamento => {
      return lancamento.id.toString().includes(event.target.value.toLowerCase()) || 
        lancamento.numeroCheque.toString().includes(event.target.value.toLowerCase())
    }))
  }

  return (
    <Content style={{ margin: '0 16px'}}>
      <Breadcrumb style={{ margin: '16px 0', fontSize: 24, fontWeight: 500 }}>
        <Breadcrumb.Item>Lancamentos englobados</Breadcrumb.Item>
      </Breadcrumb>

      <div className="site-layout-background" style={{ padding: 16, minHeight: 360 }}>
        <div className="content-header">
          <Button onClick={handleOpenModalRegister} type="primary">+ Lançamento Englobado</Button>
          <div className="search-group">
            <Button onClick={init} loading={loadingRegisters} type='primary' style={{ marginRight: 10 }}>
              Atualizar
            </Button>
            
            <Search allowClear onChange={filterLancamentosEnglobados} style={{ width: 300 }} placeholder="input search text" enterButton />
          </div>
        </div>

        {loadingRegisters ? (
          <Skeleton style={{ padding: 24, minHeight: 360 }} active />
        ) : (
          <Table size='small' columns={columns} dataSource={lancamentoEnglobadosFiltered ?? lancamentoEnglobados} rowKey={(row) => row.id} />
        )}
      </div>

      {triggerModal && <ModalLancamentosEnglobados onClose={onCloseModalRegister} triggerModal={triggerModal} />}  
    </Content>
  )
}