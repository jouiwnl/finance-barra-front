import React from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd';

export default function Tracker() {

	const antIcon = (
		<LoadingOutlined style={{ fontSize: 32 }} spin />
	);

	return (
		<Spin indicator={antIcon} />
	)

}