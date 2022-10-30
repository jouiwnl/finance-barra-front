import React from 'react'
import { Button, Col, DatePicker, Form, Input, Modal, Row, Select, Space } from 'antd';

import { notificar } from '../../../../utils/Notification'
import Tracker from '../../../../components/Tracker';
import { LancamentosEnglobadosService } from '../../../../services/LancamentosEnglobadosService';
import { BancosService } from '../../../../services/BancosService';

import CustomLabel from '../../../../components/CustomLabel';

import _ from 'lodash';
import moment from 'moment';

export default function({ idLancamentoEnglobado, triggerModal, onClose }) {
	const [isModalOpen, setIsModalOpen] = React.useState(triggerModal);
  const [loadingSave, setLoadingSave] = React.useState(false);
  const [loadingRegister, setLoadingRegister] = React.useState(false);
  const [bancos, setBancos] = React.useState([]);

  const [lancamentoEnglobado, setLancamentoEnglobado] = React.useState({});

  const [form] = Form.useForm();

  React.useEffect(() => {
    setIsModalOpen(triggerModal)
    init()
  }, [triggerModal])

  function init() {
    BancosService.findForSelect()
      .then(({ data }) => setBancos(data))

    setLancamentoEnglobado({ dataLancamento: moment() })

    if (!idLancamentoEnglobado) {
      return;
    }

    setLoadingRegister(true)
    LancamentosEnglobadosService.findOne(idLancamentoEnglobado)
      .then(({ data }) => {
        data.dataLancamento = moment(data.dataLancamento);
        setLancamentoEnglobado(data)
      })
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
    
    LancamentosEnglobadosService.save(values)
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
      title={`${idLancamentoEnglobado ? 'Editando' : 'Registrando'} lançamento englobado ${idLancamentoEnglobado ? idLancamentoEnglobado : ''}`} 
      open={isModalOpen}
      footer={<ModalFooter />}
    >
      {loadingRegister ? (
        <div style={{ textAlign: 'center' }}>
          <Tracker />
        </div>
      ) : (
        <>

          <Form layout="vertical" form={form} initialValues={lancamentoEnglobado}>
            <Form.Item name="id" style={{ display: 'none' }}></Form.Item>
            <Form.Item name="status" style={{ display: 'none' }}></Form.Item>
            <Form.Item name="lancamentos" style={{ display: 'none' }}></Form.Item>

            <Row>
              <Col span={24}>
                <CustomLabel htmlFor="banco" labelText="Banco" required={true} />
                <Form.Item 
                    name="banco"
                    style={{ marginBottom: 10 }}
                    rules={[{ required: true, message: '' }]}
                    normalize={(value) => ({ id: value, value: value })}
                  >
                    <Select 
                      showSearch
                      options={bancos}
                      style={{ width: '100%' }}
                    />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16} style={{ marginTop: 15 }}>
              <Col span={10}>
                <CustomLabel htmlFor="dataLancamento" labelText="Data" required={true} />
                <Form.Item 
                  rules={[{ required: true, message: '' }]} 
                  name="dataLancamento"
                  style={{ marginBottom: 10 }}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>                
              </Col>

              <Col span={14}>
                <CustomLabel htmlFor="numeroCheque" labelText="Número do cheque" required={true} />
                <Form.Item 
                  rules={[{ required: true, message: '' }]} 
                  name="numeroCheque"
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