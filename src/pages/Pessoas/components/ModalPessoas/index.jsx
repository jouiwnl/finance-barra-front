import React from 'react'
import { Button, Col, Form, Input, Modal, Row, Select, Space, Switch } from 'antd';

import { notificar } from '../../../../utils/Notification'
import Tracker from '../../../../components/Tracker';
import { PessoasService } from '../../../../services/PessoasService';
import { CentroCustosService } from '../../../../services/CentroCustosService';

import CustomLabel from '../../../../components/CustomLabel';

import { MaskedInput } from 'antd-mask-input';

import _ from 'lodash';
import { isValidCnpj, isValidCPF } from '../../../../utils/checkUtil';

const tiposPessoa = [
  { label: 'Funcionário', value: 'FUNCIONARIO' },
  { label: 'Fornecedor', value: 'FORNECEDOR' },
]

export default function({ idPessoa, triggerModal, onClose }) {
	const [isModalOpen, setIsModalOpen] = React.useState(triggerModal);
  const [loadingSave, setLoadingSave] = React.useState(false);
  const [loadingRegister, setLoadingRegister] = React.useState(false);
  const [isCnpj, setIsCnpj] = React.useState(false);
  const [centrosCustos, setCentrosCustos] = React.useState([]);

  const [pessoa, setPessoa] = React.useState([])

  const [form] = Form.useForm();

  React.useEffect(() => {
    setIsModalOpen(triggerModal)
    init()
  }, [triggerModal])

  function init() {
    CentroCustosService.findAll()
      .then(({ data }) => setCentrosCustos(data));

    if (!idPessoa) {
      return;
    }

    setLoadingRegister(true)
    PessoasService.findOne(idPessoa)
      .then(({ data }) => setPessoa(data))
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
    
    PessoasService.save(values)
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
      title={`${idPessoa ? 'Editando' : 'Registrando'} pessoa ${idPessoa ? idPessoa : ''}`} 
      open={isModalOpen}
      footer={<ModalFooter />}
    >
      {loadingRegister ? (
        <div style={{ textAlign: 'center' }}>
          <Tracker />
        </div>
      ) : (
        <Form layout="vertical" form={form} initialValues={pessoa}>
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

          <Row gutter={16}>
            <Col span={8}>
              <CustomLabel htmlFor="tipoPessoa" labelText="Tipo" required={true} />
              <Form.Item 
                rules={[{ required: true, message: '' }]} 
                name="tipoPessoa"
                style={{ marginBottom: 10 }}
              >
                <Select 
                  options={tiposPessoa}
                  style={{ width: '100%' }}
                  onChange={(value) => {
                    value === 'FORNECEDOR' ? setIsCnpj(true) : setIsCnpj(false);
                    form.setFieldValue('cpfCnpj', '')
                  }}
                />
              </Form.Item>
            </Col>

            <Col span={16}>
              <CustomLabel htmlFor="cpfCnpj" labelText="CPF/CNPJ" required={true} />
              <Form.Item 
                  rules={[
                    { required: true, message: '' }, 
                    { validator: async (rule, value) => {
                      if (isCnpj) {
                        if (!isValidCnpj(value)) {
                          throw new Error('Cnpj inválido') 
                        }
                      } else {
                        if (!isValidCPF(value)) {
                          throw new Error('Cpf inválido') 
                        }
                      }
                    }}
                  ]} 
                  name="cpfCnpj"
                  style={{ marginBottom: 10 }}
                >
                  <MaskedInput mask={isCnpj ? '00.000.000/0000-00' : '000.000.000-00'} />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              <CustomLabel htmlFor="centrosCusto" labelText="Centro de custo" />
              <Form.Item 
                name="centrosCusto"
                normalize={(value) => ({ id: value, value: value })}
              >
                <Select 
                  options={centrosCustos}
                  style={{ width: '100%' }}
                  allowClear
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      )}
      
		</Modal>
  );
}