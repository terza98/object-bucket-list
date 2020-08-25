import React, {useState, useEffect} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

//API import
import getBucketLocation from '../api/auth-service.js'

export default function NewBucket(props){
    const [bucketLocations, loadBucketLocation] = useState([""]);
    const [isLoaded, setLoad] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        // Update the bucket location
        getBucketLocation()
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);
                    setLoad(true);
                    loadBucketLocation(result.items);
                },
                // Note: hanling errors here
                (error) => {
                    setError(error);
                }
            )
    });
    return(
        props.new&&
        <>
            <p className="text-left">{props.title}</p>
            <Container className="innerWrapper">
                <Form>
                    <Row>
                        <Col className="text-left">
                            <Form.Label className="required">Bucket Name</Form.Label>
                            <Form.Control placeholder="MyNewStorage" />
                        </Col>
                        <Col className="text-left">
                            <Form.Label className="required">Bucket Location</Form.Label>
                            <Form.Control as="select">
                                <option value="0">Choose...</option>
                                {bucketLocations.map( (item,index) =>
                                    <option key={index} value={index}>{item}</option>
                                )}
                            </Form.Control>
                        </Col>
                    </Row>  
                    <Row className="text-left">
                        {props.new&&
                            <Button style={{margin: '15px'}} onClick={props.handleNewBucket}>Create Bucket</Button>  
                        }   
                    </Row>
                </Form>
            </Container>
        </>
    );
}