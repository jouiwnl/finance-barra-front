import React from 'react'
import { Button, Space, Typography, Popconfirm } from 'antd'

import ModalAnaliticas from '../ModalAnaliticas';
import { notificar } from '../../../../utils/Notification';
import { AnaliticosService } from '../../../../services/AnaliticosService';

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

	function handleDelete(idCentro) {
		AnaliticosService.delete(idCentro)
			.then(() => notificar('success', 'Registro removido com sucesso'))
			.then(() => reload())
      .catch(err => notificar('error', err.response.data.message))
	}

	return (
		<Space size="middle">
      <Popconfirm
        title="Deseja remover o registro?"
        onConfirm={() => handleDelete(record.id)}
        okText="Sim"
        cancelText="Não"
      >
        <Typography.Link>
          Remover
        </Typography.Link>
      </Popconfirm>

			<Button onClick={handleOpenModal} type="primary">
				Editar
			</Button>

			{triggerModal && <ModalAnaliticas onClose={onCloseModal} idAnalitico={record.id} triggerModal={triggerModal} />}
		</Space>
	)
}