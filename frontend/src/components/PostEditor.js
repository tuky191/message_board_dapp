import React from 'react'

import ReactQuill from 'react-quill'

import './editor.css'
import 'react-quill/dist/quill.snow.css'
import { Form, Input, Modal } from 'antd';
import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "./DiscussionBoard.css";
import MyCustomQuill from './MyCustomQuill';

const PostEditor = ({ text, setText, subject, setSubject }) => {
    const handleChange = (newValue) => {
        setText(newValue)
    }

    const handleChangeSubject = e => {
        setSubject(e.target.value)
    };
    
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
            </div>
        </Form>
           </div>
}

export default PostEditor