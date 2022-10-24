import React from 'react'
import {  Button, Col, Input, Modal, Row } from 'antd';

import { notificar } from '../../../../utils/Notification'
import Tracker from '../../../../components/Tracker';
import { PlanosContasService } from '../../../../services/PlanosContasService';

export default function({ idPlanos, triggerModal, onClose }) {
	const [isModalOpen, setIsModalOpen] = React.useState(triggerModal);
  const [form, setForm] = React.useState({ sinteticos: [] });
  const [loadingSave, setLoadingSave] = React.useState(false);
  const [loadingRegister, setLoadingRegister] = React.useState(false);

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
      .then(({ data }) => setForm(data))
      .finally(() => setLoadingRegister(false));
  }

  function handleSave() {
    setLoadingSave(true)
    
    PlanosContasService.save(form)
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
          <Row>
            <Col span={24}>
              <label htmlFor="codigo">Código</label>
              <Input required id='codigo' onChange={(e) => handleInputChange('codigo', e.target.value)} value={form.codigo ?? ''}/>
            </Col>
          </Row>

          <Row style={{ marginTop: 15 }}>
            <Col span={24}>
              <label htmlFor="descricao">Descrição</label>
              <Input required id='descricao' onChange={(e) => handleInputChange('descricao', e.target.value)} value={form.descricao ?? ''}/>
            </Col>
          </Row>

          <Row style={{ marginTop: 15 }}>
            <Col span={24}>
              <label htmlFor="alocacaoContabil">Alocação contábil</label>
              <Input required id='alocacaoContabil' onChange={(e) => handleInputChange('alocacaoContabil', e.target.value)} value={form.alocacaoContabil ?? ''}/>
            </Col>
          </Row>
        </>
      )}
      
		</Modal>
  );
}