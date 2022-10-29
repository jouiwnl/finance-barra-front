import React from 'react'
import {  Button, Col, Form, Input, Modal, Row } from 'antd';

import { notificar } from '../../../../utils/Notification'
import Tracker from '../../../../components/Tracker';
import { ImpostosService } from '../../../../services/ImpostosService';

import CustomLabel from '../../../../components/CustomLabel';

export default function({ idImpostos, triggerModal, onClose }) {
	const [isModalOpen, setIsModalOpen] = React.useState(triggerModal);
  const [loadingSave, setLoadingSave] = React.useState(false);
  const [loadingRegister, setLoadingRegister] = React.useState(false);

  const [imposto, setImposto] = React.useState({});
  
  const [form] = Form.useForm();

  React.useEffect(() => {
    setIsModalOpen(triggerModal)
    init()
  }, [triggerModal])

  function init() {
    if (!idImpostos) {
      return;
    }

    setLoadingRegister(true)
    ImpostosService.findOne(idImpostos)
      .then(({ data }) => setImposto(data))
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
    
    ImpostosService.save(values)
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
      title={`${idImpostos ? 'Editando' : 'Registrando'} imposto ${idImpostos ? idImpostos : ''}`} 
      open={isModalOpen}
      footer={<ModalFooter />}
    >
      {loadingRegister ? (
        <div style={{ textAlign: 'center' }}>
          <Tracker />
        </div>
      ) : (
        <>
          <Form layout="vertical" form={form} initialValues={imposto}>
            <Form.Item name="id" style={{ display: 'none' }}></Form.Item>
            <Row>
              <Col span={24}>
                <CustomLabel htmlFor="nome" labelText="Nome" required={true} />
                <Form.Item 
                  rules={[{ required: true, message: '' }]} 
                  name="nome"
                  style={{ marginBottom: 10 }}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={24}>
                <CustomLabel htmlFor="sigla" labelText="Sigla" required={true} />
                <Form.Item 
                  rules={[{ required: true, message: '' }]} 
                  name="sigla"
                  style={{ marginBottom: 10 }}
                >
                  <Input maxLength={12}/>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </>
      )}
      
		</Modal>
  );
}