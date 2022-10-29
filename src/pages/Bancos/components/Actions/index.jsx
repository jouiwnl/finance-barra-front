import React from 'react'
import { Button, Space, Typography, Popconfirm } from 'antd'

import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

import ModalBancos from '../ModalBancos';
import { notificar } from '../../../../utils/Notification';
import { BancosService } from '../../../../services/BancosService';

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

	function handleDelete(idBanco) {
		BancosService.delete(idBanco)
			.then(() => notificar('success', 'Registro removido com sucesso'))
			.then(() => reload())
      .catch(err => notificar('error', err.response.data.message))
	}

	return (
		<Space size="middle">
      <Button size='small' onClick={handleOpenModal} type="default">
        <EditOutlined />
			</Button>

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

			{triggerModal && <ModalBancos onClose={onCloseModal} idBanco={record.id} triggerModal={triggerModal} />}
		</Space>
	)
}