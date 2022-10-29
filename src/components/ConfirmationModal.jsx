import React from 'react';

import { Alert, Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

export default function ConfirmationModal(content, func) {

  function ModalContent() {
    return <h3 style={{ textDecoration: 'none' }}>{content}</h3>
  }

  return (
    Modal.confirm({
      title: 'Confirme sua ação',
      icon: <ExclamationCircleOutlined />,
      content: <ModalContent />,
      okText: 'Sim',
      cancelText: 'Não',
      style: {
        minWidth: 500
      },
      bodyStyle: {
        padding: 20
      },
      onOk() {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(func())
          }, 1000);
        })
      }
    })

  )
}