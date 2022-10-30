import { Alert } from 'antd';
import React from 'react';

export default function AccessError() {
  return (
    <>
      <Alert
        style={{ margin: 10 }}
        message="Erro de permissão"
        description="Você não tem permissão suficiente para acessar essa página, contate o admnistrador do sistema para mais informações"
        type="error"
        showIcon
      />
    </>
  );
}