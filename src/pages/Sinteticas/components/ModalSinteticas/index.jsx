import React from 'react'
import { Button, Col, Input, Modal, Row, Select } from 'antd';

import { notificar } from '../../../../utils/Notification'
import Tracker from '../../../../components/Tracker';
import { SinteticosService } from '../../../../services/SinteticosService';
import { AnaliticosService } from '../../../../services/AnaliticosService';

import _ from 'lodash';

export default function({ idSintetico, triggerModal, onClose }) {
	const [isModalOpen, setIsModalOpen] = React.useState(triggerModal);
  const [form, setForm] = React.useState({ analiticos: [] });
  const [loadingSave, setLoadingSave] = React.useState(false);
  const [loadingRegister, setLoadingRegister] = React.useState(false);
  const [analiticos, setAnaliticos] = React.useState([]);

  React.useEffect(() => {
    setIsModalOpen(triggerModal)
    init()
  }, [triggerModal])

  function init() {
    AnaliticosService.findAll()
      .then(response => fixAnaliticos(response.data))
      .then(fixed => setAnaliticos(fixed));

    if (!idSintetico) {
      return;
    }

    setLoadingRegister(true)
    SinteticosService.findOne(idSintetico)
      .then(({ data }) => {
        data.analiticos = fixAnaliticos(data.analiticos);

        setAnaliticos(state => (_.merge([...state], data.analiticos)))
        setForm(data);
      })
      .finally(() => setLoadingRegister(false));
  }

  function handleSave() {
    setLoadingSave(true)

    const post = { ...form,  ['analiticos']: fixAnaliticosToSave(form.analiticos)};

    SinteticosService.save(post)
      .then(() => {
        notificar('success', 'Registro salvo com sucesso')
        closeModal(true);
        onClose(true);
      })
      .finally(() => setLoadingSave(false))
  };

  function closeModal() {
    setAnaliticos([]);
    setIsModalOpen(false);
  };

  function handleInputChange(name, value) {
    setForm({...form, [name]: value});
  }

  function fixAnaliticos(params) {
    return params.map(analitico =>  {  
      return {
        ...analitico, 
        label: analitico.nome, 
        value: analitico.id
      }
    })
  }

  function fixAnaliticosToSave(analiticos) {
    return analiticos.map(analitico => analitico.id ? { id: analitico.id } : { id: analitico })
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
          <Row>
            <Col span={24}>
              <label htmlFor="nome">Nome</label>
              <Input required id='nome' onChange={(e) => handleInputChange('nome', e.target.value)} value={form.nome ?? ''}/>
            </Col>
          </Row>

          <Row style={{ marginTop: 15 }}>
            <Col span={24}>
              <label htmlFor="cargo">Analíticos</label>
              <Select 
                value={form.analiticos} 
                options={analiticos}
                mode="multiple"
                style={{ width: '100%' }}
                onChange={(c) => handleInputChange('analiticos', c)}
              />
            </Col>
          </Row>
        </>
      )}
      
		</Modal>
  );
}