import React, { useState, useEffect } from 'react';

// https://react-bootstrap.github.io/getting-started/introduction#importing-components
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

//API import
import ApiClient from '../api/auth-service.js';

export default function NewBucket(props) {
	const [bucketLocations, loadBucketLocation] = useState(['']);
	const [error, setError] = useState('');
	const [name, setName] = useState('');
	const [location, setLocation] = useState('');

	useEffect(() => {
		// Update the bucket location
		ApiClient.getBucketLocation()
			.then(result => {
				loadBucketLocation(result.data.locations);
			})
			.catch(error => {
				setError(error.message);
			});
	}, []);

	function handleNameChange(e) {
		setName(e.target.value);
	}
	function handleLocationChange(e) {
		setLocation(e.target.value);
	}

	return (
		<>
			<p className="text-left">Create New Bucket</p>
			<Container className="innerWrapper">
				{error && (
					<Alert
						variant="danger"
						onClose={() => setError('')}
						dismissible
					>
						{typeof error !== 'object' ? error : ''}
					</Alert>
				)}
				<Form>
					<Row>
						<Col className="text-left">
							<Form.Label className="required">
								Bucket Name
							</Form.Label>
							<Form.Control
								onChange={handleNameChange}
								value={name}
								placeholder="MyNewStorage"
							/>
						</Col>
						<Col className="text-left">
							<Form.Label className="required">
								Bucket Location
							</Form.Label>
							<Form.Control
								onChange={handleLocationChange}
								value={location}
								as="select"
							>
								<option value="0">Choose...</option>
								{bucketLocations.map((item, index) => (
									<option key={index} value={item.id}>
										{item.name}
									</option>
								))}
							</Form.Control>
						</Col>
					</Row>
					<Row className="text-left">
						<Button
							style={{ margin: '15px' }}
							onClick={() => props.onSubmit(name, location)}
						>
							Create Bucket
						</Button>
					</Row>
				</Form>
			</Container>
		</>
	);
}
