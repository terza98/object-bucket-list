import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

//API import
import Service from '../api/auth-service.js';

export default function AllBuckets(props) {
	const [countBuckets, updateBucketsCount] = useState(0);
	const [bucketList, loadBucketList] = useState(['']);
	const [isLoaded, setLoad] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		// Update the buckets
		loadBucketList(props.bucket);
		setLoad(true);
		updateBucketsCount(props.bucketsCount);
		console.log(props.bucket);
	}, [props.bucket, props.bucketsCount]);

	return (
		isLoaded && (
			<Container className="innerWrapper">
				<Row>
					<Col className="text-left">
						<p>
							{props.title}({props.bucketsCount})
						</p>
					</Col>
					<Col className="text-right">
						{!props.new && (
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
							{props.bucket !== undefined &&
								props.bucket.map((item, index) => (
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
		)
	);
}
