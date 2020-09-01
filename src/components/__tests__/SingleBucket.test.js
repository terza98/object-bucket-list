import React from 'react';
import SingleBucket from '../SingleBucket.js';

import ReactDOM from 'react-dom';
import axios from 'axios';

import history from '../../history.js';
import { Router, Route } from 'react-router-dom';
import { useParams, MemoryRouter } from 'react-router-dom';

import {
	render,
	waitForElementToBeRemoved,
	screen,
} from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';

let container = null;
beforeEach(() => {
	// setup a DOM element as a render target
	container = document.createElement('div');
	document.body.appendChild(container);
});

afterEach(() => {
	// cleanup on exiting
	unmountComponentAtNode(container);
	container.remove();
	container = null;
});

it('renders without crashing', () => {
	ReactDOM.render(
		<Router history={history}>
			<Route path="/bucket/:title/:id">
				<SingleBucket />
			</Route>
		</Router>,
		container,
	);
});

it('matches snapshot', () => {
	useParams.mockReturnValue({
		title: 'my-awesome-bucket',
		id: 'my-awesome-bucket',
	});

	const { asFragment } = render(
		<Router history={history}>
			<Route path="/bucket/:title/:id">
				<SingleBucket />
			</Route>
		</Router>,
		container,
	);

	expect(asFragment()).toMatchSnapshot();
});

describe('<SingleBucket />', () => {
	it('can tell mocked from unmocked functions', () => {
		expect(jest.isMockFunction(useParams)).toBe(true);
		expect(jest.isMockFunction(MemoryRouter)).toBe(false);
	});
	it('Renders <SingleBucket /> correctly with bucket data', async () => {
		useParams.mockReturnValue({
			title: 'my-awesome-bucket',
			id: 'my-awesome-bucket',
		});
		render(<SingleBucket />);

		await waitForElementToBeRemoved(() =>
			screen.getByAltText(/loading.../i),
		);
		expect(axios.get).toHaveBeenCalledTimes(2);

		expect(screen.getByTestId('bucket-name')).toBeInTheDocument();
		expect(screen.getByTestId('bucket-location')).toBeInTheDocument();
	});

	it('fetches erroneously data from an API', async () => {
		const errorMessage = 'Network Error';

		axios.get.mockImplementationOnce(() =>
			Promise.reject(new Error(errorMessage)),
		);
	});
});
