import React, {useState} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

export default function AllBuckets(props){
    const [countBuckets, updateBucketsCount] = useState(0);
    return(
        <Container className="innerWrapper">
            <Row>
                <Col className="text-left">  
                    <p>{props.title}({countBuckets})</p>              
                </Col>
                <Col className="text-right">
                    {!props.new&&
                        <Button onClick={props.handleNewBucket}>Create New Bucket</Button>  
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
                        <tr>
                            <td>Best Storage</td>
                            <td>Pics</td>
                        </tr>
                        <tr>
                            <td>Kranj</td>
                            <td colSpan="2">Ljubljana</td>
                        </tr>
                    </tbody>
                </Table>
            </Row>
        </Container>
    );
}