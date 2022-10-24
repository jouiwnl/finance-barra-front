import React from 'react'
import { Button, Col, Input, Modal, Row, Select } from 'antd';

import { notificar } from '../../../../utils/Notification'
import Tracker from '../../../../components/Tracker';
import { FuncionarioService } from '../../../../services/FuncionarioService';

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
    label: 'Pagador',
    value: 'PAGADORES'
  }
]

export default function({ idFuncionario, triggerModal, onClose }) {
	const [isModalOpen, setIsModalOpen] = React.useState(triggerModal);
  const [form, setForm] = React.useState({ tipo: selectOptions[0].value });
  const [loadingSave, setLoadingSave] = React.useState(false);
  const [loadingRegister, setLoadingRegister] = React.useState(false);

  React.useEffect(() => {
    setIsModalOpen(triggerModal)
    init()
  }, [triggerModal])

  function init() {
    if (!idFuncionario) {
      return;
    }
    setLoadingRegister(true)
    FuncionarioService.findOne(idFuncionario)
      .then(({data}) => setForm(data))
      .finally(() => setLoadingRegister(false));
  }

  function handleSave() {
    setLoadingSave(true)
    FuncionarioService.save(form)
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

  function handleInputChange(name, value) {
    setForm({...form, [name]: value});
  }

  function ModalFooter() {
    return (
      <>
        <Button key="back" onClick={closeModal}>
          Cancelar
        </Button>
        <Button key="submit" type="primary" loading={loadingSave} onClick={handleSave}>
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
      title={`${idFuncionario ? 'Editando' : 'Registrando'} funcionário ${idFuncionario ? idFuncionario : ''}`} 
      open={isModalOpen}
      footer={<ModalFooter />}
    >
      {loadingRegister ? (
        <div style={{ textAlign: 'center' }}>
          <Tracker />
        </div>
      ) : (
        <>
          <Row>
            <Col span={24}>
              <label htmlFor="nomeCompleto">Nome completo</label>
              <Input required id='nomeCompleto' onChange={(e) => handleInputChange('nomeCompleto', e.target.value)} value={form.nomeCompleto ?? ''}/>
            </Col>
          </Row>

          <Row style={{ marginTop: 15 }}>
            <Col span={24}>
              <label htmlFor="usuario">Usuário</label>
              <Input id='usuario' onChange={(e) => handleInputChange('usuario', e.target.value)} value={form.usuario ?? ''} />
            </Col>
          </Row>

          { !idFuncionario && (
            <Row style={{ marginTop: 15 }}>
              <Col span={24}>
                <label htmlFor="senha">Senha</label>
                <Input id='senha' type='password' onChange={(e) => handleInputChange('senha', e.target.value)} value={form.senha ?? ''} />
              </Col>
            </Row>
          )}

          <Row style={{ marginTop: 15 }}>
            <Col span={24}>
              <label htmlFor="cargo">Cargo</label>
              <Select 
                value={form.tipo ?? selectOptions[0].value} 
                options={selectOptions} 
                style={{ width: '100%' }}
                onChange={(c) => handleInputChange('tipo', c)}
              />
            </Col>
          </Row>
        </>
      )}
      
		</Modal>
  );
}