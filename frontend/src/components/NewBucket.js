import React, {useState, useEffect} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

//API import
import Service from '../api/auth-service.js'

export default function NewBucket(props){
    const [bucketLocations, loadBucketLocation] = useState([""]);
    const [isLoaded, setLoad] = useState(false);
    const [error, setError] = useState("");
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");

    useEffect(() => {
        // Update the bucket location
        Service.getBucketLocation()
            .then(
                (result) => {
                    setLoad(true);
                    loadBucketLocation(result.data.locations);
                },
                // Note: hanling errors here
                (error) => {
                    setError(error);
                }
            )
    }, [] );

    function handleNameChange(e){
        setName(e.target.value);
    }
    function handleLocationChange(e){
        setLocation(e.target.value);
        console.log(e.target.value);
    }

    return(
        props.new &&
        <>
            <p className="text-left">{props.title}</p>
            <Container className="innerWrapper">
                <Form>
                    <Row>
                        <Col className="text-left">
                            <Form.Label className="required">Bucket Name</Form.Label>
                            <Form.Control onChange={handleNameChange} value={name} placeholder="MyNewStorage" />
                        </Col>
                        <Col className="text-left">
                            <Form.Label className="required">Bucket Location</Form.Label>
                            <Form.Control onChange={handleLocationChange} value={location} as="select">
                                <option value="0">Choose...</option>
                                {bucketLocations.map( (item,index) =>
                                    <option key={index} value={item.id}>{item.name}</option>
                                )}
                            </Form.Control>
                        </Col>
                    </Row>  
                    <Row className="text-left">
                        {props.new&&
                            <Button style={{margin: '15px'}} onClick={() => props.handleNewBucket(name, location)}>Create Bucket</Button>  
                        }   
                    </Row>
                </Form>
            </Container>
        </>
    );
}