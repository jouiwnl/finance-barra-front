import { OutputType } from "jspdf-invoice-template";

export default function(props) {
  return {
    outputType: OutputType.DataUrlNewWindow,
    returnJsPDFDocObject: true,
    fileName: `Relatório ${props.data}`,
    orientationLandscape: true,
    compress: true,
    logo: {
        src: "https://upload.wikimedia.org/wikipedia/pt/9/90/BarraFC2020.png",
        type: 'PNG', //optional, when src= data:uri (nodejs case)
        width: 20, //aspect ratio = width/height
        height: 25,
        margin: {
            top: 0, //negative or positive num, from the current position
            left: 0 //negative or positive num, from the current position
        }
    },
    business: {
      name: "Barra - Futebol Clube",
      address: "Algum estado, alguma cidade, S/N",
      phone: "(48) 99999-9999",
      email: "barrafc@barrafc.com.br",
      website: "www.barrafc.com.br",
    },
    contact: {
      label: "Lançado para: ",
      name: props.banco,
      address: `Número do cheque: ${props.numeroCheque}`,
      phone: "(48) 99999-9999",
      email: "banco@banco.com",
      otherInfo: "www.banco.com",
    },
    invoice: {
        label: "Relação de contas #",
        num: String(props.numeroCheque),
        invDate: `Data do envio: ${props.data}`,
        headerBorder: false,
        tableBodyBorder: false,
        header: [
          { 
            title: "C. contábil",
            style: {
              width: 26
            } 
          },
          { 
            title: "A. contábil",
            style: {
              width: 26
            } 
          }, 
          { 
            title: "C. custo",
            style: {
              width: 37
            } 
          },
          { 
            title: "Beneficiário (impostos/taxas/pessoa)",
            style: {
              width: 70
            } 
          }, 
          { 
            title: "Doc.",
            style: {
              width: 49
            } 
          }, 
          { 
            title: "Assunto",
            style: {
              width: 49
            } 
          }, 
          { 
            title: "Total",
            style: {
              width: 28
            } 
          } 
        ],
        table: props.lancamentos.map(lancamento => ([
            lancamento.planosContas.codigo,
            lancamento.planosContas.alocacaoContabil,
            lancamento.centrosCusto ? lancamento.centrosCusto.sigla : '',
            lancamento.pessoa ? lancamento.pessoa.nome : lancamento.imposto.sigla,
            lancamento.documento,
            lancamento.assunto,
            `R$${lancamento.total.toLocaleString('pt-br', {minimumFractionDigits: 2})}`
        ])),
        additionalRows: [{
            col1: 'Total lançado:',
            col2: `R$${props.totalLancado.toLocaleString('pt-br', {minimumFractionDigits: 2})}`,
            style: {
                fontSize: 14 //optional, default 12
            }
        },]
    },
    pageEnable: true,
    pageLabel: "Page ",
  }
};