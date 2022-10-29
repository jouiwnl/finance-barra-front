import React from 'react'
import {  Button, Col, Form, Input, Modal, Row } from 'antd';

import { notificar } from '../../../../utils/Notification'
import Tracker from '../../../../components/Tracker';
import { PlanosContasService } from '../../../../services/PlanosContasService';

import CustomLabel from '../../../../components/CustomLabel';

export default function({ idPlanos, triggerModal, onClose }) {
	const [isModalOpen, setIsModalOpen] = React.useState(triggerModal);
  const [loadingSave, setLoadingSave] = React.useState(false);
  const [loadingRegister, setLoadingRegister] = React.useState(false);

  const [planosConta, setPlanosConta] = React.useState({});
  
  const [form] = Form.useForm();

  React.useEffect(() => {
    setIsModalOpen(triggerModal)
    init()
  }, [triggerModal])

  function init() {
    if (!idPlanos) {
      return;
    }

    setLoadingRegister(true)
    PlanosContasService.findOne(idPlanos)
      .then(({ data }) => setPlanosConta(data))
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
    
    PlanosContasService.save(values)
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
      title={`${idPlanos ? 'Editando' : 'Registrando'} plano de conta ${idPlanos ? idPlanos : ''}`} 
      open={isModalOpen}
      footer={<ModalFooter />}
    >
      {loadingRegister ? (
        <div style={{ textAlign: 'center' }}>
          <Tracker />
        </div>
      ) : (
        <>
          <Form layout="vertical" form={form} initialValues={planosConta}>
            <Form.Item name="id" style={{ display: 'none' }}></Form.Item>
            <Row>
              <Col span={24}>
                <CustomLabel htmlFor="codigo" labelText="Código" required={true} />
                <Form.Item 
                  rules={[{ required: true, message: '' }]} 
                  name="codigo"
                  style={{ marginBottom: 10 }}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={24}>
                <CustomLabel htmlFor="descricao" labelText="Descrição" required={true} />
                <Form.Item 
                  rules={[{ required: true, message: '' }]} 
                  name="descricao"
                  style={{ marginBottom: 10 }}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={24}>
                <CustomLabel htmlFor="alocacaoContabil" labelText="Alocação contábil" required={true} />
                <Form.Item 
                  rules={[{ required: true, message: '' }]} 
                  name="alocacaoContabil"
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