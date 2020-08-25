const accessToken = process.env.REACT_APP_TOKEN;
const config = {
    headers: { Authorization: `Bearer ${accessToken}` }
};
const API_URL = process.env.REACT_APP_API_URL;

export default function getBucketLocation(){
    return fetch(API_URL + 'location', config)
    .then(response => response.json())
    .then(data => console.log(data));;
}

  