import React from 'react';
import Header from '../Header';
import { render } from '@testing-library/react';

test('renders simple title', () => {
	const title = 'Example Title';
	const { getByText } = render(<Header title={title} />);
	const headerText = getByText(title);
	expect(headerText).toBeInTheDocument();
});
