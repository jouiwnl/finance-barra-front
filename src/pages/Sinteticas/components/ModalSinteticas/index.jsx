import React from 'react'
import { Button, Col, Form, Input, Modal, Row, Select } from 'antd';

import { notificar } from '../../../../utils/Notification'
import Tracker from '../../../../components/Tracker';
import { SinteticosService } from '../../../../services/SinteticosService';
import { AnaliticosService } from '../../../../services/AnaliticosService';

import CustomLabel from '../../../../components/CustomLabel';

import _ from 'lodash';

export default function({ idSintetico, triggerModal, onClose }) {
	const [isModalOpen, setIsModalOpen] = React.useState(triggerModal);
  const [loadingSave, setLoadingSave] = React.useState(false);
  const [loadingRegister, setLoadingRegister] = React.useState(false);

  const [sintetico, setSintetico] = React.useState({});
  const [analiticos, setAnaliticos] = React.useState([]);

  const [form] = Form.useForm();

  React.useEffect(() => {
    setIsModalOpen(triggerModal)
    init()
  }, [triggerModal])

  function init() {
    AnaliticosService.findAll()
      .then(({ data }) => setAnaliticos(data));

    if (!idSintetico) {
      return;
    }

    setLoadingRegister(true)
    SinteticosService.findOne(idSintetico)
      .then(({ data }) => setSintetico(data))
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

    SinteticosService.save(values)
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
      title={`${idSintetico ? 'Editando' : 'Registrando'} sintético ${idSintetico ? idSintetico : ''}`} 
      open={isModalOpen}
      footer={<ModalFooter />}
    >
      {loadingRegister ? (
        <div style={{ textAlign: 'center' }}>
          <Tracker />
        </div>
      ) : (
        <>
          <Form layout="vertical" form={form} initialValues={sintetico}>
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
                <CustomLabel htmlFor="analiticos" labelText="Analíticos" required={true} />
                <Form.Item 
                  rules={[{ required: true, message: '' }]} 
                  name="analiticos"
                  style={{ marginBottom: 10 }}
                  normalize={(value) => ([...value].map(value => ({ id: value, value: value })))}
                >
                  <Select 
                    options={analiticos}
                    mode="multiple"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </>
      )}
      
		</Modal>
  );
}