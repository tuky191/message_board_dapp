import React from 'react'
import { useState } from 'react'
import ReactQuill from 'react-quill'
import './editor.css'
import 'react-quill/dist/quill.snow.css'
import { Form, Input, Button, Image } from 'antd';
import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "./DiscussionBoard.css";
import { IPFS } from "./IPFS";




const ProfileEditor = ({ text, setText, subject, setSubject }) => {
    const handleChange = (newValue) => {
        setText(newValue)
    }
 
    const handleChangeSubject = e => {
        setSubject(e.target.value)
    };

    const uploadFile = IPFS();

    const uploadProfilePic = () => {
        const input = document.createElement('input')
        input.setAttribute('type', 'file')
        input.setAttribute('accept', 'image/*')
        input.click()
        input.onchange = async () => {
            const file = input.files[0]
            const res = await uploadFile(file)
            let url = 'https://ipfs.io/ipfs/' + res
            return url
        }
        
    }
    function ImageButton({ src }) {
        return <Button onClick={uploadProfilePic}>
               
                <Image src={src} />
              </Button>
    }

    return <div>
        <Form>
            <div className="modal-body">
                <div className="form-group">
                    <Form.Item> <Input placeholder="What's your name?" onChange={handleChangeSubject} /></Form.Item>
                </div>
                <div className="form-group">
                    <label>Profile Pic:</label>
                    <Form.Item><ImageButton /></Form.Item>
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