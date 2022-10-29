import React from 'react'

export default function CustomLabel({ labelText, required, htmlFor }) {
  return (
    <>
      <label htmlFor={htmlFor}>
        {labelText}
      </label> 
      {required && <span style={{ color: '#ff4d4f', marginLeft: 3 }}>*</span>}
    </>
  )
}