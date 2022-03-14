import React from 'react'
import './editor.css'
import 'react-quill/dist/quill.snow.css'
import { Form, Input, Button, Image } from 'antd';
import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
//import "./DiscussionBoard.css";
import { IPFS } from "../IPFS/IPFS";
import MyCustomQuill from '../MyCustomQuill/MyCustomQuill';


const ProfileEditor = ({ userProfile, setUserProfile}) => {

    const changeAvatar = (value) => {
        setUserProfile((prevState => ({
            ...prevState,
            avatar: value
        })))
    };

    const changeHandle = e => {
        setUserProfile((prevState => ({
            ...prevState,
            handle: e.target.value
        })))
    };

    const changeBio = (value) => {
        setUserProfile((prevState => ({
            ...prevState,
            bio: value
        })))
    }

    const uploadFile = IPFS();

    const uploadAvatar = () => {
        const input = document.createElement('input')
        input.setAttribute('type', 'file')
        input.setAttribute('accept', 'image/*')
        input.click()
        input.onchange = async () => {
            const file = input.files[0]
            const res = await uploadFile(file)
            let url = 'https://ipfs.io/ipfs/' + res
            changeAvatar(url)
        }
        
    }
    function ImageButton({ src }) {
        
        return <Image src={userProfile.avatar}
            width={100}
            height={100}
            className={"rounded-circle"}
            preview={{
                visible: false,
            }
            }
            onClick={uploadAvatar}
            alt="User"
        />

    }
    return <div>
        <Form>
            <div className="modal-body">
                <div className="form-group">
                    <Form.Item><ImageButton /></Form.Item>
                </div>
                <div className="form-group">
                    <Form.Item> <Input placeholder={"What's your name?"} onChange={changeHandle} value={userProfile.handle}/></Form.Item>
                </div>
                <div className="form-group">
                    <label>Bio:</label>
                    <Form.Item><MyCustomQuill text={userProfile.bio || ''} setText={changeBio}></MyCustomQuill></Form.Item>
                </div>
            </div>
        </Form>
    </div>
}

export default ProfileEditor