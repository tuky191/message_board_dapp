import React from 'react'
import { useState } from 'react'
import ReactQuill from 'react-quill'
import './editor.css'
import 'react-quill/dist/quill.snow.css'
import { Form, Input, Modal } from 'antd';
import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "./DiscussionBoard.css";
const ProfileEditor = ({ text, setText, subject, setSubject }) => {
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
                    <label>How do you call yourself:</label>
                    <Form.Item> <Input onChange={handleChangeSubject} /></Form.Item>
                </div>
                <div className="form-group">
                    <label>Profile Pic:</label>
                    <Form.Item><button /></Form.Item>
                </div>
                <div className="form-group">
                    <div className="custom-file form-control-sm mt-3" >
                        <input type="file" className="custom-file-input" id="customFile" multiple="" />
                        <label className="custom-file-label" htmlFor="customFile">Attachment</label>
                    </div>
                </div>
            </div>
        </Form>
    </div>
}

export default ProfileEditor