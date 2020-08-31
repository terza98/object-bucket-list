import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

// https://react-bootstrap.github.io/getting-started/introduction#importing-components
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';

//API import
import ApiClient from '../api/auth-service.js';

export default function SingleBucket(props) {
	//files
	const { id } = useParams();
	const { title } = useParams();
	const [filesList, loadFiles] = useState(['']);

	//general state
	const [isLoaded, setLoad] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [key, setKey] = useState('files');

	//details
	const [details, setDetails] = useState('');

	const fileInput = useRef(null);

	const [fileSelected, selectFile] = useState('');

	//modal popup
	const [show, setShow] = useState(false);
	const [isBucket, setIsBucket] = useState('');

	const handleClose = () => setShow(false);
	const handleShow = prop => {
		prop === 'object' ? setIsBucket('object') : setIsBucket('bucket');
		setShow(true);
	};

	useEffect(() => {
		// Update files in bucket
		ApiClient.getObjectsList(id)
			.then(result => {
				setLoad(true);
				loadFiles(result.data.objects);
			})
			.catch(error => {
				setError(error);
			});
		//get bucket details
		ApiClient.getSingleBucket(id)
			.then(result => {
				setLoad(true);
				setDetails(result.data.bucket);
			})
			.catch(error => {
				if (error.response) {
					error.response.status === 404
						? setError('Required entity cannot be found.')
						: setError(error.message);
				}
			});
	}, [id]);

	const deleteBucket = () => {
		ApiClient.deleteBucket(id)
			.then(result => {
				props.onRemove(id);
			})
			.catch(error => {
				if (error.response) {
					error.response.status === 404
						? setError('Required entity cannot be found.')
						: setError(error.message);
				}
			});
	};

	const uploadFile = e => {
		ApiClient.uploadFile(id, e.target.files[0])
			.then(result => {
				loadFiles([...filesList, result.data]);
				setSuccess('Successfully uploaded object.');
			})
			.catch(error => {
				if (error.response) {
					error.response.status === 400
						? setError('Request is badly formatted.')
						: error.response.status === 404
						? setError('Required entity cannot be found.')
						: setError(error.message);
				}
			});
	};
	const handleUpload = () => {
		fileInput.current.click();
	};

	const formatDate = date => {
		let newDate = date.split('-').join('.').replace('T', ' at ');
		const index = newDate.indexOf(':') + 6;
		newDate = newDate.substring(0, index);
		const newIndex = newDate.indexOf(' at');
		let newDateFirst = newDate.substring(0, newIndex);
		newDateFirst = newDateFirst.split('.').reverse().join('.');
		let newDateSecond = newDate.substring(newIndex, newDate.length);
		newDate = newDateFirst + newDateSecond;
		return newDate;
	};

	const bytesToSize = bytes => {
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
		if (bytes === 0) return '0 Byte';
		let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
		return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
	};

	const totalSize = () => {
		let total = 0;
		filesList.map((item, index) => (total += item.size));
		return bytesToSize(total);
	};
	const handleFileSelect = id => {
		selectFile(id);
	};

	const handleFileDelete = () => {
		ApiClient.deleteFile(id, fileSelected)
			.then(result => {
				//update file list
				let newFilesList = [...filesList];
				filesList.map(
					(item, index) =>
						item.name === fileSelected &&
						newFilesList.splice(index, 1),
				);
				loadFiles(newFilesList);
				//hide modal
				setShow(false);
				result.status === 200 || result.status === 204
					? setSuccess('Object has been deleted successfully.')
					: setSuccess('');
			})
			.catch(error => {
				if (error.response) {
					error.response.status === 404
						? setError('Required entity cannot be found.')
						: setError(error.message);
				}
			});
	};

	//sorting files in a list to abc order
	const sortFiles = (a, b) => {
		// Use toUpperCase() to ignore character casing
		const nameA = a.name.toUpperCase();
		const nameB = b.name.toUpperCase();

		let comparison = 0;
		if (nameA > nameB) {
			comparison = 1;
		} else if (nameA < nameB) {
			comparison = -1;
		}
		return comparison;
	};

	return (
		isLoaded && (
			<Container className="innerWrapper text-left">
				<h5 className="text-left">{title}</h5>
				<button className="text-left" id="back" onClick={props.onBack}>
					← Back
				</button>
				<Row>
					<Col className="text-right">
						<Modal show={show} onHide={handleClose}>
							<Modal.Header closeButton>
								<Modal.Title>Are you sure?</Modal.Title>
							</Modal.Header>
							<Modal.Body>
								Do you really want to delete this {isBucket}?
							</Modal.Body>
							<Modal.Footer>
								<Button
									className="modal-btn"
									variant="primary"
									onClick={
										isBucket === 'object'
											? handleFileDelete
											: deleteBucket
									}
								>
									Delete
								</Button>
								<Button
									className="modal-btn"
									variant="secondary"
									onClick={handleClose}
								>
									Cancel
								</Button>
							</Modal.Footer>
						</Modal>
						{key === 'files' ? (
							<>
								{fileSelected !== '' && (
									<Button
										id="deleteObject"
										onClick={() => handleShow('object')}
									>
										Delete Object
									</Button>
								)}
								<Button
									id="uploadObject"
									onClick={handleUpload}
								>
									Upload Object
								</Button>
								<input
									style={{ display: 'none' }}
									ref={fileInput}
									type="file"
									onChange={uploadFile}
								/>
							</>
						) : (
							<>
								<Button
									id="deleteBucket"
									onClick={() => handleShow('bucket')}
								>
									Delete Bucket
								</Button>
							</>
						)}
					</Col>
				</Row>
				<Tabs
					id="controlled-tab-example"
					activeKey={key}
					onSelect={k => setKey(k)}
				>
					<Tab eventKey="files" title="Files">
						{error && (
							<Alert
								variant="danger"
								onClose={() => setError('')}
								dismissible
							>
								{typeof error !== 'object' ? error : ''}
							</Alert>
						)}
						{success && (
							<Alert
								variant="success"
								onClose={() => setSuccess('')}
								dismissible
							>
								{typeof success !== 'object' ? success : ''}
							</Alert>
						)}
						<Row style={{ padding: '2%' }}>
							<p>All files ({filesList.length})</p>
							<Table hover>
								<thead>
									<tr>
										<th>Name</th>
										<th>Last modified</th>
										<th>Size</th>
									</tr>
								</thead>
								<tbody>
									{filesList
										.sort(sortFiles)
										.map((item, index) => (
											<tr
												className={
													fileSelected === item.name
														? 'selectedObject'
														: null
												}
												onClick={() =>
													handleFileSelect(item.name)
												}
												key={index}
											>
												<td>
													<span className="bucket-name">
														{item.name}
													</span>
												</td>
												{item.last_modified !==
													undefined && (
													<td>
														{formatDate(
															item.last_modified,
														)}
													</td>
												)}
												<td>
													{bytesToSize(item.size)}
												</td>
											</tr>
										))}
								</tbody>
							</Table>
						</Row>
					</Tab>
					<Tab eventKey="details" title="Details">
						{details !== '' && details !== null && (
							<div
								className="text-left"
								style={{ padding: '2% 4%' }}
							>
								<p>Bucket Name: {details.name}</p>
								<p>Location: {details.location.name}</p>
								<p>Storage Size: {totalSize()}</p>
							</div>
						)}
					</Tab>
				</Tabs>
			</Container>
		)
	);
}
