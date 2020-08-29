import React, { useState, useEffect } from 'react';
// https://react-bootstrap.github.io/getting-started/introduction#importing-components
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

export default function AllBuckets(props) {
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		setLoaded(true);
	}, []);

	if (!loaded) {
		return <h1>Loading...</h1>;
	}

	return (
		<Container className="innerWrapper">
			<Row>
				<Col className="text-left">
					<p>
						{props.title}({props.buckets.length})
					</p>
				</Col>
				<Col className="text-right">
					{!props.showNew && (
						<Button onClick={props.showNewBucket}>
							Create New Bucket
						</Button>
					)}
				</Col>
			</Row>
			<Row style={{ padding: '2%' }}>
				<Table hover>
					<thead>
						<tr>
							<th>Name</th>
							<th>Location</th>
						</tr>
					</thead>
					<tbody>
						{props.buckets !== undefined &&
							props.buckets.map((item, index) => (
								<tr
									onClick={() =>
										props.showSingleBucket(
											item.name,
											item.id,
										)
									}
									key={index}
									id={item.id}
								>
									<td>
										<span className="bucket-name">
											{item.name}
										</span>
									</td>
									{item.location !== undefined && (
										<td>{item.location.name}</td>
									)}
								</tr>
							))}
					</tbody>
				</Table>
			</Row>
		</Container>
	);
}
