import React from 'react';

//components
import App from './App';
import AllBuckets from './components/AllBuckets.js';
import SingleBucket from './components/SingleBucket.js';

//routing
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router-dom';
import history from './history';

//tests
import { buckets as bucketList } from './fetchData.js';

//api
import axios from 'axios';

//testing tools
import { act, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import userEvent from '@testing-library/user-event';

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
}));

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

//test if the app doesn't crash first
it('renders without crashing', () => {
	const div = document.createElement('div');
	ReactDOM.render(<App />, div);
});

describe('<App />', () => {
	it('Renders <AllBuckets /> component', async () => {
		act(() => {
			ReactDOM.render(
				<Router history={history}>
					<AllBuckets buckets={bucketList.buckets} />
				</Router>,
				container,
			);
			expect(axios.get).toHaveBeenCalledTimes(1);
		});

		bucketList.buckets.forEach(td => {
			expect(screen.getByText(td.name)).toBeInTheDocument();
		});
	});

	it('Renders buckets, and I can click to view a bucket item', async () => {
		act(() => {
			ReactDOM.render(
				<Router history={history}>
					<AllBuckets buckets={bucketList.buckets} />
				</Router>,
				container,
			);
		});

		bucketList.buckets.forEach(td => {
			expect(screen.getByText(td.name)).toBeInTheDocument();
		});

		// click on a bucket item and test the result
		const { id, name, location } = bucketList.buckets[0];
		axios.get.mockImplementationOnce(() =>
			Promise.resolve({
				data: { id, name, location },
			}),
		);
		act(() => {
			userEvent.click(screen.getByText(String(name)));
			waitForElementToBeRemoved(() =>
				screen.getByText(/Create New Bucket/i),
			);
			ReactDOM.render(
				<Router history={history}>
					<Route path="/bucket/:title/:id">
						<SingleBucket />
					</Route>
				</Router>,
				container,
			);
		});

		await waitForElementToBeRemoved(() =>
			screen.getByAltText(/loading.../i),
		);
		expect(screen.getByText(`Bucket Name: ${name}`)).toBeInTheDocument();
		expect(
			screen.getByText(`Location: ${location.name}`),
		).toBeInTheDocument();
	});
	it('fetches erroneously data from an API', async () => {
		const errorMessage = 'Network Error';

		axios.get.mockImplementationOnce(() =>
			Promise.reject(new Error(errorMessage)),
		);
	});
});
