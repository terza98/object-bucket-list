import React, {useState} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

//components
import NewBucket from './NewBucket.js';
import AllBuckets from './AllBuckets.js';
import SingleBucket from './SingleBucket.js';

//API 
import Service from '../api/auth-service.js'

export default function BucketList(props){
    const [newBucket, setNewBucket] = useState(false);
    const [singleBucket, setSingleBucket] = useState(false);
    const [singleBucketName, setSingleBucketName] = useState("");
    const [singleBucketId, setSingleBucketId] = useState("");
    const [error, setError] = useState("");
    const [addedBucket, addNewBucket] = useState({});

    const handleNewBucket = (name, location) => {
        Service.createBucket(name,location).then(
            (result) => {
                console.log(result.data.bucket);
                setNewBucket(!newBucket);
                addNewBucket(result.data.bucket);
            },
            // Note: handling errors here
            (error) => {
                setError(error);
            }
        )
    };
    const showNewBucket = () => {
        setNewBucket(!newBucket);
    }
    const showSingleBucket = (name, id) => {
        setSingleBucket(!singleBucket);
        setSingleBucketName(name);
        setSingleBucketId(id);
    }

    return(
        <>
            <Container>
                {!singleBucket ?
                <>
                    <h5 className="text-left">{props.title}</h5>
                    <NewBucket new={newBucket} showNewBucket={showNewBucket} handleNewBucket={handleNewBucket} title="Create New Bucket"/>
                    <AllBuckets showSingleBucket={showSingleBucket} bucket={addedBucket} new={newBucket} showNewBucket={showNewBucket} handleNewBucket={handleNewBucket} title="All buckets"/>
                </>
                :   <SingleBucket id={singleBucketId} title={singleBucketName} showSingleBucket={singleBucket}/>
                }
            </Container>
        </>
    );
}