import React from 'react'
import { Button, Dropdown, Menu, Space, Tooltip } from 'antd'

import { 
  DeleteOutlined, 
  EditOutlined, 
  InfoCircleOutlined, 
  MoreOutlined, 
  CheckOutlined,
  EyeOutlined,
  UndoOutlined
} from '@ant-design/icons'

import ConfirmationModal from '../../../../components/ConfirmationModal'

import ModalLancamentosEnglobados from '../ModalLancamentosEnglobados';
import { notificar } from '../../../../utils/Notification';
import { LancamentosEnglobadosService } from '../../../../services/LancamentosEnglobadosService';
import { customHistory } from '../../../../CustomBrowserRouter';

export default function({ record, reload }) {

	const [triggerModal, setTriggerModal] = React.useState(false)

	function handleOpenModal() {
		setTriggerModal(true)
	}

	function onCloseModal(recordSaved) {
		setTriggerModal(false)

		if (recordSaved) {
			reload();
		}
	}

	function handleDelete() {
		LancamentosEnglobadosService.delete(record.id)
			.then(() => notificar('success', 'Registro removido com sucesso'))
			.then(() => reload())
      .catch(err => notificar('error', err.response.data.message))
	}

  function confirmarDelete() {
    ConfirmationModal('Deseja remover esse registro? Todos os lançamentos presentes dentro desse englobado serão removidos.', handleDelete)
  }

	return (
		<Space size="middle">

      {record.status !== 'EM_PROCESSAMENTO' && (
        <Tooltip title={'Não é possível alterar um lançamento homologado.'}>
          <InfoCircleOutlined />
        </Tooltip>
      )}

      <Button disabled={record.status !== 'EM_PROCESSAMENTO'} size='small' onClick={handleOpenModal} type="default">
        <EditOutlined />
      </Button>

      <Button disabled={record.status !== 'EM_PROCESSAMENTO'} onClick={confirmarDelete} size='small' type="primary" danger>
        <DeleteOutlined />
      </Button>

      <Dropdown overlay={<CustomMenu record={record} reload={reload} />} trigger={['click']}>
        <MoreOutlined />
      </Dropdown>

			{triggerModal && <ModalLancamentosEnglobados onClose={onCloseModal} idLancamentoEnglobado={record.id} triggerModal={triggerModal} />}
		</Space>
	)
}

function CustomMenu({ record, reload }) {
  const isHomologado = record.status === 'HOMOLOGADO';
  
  const items = [
    {
      label: isHomologado ? 'Desfazer homologação' : 'Homologar',
      icon: isHomologado ? <UndoOutlined /> : <CheckOutlined />,
      key: isHomologado ? 'desfazer' : 'homologar'
    },
    {
      label: 'Visualizar lançamentos',
      icon: <EyeOutlined />,
      key: 'visualizar'
    }
  ]

  function homologar() {
    LancamentosEnglobadosService.homologar(record.id)
			.then(() => notificar('success', 'Lançamento homologado com sucesso'))
			.then(() => reload())
      .catch(err => notificar('error', 'Houve um erro ao homologar o lançamento'))
  }

  function desfazer() {
    LancamentosEnglobadosService.desfazerHomologacao(record.id)
			.then(() => notificar('success', 'Homologação desfeita com sucesso'))
			.then(() => reload())
      .catch(err => notificar('error', 'Houve um erro ao desfazer a homologação do lançamento'))
  }

  function confirmarHomologacao() {
    ConfirmationModal('Deseja homologar esse lançamento?', homologar)
  }

  function confirmarDesfazer() {
    ConfirmationModal('Deseja desfazer a homologação desse lançamento?', desfazer)
  }

  function handleClickItem(item) {
    switch (item.key) {
      case 'homologar':
        confirmarHomologacao();
        break;

      case 'desfazer':
        confirmarDesfazer();
        break;

      case 'visualizar':
        customHistory.push(`/lancamentos-englobados/${record.id}/lancamentos`);
        break;
    }
  }

  return <Menu items={items} onClick={(item) => handleClickItem(item)}/>
}