import { locations } from '../makeTests.js';

export default {
	get: jest.fn().mockImplementation(url => {
		switch (url) {
			case 'https://challenge.3fs.si/storage/locations':
				return Promise.resolve({ data: locations });
			default:
				throw new Error(`UNMATCHED URL: ${url}`);
		}
	}),
};
