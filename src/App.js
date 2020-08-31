import React, { useState, useEffect } from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import history from './history';
import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// https://react-bootstrap.github.io/getting-started/introduction#importing-components
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';

//components
import Header from './components/Header.js';
import NewBucket from './components/NewBucket.js';
import AllBuckets from './components/AllBuckets.js';
import SingleBucket from './components/SingleBucket.js';

//API
import ApiClient from './api/auth-service.js';

function App() {
	const [showNewBucketForm, setShowNewBucketForm] = useState(false);
	const [showSingleBucket, setShowSingleBucket] = useState(false);

	// General state
	const [loaded, setLoaded] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const [bucketList, loadBucketList] = useState(['']);

	useEffect(() => {
		// Load/update the buckets
		ApiClient.getBucketList()
			.then(result => {
				loadBucketList(result.data.buckets);
			})
			.catch(error => {
				setError(error.message);
			})
			.finally(() => {
				setLoaded(true);
			});
	}, []);

	const handleNewBucket = (name, location) => {
		ApiClient.createBucket(name, location)
			.then(result => {
				setShowNewBucketForm(!showNewBucketForm);
				loadBucketList([...bucketList, result.data.bucket]);
				setSuccess('Successfully added new bucket.');
			})
			.catch(error => {
				if (error.response) {
					error.response.status === 400
						? setError('Request is badly formatted.')
						: error.response.status === 409
						? setError('Entity with this name already exists.')
						: setError(error.message);
				}
			});
	};

	const showNewBucket = () => {
		setShowNewBucketForm(!showNewBucketForm);
	};

	const removeSingleBucket = id => {
		//when bucket is deleted update bucket list
		setShowSingleBucket(!showSingleBucket);
		let newBucketList = [...bucketList];
		bucketList.map(
			(item, index) => item.id === id && newBucketList.splice(index, 1),
		);
		loadBucketList(newBucketList);
		setSuccess('Bucket has been deleted successfully.');
	};

	if (!loaded) {
		return <img src={require('./loading.gif')} alt="loading..." />;
	}
	return (
		<div className="App">
			<Router history={history}>
				<Header title="Secure cloud storage" />
				<Container id="wrapper">
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
					<Switch>
						<Route
							exact
							path="/"
							render={() => (
								<>
									<h5 className="text-left">Bucket List</h5>
									{showNewBucketForm && (
										<NewBucket onSubmit={handleNewBucket} />
									)}
									<AllBuckets
										buckets={bucketList}
										showNew={showNewBucketForm}
										showNewBucket={showNewBucket}
										handleNewBucket={handleNewBucket}
										title="All buckets"
									/>
								</>
							)}
						/>
						<Route
							path="/bucket/:title/:id"
							component={() => (
								<SingleBucket
									onRemove={removeSingleBucket}
									onBack={() => {
										history.push('/');
									}}
								/>
							)}
						/>
					</Switch>
				</Container>
			</Router>
		</div>
	);
}

export default App;
