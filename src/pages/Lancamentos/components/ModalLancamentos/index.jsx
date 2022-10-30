import React from 'react'
import { Alert, Button, Col, Form, Input, InputNumber, Modal, Row, Select } from 'antd';

import { notificar } from '../../../../utils/Notification'
import Tracker from '../../../../components/Tracker';
import { LancamentosService } from '../../../../services/LancamentosService';
import { PlanosContasService } from '../../../../services/PlanosContasService';
import { SinteticosService } from '../../../../services/SinteticosService';
import { AnaliticosService } from '../../../../services/AnaliticosService';
import { CentroCustosService } from '../../../../services/CentroCustosService';
import { PessoasService } from '../../../../services/PessoasService';
import { ImpostosService } from '../../../../services/ImpostosService';

import CustomLabel from '../../../../components/CustomLabel';

import _ from 'lodash';

const { Search } = Input;

const tiposLancamento = [
  {
    value: 'FUNCIONARIO',
    label: 'Funcionário'
  },
  {
    value: 'FORNECEDOR',
    label: 'Fornecedor'
  },
  {
    value: 'IMPOSTOS',
    label: 'Impostos'
  },
]

export default function({ idLancamento, triggerModal, onClose, lancamentoEnglobado }) {
	const [isModalOpen, setIsModalOpen] = React.useState(triggerModal);
  const [loadingSave, setLoadingSave] = React.useState(false);
  const [loadingRegister, setLoadingRegister] = React.useState(false);
  const [showMoreOptions, setShowMoreOptions] = React.useState(false);
  const [isSelectedCentrosCusto, setIsSelectedCentrosCusto] = React.useState(false);
  const [isSelectedSintetico, setIsSelectedSintetico] = React.useState(false);
  const [tipoLancamento, setTipoLancamento] = React.useState("");

  const [lancamento, setLancamento] = React.useState({});
  const [centrosCustos, setCentrosCustos] = React.useState([]);
  const [analiticos, setAnaliticos] = React.useState([]);
  const [sinteticos, setSinteticos] = React.useState([]);
  const [pessoas, setPessoas] = React.useState([]);
  const [impostos, setImpostos] = React.useState([]);

  const [form] = Form.useForm();

  React.useEffect(() => {
    setIsModalOpen(triggerModal)
    init()
  }, [triggerModal])

  function init() {
    CentroCustosService.findAll()
      .then(( { data } ) => setCentrosCustos(data));

    PessoasService.findAll()
      .then(({ data }) => setPessoas(data));

    ImpostosService.findAll()
      .then(({ data }) => setImpostos(data));

    if (!idLancamento) {
      return;
    }

    setLoadingRegister(true)
    LancamentosService.findOne(idLancamento)
      .then(({ data }) => {
        setLancamento(state => (_.merge(state, data)))
        setTipoLancamento(data.tipo)
        setShowMoreOptions(true);
        setIsSelectedCentrosCusto(true);
        setIsSelectedSintetico(true);
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
    values.lancamentoEnglobado = lancamentoEnglobado;
    console.log(values)

    LancamentosService.save(values)
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

  function onSearch(value) {
    PlanosContasService.findByCode(value)
      .then(({ data }) => form.setFieldValue('planosContas', data))
      .catch(err => {
        notificar('warning', 'Não foi encontrado nenhum plano de conta com esse código')
      })
  }

  function handleShowMoreOptions(value) {
    if (!value) {
      return;
    }

    setShowMoreOptions(true);
  }

  function handleChangeCentrosCusto() {
    const centro = form.getFieldValue('centrosCusto');

    SinteticosService.findByCentro(centro.id)
      .then(({ data }) => {
        setSinteticos(data);
        setIsSelectedSintetico(false);
      });

    form.setFieldValue('sintetico', undefined);
    form.setFieldValue('analitico', undefined);
    setIsSelectedCentrosCusto(true);
  }

  function handleChangeSintetico() {
    const sintetico = form.getFieldValue('sintetico');
    
    AnaliticosService.findBySintetico(sintetico.id)
      .then(({ data }) => setAnaliticos(data));

    form.setFieldValue('analitico', undefined);
    setIsSelectedSintetico(true);
  }

  function normalizeSelect(value) {
    return { id: value, value: value };
  }

  function handleChangeTipo(tipo) {
    setTipoLancamento(tipo);
    cleanFields();

    if (tipo === 'IMPOSTOS') {
      return;
    }

    PessoasService.findByTipo(tipo)
      .then(( { data } ) => setPessoas(data));
  }

  function cleanFields() {
    form.setFieldValue('sintetico', undefined);
    form.setFieldValue('analitico', undefined);
    form.setFieldValue('centrosCusto', undefined);
    form.setFieldValue('pessoa', undefined);
  }

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
      title={`${idLancamento ? 'Editando' : 'Registrando'} lançamento ${idLancamento ? idLancamento : ''}`} 
      open={isModalOpen}
      footer={<ModalFooter />}
    >
      {loadingRegister ? (
        <div style={{ textAlign: 'center' }}>
          <Tracker />
        </div>
      ) : (
        <>
          <Alert style={{ marginBottom: 20 }} showIcon message="Preencha todos os campos corretamente" />

          <Form layout="vertical" form={form} initialValues={lancamento}>
            <Form.Item name="id" style={{ display: 'none' }}></Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <CustomLabel labelText='Código' />
                <Search
                  placeholder="Código do plano de conta"
                  onSearch={onSearch}              
                />
              </Col>

              <Col span={12}>
                <CustomLabel required={true} labelText='Plano de conta' />
                <Form.Item 
                  name="planosContas"
                  rules={[{ required: true, message: '' }]}
                  normalize={normalizeSelect}
                >
                  <Select
                    style={{ width: '100%' }}
                    disabled
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={24}>
                <CustomLabel labelText='Tipo do lançamento' required={true} />
                <Form.Item 
                  name="tipo"
                  rules={[{ required: true, message: '' }]}
                >
                  <Select
                    style={{ width: '100%' }}
                    options={tiposLancamento}
                    onSelect={handleShowMoreOptions}
                    onChange={handleChangeTipo}
                  />
                </Form.Item>
              </Col>
            </Row>

            {showMoreOptions && (
              <>
                <h2>Dados do lançamento</h2>

                {tipoLancamento === 'IMPOSTOS' ? (
                  <Row>
                    <Col span={24}>
                      <CustomLabel required={true} labelText='Imposto' />
                      <Form.Item 
                        name="imposto"
                        rules={[{ required: true, message: '' }]}
                        normalize={normalizeSelect}
                      >
                        <Select 
                          options={impostos}
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                ) : (
                  <>
                    <Row>
                      <Col span={24}>
                        <CustomLabel labelText='Centro de custo' required={true} />
                        <Form.Item 
                          name="centrosCusto"
                          rules={[{ required: true, message: '' }]}
                          normalize={normalizeSelect}
                        >
                          <Select
                            options={centrosCustos}
                            style={{ width: '100%' }}
                            onChange={handleChangeCentrosCusto}
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col span={12}>
                        <CustomLabel labelText='Sintético' required={true} />
                        <Form.Item 
                          name="sintetico"
                          rules={[{ required: true, message: '' }]}
                          normalize={normalizeSelect}
                        >
                          <Select
                            options={sinteticos}
                            style={{ width: '100%' }}
                            onChange={handleChangeSintetico}
                            disabled={!isSelectedCentrosCusto}
                          />
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <CustomLabel required={true} labelText='Analítico' />
                        <Form.Item 
                          name="analitico"
                          rules={[{ required: true, message: '' }]}
                          normalize={normalizeSelect}
                        >
                          <Select 
                            options={analiticos}
                            style={{ width: '100%' }}
                            disabled={!isSelectedSintetico}
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col span={24}>
                        <CustomLabel labelText='Beneficiário' required={true} />
                        <Form.Item 
                          name="pessoa"
                          rules={[{ required: true, message: '' }]}
                          normalize={normalizeSelect}
                        >
                          <Select
                            options={pessoas}
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </>
                )}
              </>
            )}

            <Row gutter={16}>
              <Col span={8}>
                <CustomLabel labelText='Assunto' required={true} />
                <Form.Item 
                  name="assunto"
                  rules={[{ required: true, message: '' }]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={8}>
                <CustomLabel required={true} labelText='Documento' />
                <Form.Item 
                  name="documento"
                  rules={[{ required: true, message: '' }]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={8}>
                <CustomLabel required={true} labelText='Total' />
                <Form.Item 
                  name="total"
                  rules={[{ required: true, message: '' }]}
                >
                  <InputNumber
                    placeholder='total'
                    addonBefore="R$"
                    min={1}
                    precision={2}
                    step={0.1}
                    max={99999999}
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