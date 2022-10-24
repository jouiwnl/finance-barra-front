import React from 'react'
import { Button, Space, Typography, Tooltip, Popconfirm } from 'antd'

import ModalFuncionarios from '../ModalFuncionarios';
import { FuncionarioService } from '../../../../services/FuncionarioService';
import { notificar } from '../../../../utils/Notification';

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

	function handleDelete(idFuncionario) {
		FuncionarioService.deleteFuncionario(idFuncionario)
			.then(() => notificar('success', 'Registro removido com sucesso'))
			.then(() => reload())
	}

	return (
		<Space size="middle">
			<Tooltip title={record.tipo === 'ADM' ? 'Não é possível excluir um ADM' : ''}>
				<Popconfirm
					title="Deseja remover o registro?"
					onConfirm={() => handleDelete(record.id)}
					okText="Sim"
					cancelText="Não"
				>
					<Typography.Link disabled={record.tipo === 'ADM'}>
						Remover
					</Typography.Link>
				</Popconfirm>
			</Tooltip>

			<Button onClick={handleOpenModal} type="primary">
				Editar
			</Button>

			{triggerModal && <ModalFuncionarios onClose={onCloseModal} idFuncionario={record.id} triggerModal={triggerModal} />}
		</Space>
	)
}