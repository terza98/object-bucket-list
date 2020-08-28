import React from 'react';
import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';

//components
import Header from './components/Header.js';
import BucketList from './components/BucketList.js';

function App() {
	return (
		<div className="App">
			<Header title="Secure cloud storage" />
			<Container fluid id="wrapper">
				<BucketList title="Bucket list" />
			</Container>
		</div>
	);
}

export default App;
