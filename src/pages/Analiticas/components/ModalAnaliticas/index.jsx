import React from 'react'
import { Alert, Button, Col, Input, Modal, Row, Select } from 'antd';

import { notificar } from '../../../../utils/Notification'
import Tracker from '../../../../components/Tracker';
import { AnaliticosService } from '../../../../services/AnaliticosService';
import { SinteticosService } from '../../../../services/SinteticosService';

import _ from 'lodash';

export default function({ idAnalitico, triggerModal, onClose }) {
	const [isModalOpen, setIsModalOpen] = React.useState(triggerModal);
  const [form, setForm] = React.useState({ sinteticos: [] });
  const [loadingSave, setLoadingSave] = React.useState(false);
  const [loadingRegister, setLoadingRegister] = React.useState(false);
  const [sinteticos, setSinteticos] = React.useState([]);

  React.useEffect(() => {
    setIsModalOpen(triggerModal)
    init()
  }, [triggerModal])

  function init() {
    SinteticosService.findAll()
      .then(response => fixSinteticos(response.data))
      .then(fixed => setSinteticos(fixed));

    if (!idAnalitico) {
      return;
    }

    setLoadingRegister(true)
    AnaliticosService.findOne(idAnalitico)
      .then(({ data }) => {
        data.sinteticos = fixSinteticos(data.sinteticos);

        setSinteticos(state => (_.merge([...state], data.sinteticos)))
        setForm(data);
      })
      .finally(() => setLoadingRegister(false));
  }

  function handleSave() {
    setLoadingSave(true)

    const post = { ...form };
    delete post.sinteticos;
    
    AnaliticosService.save(post)
      .then(() => {
        notificar('success', 'Registro salvo com sucesso')
        closeModal(true);
        onClose(true);
      })
      .finally(() => setLoadingSave(false))
  };

  function closeModal() {
    setSinteticos([]);
    setIsModalOpen(false);
  };

  function handleInputChange(name, value) {
    setForm({...form, [name]: value});
  }

  function fixSinteticos(params) {
    return params.map(sintetico =>  {  
      return {
        ...sintetico, 
        label: sintetico.nome, 
        value: sintetico.id
      }
    })
  }

  function fixSinteticosToSave(sinteticos) {
    return sinteticos.map(sintetico => sintetico.id ? { id: sintetico.id } : { id: sintetico })
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
      title={`${idAnalitico ? 'Editando' : 'Registrando'} sintético ${idAnalitico ? idAnalitico : ''}`} 
      open={isModalOpen}
      footer={<ModalFooter />}
    >
      {loadingRegister ? (
        <div style={{ textAlign: 'center' }}>
          <Tracker />
        </div>
      ) : (
        <>
          <Alert style={{ marginBottom: 20 }} showIcon message="Não é possível alterar os sintéticos por aqui." />

          <Row>
            <Col span={24}>
              <label htmlFor="nome">Nome</label>
              <Input required id='nome' onChange={(e) => handleInputChange('nome', e.target.value)} value={form.nome ?? ''}/>
            </Col>
          </Row>

          <Row style={{ marginTop: 15 }}>
            <Col span={24}>
              <label htmlFor="cargo">Sintéticos</label>
              <Select 
                value={form.sinteticos} 
                options={sinteticos}
                mode="multiple"
                disabled
                style={{ width: '100%' }}
                onChange={(c) => handleInputChange('sinteticos', c)}
              />
            </Col>
          </Row>
        </>
      )}
      
		</Modal>
  );
}