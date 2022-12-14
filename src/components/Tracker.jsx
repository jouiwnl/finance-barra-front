import React from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd';

export default function Tracker({ size }) {

	const antIcon = (
		<LoadingOutlined style={{ fontSize: size ? size : 32 }} spin />
	);

	return (
		<Spin indicator={antIcon} />
	)

}