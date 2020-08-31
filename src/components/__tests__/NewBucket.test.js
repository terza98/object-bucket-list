import React from 'react';
import NewBucket from '../NewBucket.js';
import ReactDOM from 'react-dom';
import { render, fireEvent } from '@testing-library/react';
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
	ReactDOM.render(<NewBucket />, container);
});

it('matches snapshot', () => {
	const { asFragment } = render(<NewBucket />);

	expect(asFragment()).toMatchSnapshot();
});

test('should submit when clicking submit button', () => {
	const handleSubmit = jest.fn();
	const { getByTestId } = render(<NewBucket onSubmit={handleSubmit} />);

	const button = getByTestId('button');
	const input = getByTestId('input');
	const select = getByTestId('select');

	fireEvent.change(input, { target: { value: 'New Storage' } });
	fireEvent.change(select, {
		target: { value: '541909F3-20FC-4382-A8E8-18042F5E7677' },
	});

	fireEvent.click(button);

	expect(handleSubmit).toHaveBeenCalled();
});
