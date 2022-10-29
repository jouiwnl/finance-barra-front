import React from 'react'
import { Button, Space, Tooltip, Popconfirm } from 'antd'

import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

import ModalUsuarios from '../ModalUsuarios';
import { UsuariosService } from '../../../../services/UsuariosService';
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

	function handleDelete(idUsuario) {
		UsuariosService.delete(idUsuario)
			.then(() => notificar('success', 'Registro removido com sucesso'))
			.then(() => reload())
	}

	return (
		<Space size="middle">
      <Button size='small' onClick={handleOpenModal} type="default">
        <EditOutlined />
			</Button>

			<Tooltip title={record.tipo === 'ADM' ? 'Não é possível excluir um ADM' : ''}>
        <Popconfirm
          title="Deseja remover o registro?"
          onConfirm={() => handleDelete(record.id)}
          okText="Sim"
          cancelText="Não"
        >
          <Button size='small' type="primary" danger>
            <DeleteOutlined />
          </Button>
        </Popconfirm>
			</Tooltip>

			{triggerModal && <ModalUsuarios onClose={onCloseModal} idUsuario={record.id} triggerModal={triggerModal} />}
		</Space>
	)
}