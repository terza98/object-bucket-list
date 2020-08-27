import React, {useState, useEffect, useRef} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';

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

    const [formData, setFormData] = useState(null);

    const fileInput = useRef(null);

    const [fileSelected, selectFile] = useState("");

    //modal popup 
    const [show, setShow] = useState(false);
    const [isBucket, setIsBucket] = useState("");
    
    const handleClose = () => setShow(false);
    const handleShow = (prop) => {
        prop==="object"? setIsBucket("object"): setIsBucket("bucket")
        setShow(true);
    }

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
                })
            .catch((error) => {
                setError(error);
                console.log(error);
            })
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

    const uploadFile = (e) => {
        Service.uploadFile(props.id, e.target.files[0])
        .then(
            (result) => {
                console.log(result);
                loadFiles([...filesList, result.data]);
                setError(null);
            })
        .catch((error) => {
            setError(error.message);
            console.log(error.message);
        })
    }
    const handleUpload = () => {
        fileInput.current.click();
    }

    const formatDate = (date) => {
        let newDate = date.split('-').join('.').replace('T', ' at ');
        const index = newDate.indexOf(':')+6;
        newDate = newDate.substring(0, index);
        return newDate;
    }

    const bytesToSize = (bytes) => {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Byte';
        let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
     }

    const totalSize = () => {
        let total = 0;
        filesList.map( (item,index) =>
            total += item.size
        );
        return bytesToSize(total);
    }
    const handleFileSelect = (id) => {
        selectFile(id);
        console.log(id);
    }

    const handleFileDelete = () => {
        Service.deleteFile(props.id, fileSelected)
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
            <h6 className="text-left" id="back" onClick={() => props.showSingleBucket(props.id, props.title)}>← Back</h6>
            <h5 className="text-left">{props.title}</h5>        
            <Row>
                <Col className="text-right">
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Are you sure?</Modal.Title>
                        </Modal.Header>
                            <Modal.Body>Do you really want to delete this {isBucket}?</Modal.Body>
                        <Modal.Footer>
                            <Button className="modal-btn" variant="primary" onClick={isBucket==="object"? handleFileDelete: deleteBucket}>
                                Delete
                            </Button>
                            <Button className="modal-btn" variant="secondary" onClick={handleClose}>
                                Cancel
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    {key==="files" ?
                        <>
                            <Button id="deleteObject" onClick={() => handleShow("object")}>Delete Object</Button>  
                            <Button id="uploadObject" onClick={handleUpload}>Upload Object</Button>
                            <input style={{display: "none"}} ref={fileInput}  type="file" onChange={uploadFile} />
                        </>
                    :
                        <>
                            <Button id="deleteBucket" onClick={() => handleShow("bucket")}>Delete Bucket</Button>  
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
                    {error&&
                        <Alert variant="danger" onClose={() => setError("")} dismissible>
                            {error}
                        </Alert>
                    }
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
                                    <tr onClick={() => handleFileSelect(index)} key={index} id={item.id}>
                                        <td>
                                            <span className="bucket-name">{item.name}</span>
                                        </td>
                                        {item.last_modified!==undefined &&
                                            <td>
                                                {formatDate(item.last_modified)}
                                            </td>
                                        }
                                        <td>{bytesToSize(item.size)}</td>
                                    </tr>
                                )}   
                            </tbody>
                        </Table>
                    </Row>
                </Tab>
                <Tab eventKey="details" title="Details">
                    {details!=="" && details!==null &&
                    <div className="text-left" style={{padding: '2% 4%'}}>
                        <p>Bucket Name: {details.name}</p>
                        <p>Location: {details.location.name}</p>
                        <p>Storage Size: {totalSize()}</p>
                    </div>
                    }
                </Tab>
            </Tabs>
        </Container>
        )
    );
}