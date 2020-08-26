import 'dotenv/config.js';
const axios = require('axios');
const accessToken = 'f4ca4366-d77a-419e-9f1f-b27b8360f32f';
const API_URL = 'https://challenge.3fs.si/storage/';
const config = {
    headers: { 
        'Authorization': `Token ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};
const fileConfig = {
    headers: { 
        'Authorization': `Token ${accessToken}`,
        'content-type': 'multipart/form-data',
        'Accept': 'multipart/form-data'
    }
};

class Service{
    getBucketLocation(){
        return axios.get(API_URL + 'locations', config);
    }
    getBucketList(){
        return axios.get(API_URL + 'buckets', config);
    }
    createBucket(name, location){
        return axios.post(API_URL + 'buckets', 
            {name, location}, config);
    }
    getSingleBucket(bucket){
        return axios.get(API_URL + `buckets/${bucket}`, config);
    }
    deleteBucket(bucket){
        return axios.delete(API_URL + `buckets/${bucket}`, config);
    }
    getObjectsList(bucket){
        return axios.get(API_URL + `buckets/${bucket}/objects`, config);
    }
    uploadFile(bucket, file){
        const formData = new FormData();
        formData.append('file',file)
        
        return axios.post(API_URL + `buckets/${bucket}/objects`, formData, fileConfig);
    }
    deleteFile(bucket, objectId){
        return axios.delete(API_URL + `buckets/${bucket}/objects/${objectId}`, config);
    }
}
export default new Service();
