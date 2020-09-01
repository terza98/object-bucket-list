import { locations, buckets, objects, bucket } from '../makeTests.js';

export default {
	get: jest.fn().mockImplementation(url => {
		switch (url) {
			case 'https://challenge.3fs.si/storage/locations':
				return Promise.resolve({ data: locations });

			case 'https://challenge.3fs.si/storage/buckets':
				return Promise.resolve({ data: buckets });

			case 'https://challenge.3fs.si/storage/buckets/my-awesome-bucket/objects':
				return Promise.resolve({ data: objects });

			case 'https://challenge.3fs.si/storage/buckets/my-awesome-bucket':
				return Promise.resolve({ data: bucket });

			default:
				throw new Error(`UNMATCHED URL: ${url}`);
		}
	}),
};
