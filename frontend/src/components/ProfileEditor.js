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


const ProfileEditor = ({ nickname, setNickname, profile_picture, setProfilePicture}) => {
    

    const handleChangeProfilePicture = (newValue) => {
        setProfilePicture(newValue)
    };

    const handleChange = e => {
        setNickname(e.target.value)
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
            handleChangeProfilePicture(url)
        }
        
    }
    function ImageButton({ src }) {
        
        return <Image src={profile_picture}
            width={100}
            height={100}
            className={"rounded-circle"}
            preview={{
                visible: false,
            }
            }
            onClick={uploadProfilePic}
            alt="User"
        />

    }
    return <div>
        <Form>
            <div className="modal-body">
                <div className="form-group">
                    <Form.Item> <Input placeholder={"What's your name? It was " + nickname + ", just the other day."} onChange={handleChange} /></Form.Item>
                </div>
                <div className="form-group">
                    <Form.Item><ImageButton /></Form.Item>
                </div>
            </div>
        </Form>
    </div>
}

export default ProfileEditor