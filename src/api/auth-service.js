import axios from 'axios';
import { API_ACCESS_TOKEN, API_URL } from '../config';

const config = {
	headers: {
		Authorization: `Token ${API_ACCESS_TOKEN}`,
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
};
const fileConfig = {
	headers: {
		Authorization: `Token ${API_ACCESS_TOKEN}`,
		'content-type': 'multipart/form-data',
		Accept: 'multipart/form-data',
	},
};

// TODO rename to ApiClient and accept api url as an argument
class ApiClient {
	getBucketLocation() {
		return axios.get(API_URL + 'locations', config);
	}
	getBucketList() {
		return axios.get(API_URL + 'buckets', config);
	}
	createBucket(name, location) {
		return axios.post(API_URL + 'buckets', { name, location }, config);
	}
	getSingleBucket(bucket) {
		return axios.get(API_URL + `buckets/${bucket}`, config);
	}
	deleteBucket(bucket) {
		return axios.delete(API_URL + `buckets/${bucket}`, config);
	}
	getObjectsList(bucket) {
		return axios.get(API_URL + `buckets/${bucket}/objects`, config);
	}
	uploadFile(bucket, file) {
		const formData = new FormData();
		formData.append('file', file);

		return axios.post(
			API_URL + `buckets/${bucket}/objects`,
			formData,
			fileConfig,
		);
	}
	deleteFile(bucket, objectId) {
		return axios.delete(
			API_URL + `buckets/${bucket}/objects/${objectId}`,
			config,
		);
	}
}
export default new ApiClient();
