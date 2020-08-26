import React, {useState, useEffect} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

//API import
import Service from '../api/auth-service.js'

export default function SingleBucket(props){
    //files
    const [countFiles, updateFilesCount] = useState(0);
    const [filesList, loadFiles] = useState([""]);

    const [isLoaded, setLoad] = useState(false);
    const [error, setError] = useState("");

    const [key, setKey] = useState('files');

    //details
    const [details, setDetails] = useState("");

    useEffect(() => {
        // Update files in bucket
        Service.getObjectsList(props.id)
            .then(
                (result) => {
                    console.log(result.data);
                    setLoad(true);
                    updateFilesCount(result.data.objects.length);
                    loadFiles(result.data.objects);
                },
                // Note: hanling errors here
                (error) => {
                    setError(error);
                }
            )
        //get bucket details
        Service.getSingleBucket(props.id)
            .then(
                (result) => {
                    console.log(result.data.bucket);
                    setLoad(true);
                    setDetails(result.data.bucket);
                },
                // Note: hanling errors here
                (error) => {
                    setError(error);
                }
            )
    }, [] );

    const deleteBucket = () => {
        Service.deleteBucket(props.id)
            .then(
                (result) => {
                    console.log(result);
                },
                (error) => {
                    setError(error);
                }
            )
    }
    return(
        isLoaded && (
        <Container className="innerWrapper">
            <h5 className="text-left">{props.title}</h5>        
            <Row>
                <Col className="text-right">
                    {key==="files" ?
                        <>
                            <Button onClick={props.showNewBucket}>Delete Object</Button>  
                            <Button onClick={props.showNewBucket}>Upload Object</Button>  
                        </>
                    :
                        <>
                            <Button onClick={deleteBucket}>Delete Bucket</Button>  
                        </>
                    } 
                </Col>
            </Row>  
            <Tabs
            id="controlled-tab-example"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            >
                <Tab eventKey="files" title="Files">
                    <Row style={{padding: '2%'}}>
                        <p>All files ({countFiles})</p>
                        <Table hover>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Last modified</th>
                                    <th>Size</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filesList.map( (item,index) =>
                                    <tr key={index} id={item.id}>
                                        <td>
                                            <span className="bucket-name">{item.name}</span>
                                        </td>
                                        <td>{item.modified}</td>
                                        <td>{item.size}</td>
                                    </tr>
                                )}   
                            </tbody>
                        </Table>
                    </Row>
                </Tab>
                <Tab eventKey="details" title="Bucket details">
                    {details!=="" && details!==null &&
                    <div className="text-left">
                        <p>Bucket Name: {details.name}</p>
                        <p>Location: {details.location.name}</p>
                    </div>
                    }
                </Tab>
            </Tabs>
        </Container>
        )
    );
}