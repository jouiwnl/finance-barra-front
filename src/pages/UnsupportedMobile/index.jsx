import React from 'react';
import { Alert } from 'antd';

export default function() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: 20 }}>
      <Alert 
        showIcon={true} 
        description="Tamanho de tela não suportado. Por favor use a versão em um desktop!"
        type='error'
      />
    </div>
  )
}