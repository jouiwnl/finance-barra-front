import React from 'react'
import { Button, Space, Popconfirm } from 'antd'

import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

import ModalImpostos from '../ModalImpostos';
import { notificar } from '../../../../utils/Notification';
import { ImpostosService } from '../../../../services/ImpostosService';

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

	function handleDelete(idImposto) {
		ImpostosService.delete(idImposto)
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

			{triggerModal && <ModalImpostos onClose={onCloseModal} idImpostos={record.id} triggerModal={triggerModal} />}
		</Space>
	)
}