import React from 'react'
import { Button, Space, Popconfirm, Tooltip } from 'antd'

import { DeleteOutlined, EditOutlined, InfoCircleOutlined } from '@ant-design/icons'

import ModalLancamentos from '../ModalLancamentos';
import { notificar } from '../../../../utils/Notification';
import { LancamentosService } from '../../../../services/LancamentosService';

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

	function handleDelete(idLancamento) {
		LancamentosService.delete(idLancamento)
			.then(() => notificar('success', 'Registro removido com sucesso'))
			.then(() => reload())
      .catch(err => notificar('error', err.response.data.message))
	}

	return (
		<Space size="middle">

      {record.lancamentoEnglobado.status !== 'EM_PROCESSAMENTO' && (
        <Tooltip title={'Não é possível alterar um lançamento homologado.'}>
          <InfoCircleOutlined />
        </Tooltip>
      )}

			<Button disabled={record.lancamentoEnglobado.status !== 'EM_PROCESSAMENTO'} size='small' onClick={handleOpenModal} type="default">
        <EditOutlined />
			</Button>

      <Popconfirm
        title="Deseja remover o registro?"
        onConfirm={() => handleDelete(record.id)}
        okText="Sim"
        cancelText="Não"
      >
        <Button disabled={record.lancamentoEnglobado.status !== 'EM_PROCESSAMENTO'} size='small' type="primary" danger>
          <DeleteOutlined />
        </Button>
      </Popconfirm>

			{triggerModal && <ModalLancamentos onClose={onCloseModal} idLancamento={record.id} triggerModal={triggerModal} />}
		</Space>
	)
}