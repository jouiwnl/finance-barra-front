import React from 'react'
import { Button, Col, Form, Input, Modal, Row, Select } from 'antd';

import { notificar } from '../../../../utils/Notification'
import Tracker from '../../../../components/Tracker';
import { BancosService } from '../../../../services/BancosService';

import CustomLabel from '../../../../components/CustomLabel';

import _ from 'lodash';

export default function({ idBanco, triggerModal, onClose }) {
	const [isModalOpen, setIsModalOpen] = React.useState(triggerModal);
  const [loadingSave, setLoadingSave] = React.useState(false);
  const [loadingRegister, setLoadingRegister] = React.useState(false);

  const [banco, setBanco] = React.useState({});
  const [form] = Form.useForm();

  React.useEffect(() => {
    setIsModalOpen(triggerModal)
    init()
  }, [triggerModal])

  function init() {
    if (!idBanco) {
      return;
    }

    setLoadingRegister(true)
    BancosService.findOne(idBanco)
      .then(({ data }) => setBanco(data))
      .finally(() => setLoadingRegister(false));
  }

  function beforeSave() {
    form.validateFields()
      .then(values => {
        handleSave(values);
      })
      .catch((info) => {
        notificar('error', 'Houve um erro ao validar o formulário. Preencha os campos corretamente');
      });
  }

  function handleSave(values) {
    setLoadingSave(true)
    
    BancosService.save(values)
      .then(() => {
        notificar('success', 'Registro salvo com sucesso')
        closeModal(true);
        onClose(true);
      })
      .finally(() => setLoadingSave(false))
  };

  function closeModal() {
    setIsModalOpen(false);
  };

  function ModalFooter() {
    return (
      <>
        <Button key="back" onClick={closeModal}>
          Cancelar
        </Button>
        <Button key="submit" type="primary" loading={loadingSave} onClick={beforeSave}>
          Submit
        </Button>
      </>
    )
  }

  return (   
		<Modal
      okText="Salvar" 
      onCancel={closeModal}
      afterClose={onClose} 
      title={`${idBanco ? 'Editando' : 'Registrando'} banco ${idBanco ? idBanco : ''}`} 
      open={isModalOpen}
      footer={<ModalFooter />}
    >
      {loadingRegister ? (
        <div style={{ textAlign: 'center' }}>
          <Tracker />
        </div>
      ) : (
        <>
          <Form layout="vertical" form={form} initialValues={banco}>
            <Form.Item name="id" style={{ display: 'none' }}></Form.Item>
            <Row>
              <Col span={24}>
                <CustomLabel htmlFor="nome" labelText="Nome" required={true} />
                <Form.Item 
                  rules={[{ required: true, message: '' }]} 
                  name="nome"
                  label="Nome"
                  style={{ marginBottom: 10 }}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={24}>
                <CustomLabel htmlFor="contaCorrente" labelText="Conta corrente" required={true} />
                <Form.Item 
                  rules={[{ required: true, message: '' }]} 
                  name="contaCorrente"
                  label="Conta corrente"
                  style={{ marginBottom: 10 }}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </>
      )}
      
		</Modal>
  );
}