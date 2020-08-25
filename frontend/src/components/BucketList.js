import React, {useState} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

//components
import NewBucket from './NewBucket.js';
import AllBuckets from './AllBuckets.js';

//API 
import Service from './Service.js';

export default function BucketList(props){
    const [newBucket, setNewBucket] = useState(false);
    const handleNewBucket = () => {
        setNewBucket(!newBucket);
    };
    return(
        <>
            <Container>
                <h5 className="text-left">{props.title}</h5>
                <NewBucket new={newBucket} handleNewBucket={() => handleNewBucket()} title="Create New Bucket"/>
                <AllBuckets new={newBucket} handleNewBucket={() => handleNewBucket()} title="All buckets"/>
            </Container>
        </>
    );
}