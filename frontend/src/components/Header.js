import React from 'react';
import Navbar from 'react-bootstrap/Navbar'

export default function Header(props){
    return(
        <>
            <Navbar id="navbar" bg="dark" variant="dark">
                <Navbar.Brand href="#home">
                    {props.title}
                </Navbar.Brand>
            </Navbar>
        </>
    );
}