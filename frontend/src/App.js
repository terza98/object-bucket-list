import React, { useState, useEffect } from 'react';
import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';

//components
import Header from './components/Header.js';
import NewBucket from './components/NewBucket.js';
import AllBuckets from './components/AllBuckets.js';
import SingleBucket from './components/SingleBucket.js';

//API
import Service from './api/auth-service.js';

function App() {
	const [showNewBucketForm, setShowNewBucketForm] = useState(false);
	const [showSingleBucket, setShowSingleBucket] = useState(false);

	// Single Bucket Form
	const [singleBucketName, setSingleBucketName] = useState('');

	// Single
	const [singleBucketId, setSingleBucketId] = useState('');

	// General state
	const [loaded, setLoaded] = useState(false);
	const [error, setError] = useState('');

	//
	const [bucketList, loadBucketList] = useState(['']);
	const bucketCount = bucketList.length;

	useEffect(() => {
		// Load/update the buckets
		Service.getBucketList()
			.then(result => {
				console.log(result.data);
				loadBucketList(result.data.buckets);
			})
			.catch(error => {
				setError(error);
			})
			.finally(() => {
				setLoaded(true);
			});
	}, []);

	const handleNewBucket = (name, location) => {
		Service.createBucket(name, location).then(
			result => {
				console.log(result.data.bucket);
				setShowNewBucketForm(!showNewBucketForm);

				loadBucketList([...bucketList, result.data.bucket]);
			},
			// Note: handling errors here
			error => {
				setError(error);
			},
		);
	};

	const showNewBucket = () => {
		setShowNewBucketForm(!showNewBucketForm);
	};
	const displayBucket = (name, id) => {
		setShowSingleBucket(!showSingleBucket);
		setSingleBucketName(name);
		setSingleBucketId(id);
	};
	const removeSingleBucket = id => {
		//when bucket is deleted update bucket list
		setShowSingleBucket(!showSingleBucket);
		let newBucketList = [...bucketList];
		bucketList.map(
			(item, index) => item.id === id && newBucketList.splice(index, 1),
		);
		console.log(newBucketList);
		loadBucketList(newBucketList);
	};

	function render() {
		if (!loaded) {
			return <h1>Loading...</h1>;
		}

		if (showSingleBucket) {
			return (
				<SingleBucket
					id={singleBucketId}
					title={singleBucketName}
					removeSingleBucket={removeSingleBucket}
					showSingleBucket={displayBucket}
				/>
			);
		}

		return (
			<>
				<h5 className="text-left">Bucket List</h5>
				<NewBucket
					new={showNewBucketForm}
					showNewBucket={showNewBucket}
					handleNewBucket={handleNewBucket}
					title="Create New Bucket"
				/>
				<AllBuckets
					showSingleBucket={displayBucket}
					bucketsCount={bucketCount}
					bucket={bucketList}
					new={showNewBucketForm}
					showNewBucket={showNewBucket}
					handleNewBucket={handleNewBucket}
					title="All buckets"
				/>
			</>
		);
	}

	return (
		<div className="App">
			<Header title="Secure cloud storage" />
			<Container id="wrapper">{render()}</Container>
		</div>
	);
}

export default App;
