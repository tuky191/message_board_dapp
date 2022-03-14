import React from 'react'

import ReactQuill from 'react-quill'
import './editor.css'
import 'react-quill/dist/quill.snow.css'
import { Form, Input, Modal } from 'antd';
import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import MyCustomQuill from '../MyCustomQuill/MyCustomQuill';
import { IPFS } from "../IPFS/IPFS";
//import FileUpload from "./FileUpload"

const PostEditor = ({ text, setText, subject, setSubject }) => {
    const handleChange = (newValue) => {
        setText(newValue)
    }

    const handleChangeSubject = e => {
        setSubject(e.target.value)
    };

    const changeAttachement = (value) => {

    }
    const uploadFile = IPFS();

    const uploadAttachement = () => {
        const input = document.createElement('input')
        input.setAttribute('type', 'file')
        input.setAttribute('accept', '*')
        input.click()
        input.onchange = async () => {
            const file = input.files[0]
            const res = await uploadFile(file)
            let url = 'https://ipfs.io/ipfs/' + res
            changeAttachement(url)
        }

    }    
    
    return <div>
        <Form>
            <div className="modal-body">
                <div className="form-group">
                    <label>Title:</label>
                    <Form.Item> <Input onChange={handleChangeSubject} /></Form.Item>
                </div>
                <div className="form-group">
                    <label>Message:</label>
                        <Form.Item><MyCustomQuill value={text || ''} setText={setText}></MyCustomQuill></Form.Item>
                </div>
                <div className={"custom-file form-control-sm mt-3"} style={{maxWidth: "300px"}}>
                   
                </div>  
            </div>
        </Form>
           </div>
}

export default PostEditor