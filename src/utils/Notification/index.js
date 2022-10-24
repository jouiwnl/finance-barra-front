import { notification } from 'antd'

export function notificar(type, text) {
    let options = {
        placement: 'bottomRight',
        duration: 2
    };

    if (type === 'success') {
        options.message = 'Sucesso'
        options.description = text;
    }

    if (type === 'info') {
        options.message = 'Info'
        options.description = text;
    }

    if (type === 'warning') {
        options.message = 'Aviso'
        options.description = text
    }

    if (type === 'error') {
        options.message = 'Erro'
        options.description = text
    }

    notification[type](options);
}