import React from 'react';
import App from './App';
import ReactDOM from 'react-dom';

//test if the app doesn't crash first
it('renders without crashing', () => {
	const div = document.createElement('div');
	ReactDOM.render(<App />, div);
});
