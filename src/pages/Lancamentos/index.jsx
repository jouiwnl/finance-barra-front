import React from 'react';

import { Button, Col, PageHeader, Row, Statistic, Table, Tag } from 'antd';
import { SyncOutlined, CheckCircleOutlined, FilePdfOutlined } from '@ant-design/icons'
import { useParams } from 'react-router-dom';
import Tracker from '../../components/Tracker';
import { LancamentosEnglobadosService } from '../../services/LancamentosEnglobadosService'
import Actions from './components/Actions'

import moment from 'moment';
import ModalLancamentos from './components/ModalLancamentos';

import jsPDFInvoiceTemplate from "jspdf-invoice-template";
import getDocumentProps from '../../utils/getDocumentProps';

export default function() {

  const { englobadosId } = useParams();

  const [lancamentos, setLancamentos] = React.useState([]);
  const [lancamentoEnglobado, setLancamentoEnglobado] = React.useState({});
  const [totalLancado, setTotalLancado] = React.useState(0);
  const [loadingRegisters, setLoadingRegisters] = React.useState(false);
  const [triggerModal, setTriggerModal] = React.useState(false);

  React.useEffect(() => {
    init();
  }, [])

  const columns = [
    {
      title: 'C. Contábil',
      key: 'ccontabil',
      render: (_, record) => {
        return <span>{record.planosContas.codigo}</span>
      }
    },
    {
      title: 'A. Contábil',
      key: 'acontabil',
      render: (_, record) => {
        return <span>{record.planosContas.alocacaoContabil}</span>
      }
    },
    {
      title: 'Tipo',
      key: 'tipo',
      render: (_, record) => {
        return <span>{record.tipo}</span>
      }
    },
    {
      title: 'C. Custo',
      key: 'centroCusto',
      render: (_, record) => {
        return <span>
          {record.centrosCusto ? record.centrosCusto.sigla : '' } 
        </span>
      }
    },
    {
      title: 'Sintética',
      key: 'sintetica',
      render: (_, record) => {
        return <span>{record.sintetico ? record.sintetico.nome : ''}</span>
      }
    },
    {
      title: 'Analítica',
      key: 'analitica',
      render: (_, record) => {
        return <span>{record.analitico ? record.analitico.nome : ''}</span>
      }
    },
    {
      title: `Beneficiário (imposto ou pessoa)`,
      key: 'analitica',
      render: (_, record) => {
        return <span>{record.tipo === 'IMPOSTOS' ? record.imposto.sigla : record.pessoa.nome}</span>
      }
    },
    {
      title: 'Doc.',
      dataIndex: 'documento',
      key: 'documento',
    },
    {
      title: 'Assunto',
      dataIndex: 'assunto',
      key: 'assunto',
    },
    {
      title: 'Total',
      key: 'assunto',
      render: (_, record) => {
        return <span><strong>R$ </strong>{record.total.toLocaleString('pt-br', {minimumFractionDigits: 2})}</span>
      }
    },
    {
      title: '',
      key: 'acoes',
      align: 'center',
      render: (_, record) => 
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
          <Actions reload={init} record={record} />
        </div>
    },
  ];

  function init() {
    setLoadingRegisters(true);

    LancamentosEnglobadosService.findOne(englobadosId)
      .then(({ data }) => {
        console.log(data)
        setLancamentoEnglobado(data)
        setLancamentos(data.lancamentos);

        const totalLancado = data.lancamentos.reduce((acum, lancamento) => {
          return acum + lancamento.total;
        }, 0)

        setTotalLancado(totalLancado);
      })
      .finally(() => setLoadingRegisters(false));
  }

  function handleOpenModalRegister() {
		setTriggerModal(true)
	}

  function onCloseModalRegister(recordSaved) {
		setTriggerModal(false)

		if (recordSaved) {
			init();
		}
	}

  function handleGerarRelatorio() {
    const props = {
      numeroCheque: lancamentoEnglobado.numeroCheque,
      data: moment(lancamentoEnglobado.dataLancamento).format('DD/MM/YYYY'),
      lancamentos: lancamentos,
      banco: lancamentoEnglobado.banco.nome,
      totalLancado
    }
    
    jsPDFInvoiceTemplate(getDocumentProps(props)).jsPDFDocObject;
  }

  return (
    <>
      <PageHeader
        onBack={() => window.history.back()}
        title={`Lançamento englobado ${moment(lancamentoEnglobado.dataLancamento).format('DD/MM/YYYY')}`}
        tags={<StatusEnglobado englobado={lancamentoEnglobado} />}
        extra={[
          <Row key="1" gutter={16}>
            <Col col={12}>
              <Button icon={<FilePdfOutlined />} disabled={lancamentoEnglobado.status !== 'HOMOLOGADO' || !lancamentos.length} onClick={handleGerarRelatorio}>
                Gerar relatório
              </Button>
            </Col> 
            <Col col={12}>
              <Button disabled={lancamentoEnglobado.status === 'HOMOLOGADO'} onClick={handleOpenModalRegister} type="primary">
                + Lançamento
              </Button>
            </Col>           
          </Row>
        ]}
      >
        <Row style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <h2>{lancamentoEnglobado?.banco?.nome}</h2>
            <h4>(Nº CHEQUE {lancamentoEnglobado?.numeroCheque})</h4>
          </div>
          <Statistic 
            title={<strong style={{ color: 'black' }}>Total lançado</strong>} 
            prefix="R$" 
            value={totalLancado.toLocaleString('pt-br', {minimumFractionDigits: 2})} 
          />
        </Row>
      </PageHeader>

      {loadingRegisters ? (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Tracker size={64} />
        </div>
      ) : (
        <>
          {lancamentos.length ? (
            <Table locale={'pt-BR'} size='small' columns={columns} dataSource={lancamentos} rowKey={(row) => row.id} />
          ) : (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <h3>Esse englobado não possui lançamentos.</h3>
            </div>
          )}
        </>
      )}

      {triggerModal && <ModalLancamentos lancamentoEnglobado={lancamentoEnglobado} onClose={onCloseModalRegister} triggerModal={triggerModal} />}
    </>
  )
}

function StatusEnglobado({ englobado }) {
  if (!englobado) {
    return;
  }

  if (englobado.status === 'HOMOLOGADO') {
    return <Tag icon={<CheckCircleOutlined />} color='success'>HOMOLOGADO</Tag>
  }

  return <Tag icon={<SyncOutlined spin />} color='processing'>EM PROCESSAMENTO</Tag>
}