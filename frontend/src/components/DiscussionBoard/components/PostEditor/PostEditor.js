import React from 'react'

import ReactQuill from 'react-quill'
import './editor.css'
import 'react-quill/dist/quill.snow.css'
import { Form, Input, Modal } from 'antd';
import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import MyCustomQuill from '../MyCustomQuill/MyCustomQuill';
import FileUpload from "../FileUpload/FileUpload"

const PostEditor = ({ text, setText, subject, setSubject }) => {
    const handleChange = (newValue) => {
        setText(newValue)
    }

    const handleChangeSubject = e => {
        setSubject(e.target.value)
    };

    const changeAttachement = (value) => {
        console.log(value)
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
                <div className="form-group">
                    <Form.Item><FileUpload changeAttachement={changeAttachement}/></Form.Item>
                </div> 
            </div>
        </Form>
           </div>
}

export default PostEditor