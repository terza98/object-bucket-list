import React, {useState, useEffect} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

//API import
import Service from '../api/auth-service.js'

export default function AllBuckets(props){
    const [countBuckets, updateBucketsCount] = useState(0);
    const [bucketList, loadBucketList] = useState([""]);
    const [isLoaded, setLoad] = useState(false);
    const [error, setError] = useState("");

    // const [bucketNew, setBucket] = useState("");

    const addNewBucket = () => {
        const newBucketList = [...bucketList, props.bucket];
        loadBucketList(newBucketList);
    }

    useEffect(() => {
        // Update the bucket location
        Service.getBucketList()
            .then(
                (result) => {
                    console.log(result.data);
                    setLoad(true);
                    updateBucketsCount(result.data.buckets.length);
                    loadBucketList(result.data.buckets);
                },
                // Note: hanling errors here
                (error) => {
                    setError(error);
                }
            )
    }, [] );
    return(
        isLoaded && (
        <Container className="innerWrapper">
            <Row>
                <Col className="text-left">  
                    <p>{props.title}({countBuckets})</p>              
                </Col>
                <Col className="text-right">
                    {!props.new&&
                        <Button onClick={props.showNewBucket}>Create New Bucket</Button>  
                    }  
                </Col>
            </Row>  
            <Row style={{padding: '2%'}}>
                <Table hover>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Location</th>
                        </tr>
                    </thead>
                    <tbody>
                            {bucketList.map( (item,index) =>
                                <tr key={index} id={item.id}>
                                    <td>{item.name}</td>
                                    {item.location !== undefined &&
                                        <td>{item.location.name}</td>
                                    }   
                                </tr>
                            )}   
                    </tbody>
                </Table>
            </Row>
        </Container>
        )
    );
}