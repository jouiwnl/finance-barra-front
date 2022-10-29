import React from 'react'
import { Button, Col, Form, Input, Modal, Row, Select } from 'antd';

import { notificar } from '../../../../utils/Notification'
import Tracker from '../../../../components/Tracker';
import { UsuariosService } from '../../../../services/UsuariosService';
import CustomLabel from '../../../../components/CustomLabel';

const selectOptions = [
  {
    label: 'Admnistrador',
    value: 'ADM'
  },
  {
    label: 'Recursos Humanos',
    value: 'RH'
  },
  {
    label: 'Financeiro',
    value: 'FINANCEIRO'
  }
]

export default function({ idUsuario, triggerModal, onClose }) {
	const [isModalOpen, setIsModalOpen] = React.useState(triggerModal);
  const [loadingSave, setLoadingSave] = React.useState(false);
  const [loadingRegister, setLoadingRegister] = React.useState(false);

  const [usuario, setUsuario] = React.useState({});
  const [form] = Form.useForm();

  React.useEffect(() => {
    setIsModalOpen(triggerModal)
    init()
  }, [triggerModal])

  function init() {
    if (!idUsuario) {
      return;
    }
    setLoadingRegister(true)
    UsuariosService.findOne(idUsuario)
      .then(({data}) => setUsuario(data))
      .finally(() => setLoadingRegister(false));
  }

  function beforeSave() {
    form.validateFields()
      .then(values => {
        handleSave(values);
      })
      .catch((info) => {
        notificar('error', 'Erro ao enviar formulário. Preencha os campos corretamente')
      });
  }

  function handleSave(values) {
    setLoadingSave(true)

    UsuariosService.save(values)
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
      title={`${idUsuario ? 'Editando' : 'Registrando'} usuário ${idUsuario ? idUsuario : ''}`} 
      open={isModalOpen}
      footer={<ModalFooter />}
    >
      {loadingRegister ? (
        <div style={{ textAlign: 'center' }}>
          <Tracker />
        </div>
      ) : (
        <>
          <Form layout="vertical" form={form} initialValues={usuario}>
            <Form.Item name="id" style={{ display: 'none' }}></Form.Item>
            <Row>
              <Col span={24}>
                <CustomLabel htmlFor="nomeCompleto" labelText="Nome completo" required={true} />
                <Form.Item 
                  rules={[{ required: true, message: '' }]} 
                  name="nomeCompleto"
                  style={{ marginBottom: 10 }}
                  labelCol={{ span: 12, offset: 0 }}
                  id="nomeCompleto"
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <CustomLabel htmlFor="user" labelText="Usuário" required={true} />
                <Form.Item 
                  rules={[{ required: true, message: '' }]} 
                  name="user"
                  style={{ marginBottom: 10 }}
                  id="user"
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={12}>
                <CustomLabel htmlFor="senha" labelText="Senha" required={true} />
                <Form.Item 
                  rules={[{ required: !idUsuario, message: '' }]} 
                  name="senha"
                  style={{ marginBottom: 10 }}
                  id="senha"
                >
                  <Input disabled={idUsuario} type='password'/>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <CustomLabel htmlFor="tipo" labelText="Tipo" required={true} />
                <Form.Item 
                    name="tipo"
                    rules={[ { required: true, message: '' } ]}
                    style={{ marginBottom: 10 }} 
                    id="tipo"
                  >
                    <Select 
                      options={selectOptions} 
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