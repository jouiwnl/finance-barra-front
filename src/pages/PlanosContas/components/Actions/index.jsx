import React from 'react'
import { Button, Space, Typography, Popconfirm } from 'antd'

import ModalPlanosContas from '../ModalPlanosContas';
import { notificar } from '../../../../utils/Notification';
import { PlanosContasService } from '../../../../services/PlanosContasService';

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

	function handleDelete(idPlano) {
		PlanosContasService.delete(idPlano)
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

			{triggerModal && <ModalPlanosContas onClose={onCloseModal} idPlanos={record.id} triggerModal={triggerModal} />}
		</Space>
	)
}