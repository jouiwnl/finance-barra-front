import React from 'react';
import { Breadcrumb, Button, Layout, Skeleton, Table, Input, Popover  } from 'antd';

import ModalPessoas from './components/ModalPessoas';
import { PessoasService } from '../../services/PessoasService';
import Actions from './components/Actions';
import { maskCpfCnpj } from '../../utils/checkUtil';

const { Content } = Layout;
const { Search } = Input;

export default function() {
  const [loadingRegisters, setLoadingRegisters] = React.useState(false);
  const [pessoas, setPessoas] = React.useState([]);
  const [pessoasFiltered, setPessoasFiltered] = React.useState(null);
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
      title: 'CPF/CNPJ',
      key: 'cpfCnpj',
      render: (_, record) => <span>{maskCpfCnpj(record.cpfCnpj)}</span>
    },
    {
      title: 'Tipo',
      dataIndex: 'tipoPessoa',
      key: 'tipoPessoa',
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

    PessoasService.findAll()
      .then(({ data }) => setPessoas(data))
      .finally(() => setLoadingRegisters(false));
  }

  function filterPessoas(event) {
    setPessoasFiltered(pessoas.filter(pessoa => {
      return pessoa.nome.toLowerCase().includes(event.target.value.toLowerCase())
    }))
  }

  return (
    <Content style={{ margin: '0 16px'}}>
      <Breadcrumb style={{ margin: '16px 0', fontSize: 24, fontWeight: 500 }}>
        <Breadcrumb.Item>Pessoas</Breadcrumb.Item>
      </Breadcrumb>

      <div className="site-layout-background" style={{ padding: 16, minHeight: 360 }}>
        <div className="content-header">
          <Button onClick={handleOpenModalRegister} type="primary">+ Pessoa</Button>
          <div className="search-group">
            <Button onClick={init} loading={loadingRegisters} type='primary' style={{ marginRight: 10 }}>
              Atualizar
            </Button>
            
            <Search allowClear onChange={filterPessoas} style={{ width: 300 }} placeholder="input search text" enterButton />
          </div>
        </div>

        {loadingRegisters ? (
          <Skeleton style={{ padding: 24, minHeight: 360 }} active />
        ) : (
          <Table size='small' columns={columns} dataSource={pessoasFiltered ?? pessoas} rowKey={(row) => row.id} />
        )}
      </div>

      {triggerModal && <ModalPessoas onClose={onCloseModalRegister} triggerModal={triggerModal} />}  
    </Content>
  )
}