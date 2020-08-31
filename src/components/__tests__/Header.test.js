import React from 'react';
import Header from '../Header.js';
import ReactDOM from 'react-dom';
import { render } from '@testing-library/react';
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
	ReactDOM.render(<Header />, container);
});

it('matches snapshot', () => {
	const { asFragment } = render(<Header />);

	expect(asFragment()).toMatchSnapshot();
});

test('renders simple title', () => {
	const title = 'Example Title';
	const { getByText } = render(<Header title={title} />);
	const headerText = getByText(title);
	expect(headerText).toBeInTheDocument();
});
