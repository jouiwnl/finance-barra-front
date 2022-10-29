import React from 'react'
import { Button, Col, Form, Input, Modal, Row, Select } from 'antd';

import { notificar } from '../../../../utils/Notification'
import Tracker from '../../../../components/Tracker';
import { CentroCustosService } from '../../../../services/CentroCustosService';
import { SinteticosService } from '../../../../services/SinteticosService';

import CustomLabel from '../../../../components/CustomLabel';

import _ from 'lodash';

export default function({ idCentro, triggerModal, onClose }) {
	const [isModalOpen, setIsModalOpen] = React.useState(triggerModal);
  const [loadingSave, setLoadingSave] = React.useState(false);
  const [loadingRegister, setLoadingRegister] = React.useState(false);
  
  const [centro, setCentro] = React.useState({});
  const [sinteticos, setSinteticos] = React.useState([]);

  const [form] = Form.useForm();

  React.useEffect(() => {
    setIsModalOpen(triggerModal)
    init()
  }, [triggerModal])

  function init() {
    SinteticosService.findAll()
      .then(({ data }) => setSinteticos(data));

    if (!idCentro) {
      return;
    }  

    setLoadingRegister(true)

    CentroCustosService.findOne(idCentro)
      .then(({ data }) => setCentro(data))
      .finally(() => setLoadingRegister(false))
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

    CentroCustosService.save(values)
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
      title={`${idCentro ? 'Editando' : 'Registrando'} centro de custo ${idCentro ? idCentro : ''}`} 
      open={isModalOpen}
      footer={<ModalFooter />}
    >
      {loadingRegister ? (
        <div style={{ textAlign: 'center' }}>
          <Tracker />
        </div>
      ) : (
        <>

          <Form layout="vertical" form={form} initialValues={centro}>
            <Form.Item name="id" style={{ display: 'none' }}></Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <CustomLabel htmlFor="nome" labelText="Nome" required={true} />
                <Form.Item 
                  rules={[{ required: true, message: '' }]} 
                  name="nome"
                  style={{ marginBottom: 10 }}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={12}>
                <CustomLabel htmlFor="sigla" labelText="Sigla" required={true} />
                <Form.Item 
                  rules={[{ required: true, message: '' }]} 
                  name="sigla"
                  style={{ marginBottom: 10 }}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <CustomLabel htmlFor="sinteticos" labelText="Sintéticos" required={true} />
                <Form.Item 
                    name="sinteticos"
                    style={{ marginBottom: 10 }}
                    normalize={(value) => ([...value].map(value => ({ id: value, value: value })))}
                  >
                    <Select 
                      options={sinteticos}
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