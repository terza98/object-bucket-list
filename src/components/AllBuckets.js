import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
		return <img src={require('../loading.gif')} alt="loading..." />;
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
				<Table id="all-buckets" hover>
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
									style={{ cursor: 'pointer' }}
									key={index}
									id={item.id}
								>
									<td>
										<Link
											to={`/bucket/${item.name}/${item.id}`}
										>
											<span className="bucket-name">
												{item.name}
											</span>
										</Link>
									</td>
									{item.location !== undefined && (
										<td>
											<Link
												to={`/bucket/${item.name}/${item.id}`}
											>
												{item.location.name}
											</Link>
										</td>
									)}
								</tr>
							))}
					</tbody>
				</Table>
			</Row>
		</Container>
	);
}
