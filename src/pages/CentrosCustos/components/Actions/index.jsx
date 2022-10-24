import React from 'react'
import { Button, Space, Typography, Popconfirm } from 'antd'

import ModalCentroCustos from '../ModalCentroCustos';
import { notificar } from '../../../../utils/Notification';
import { CentroCustosService } from '../../../../services/CentroCustosService';

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
		CentroCustosService.delete(idCentro)
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

			{triggerModal && <ModalCentroCustos onClose={onCloseModal} idCentro={record.id} triggerModal={triggerModal} />}
		</Space>
	)
}