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

class Service{
    //Buckets
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

    
}
export default new Service();
