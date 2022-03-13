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
import MyCustomQuill from './MyCustomQuill';


const ProfileEditor = ({ userProfile, setUserProfile}) => {

    const getRandomElement = (List) => {
        return List[Math.floor(Math.random() * List.length)]
    }
    
    const handles = ["blissfulavocado", "gloomycheddar", "BionicBeaver", "StoicFranklin", "RustyTheCruty", "Juul"];
    const avatars = ["https://bootdey.com/img/Content/avatar/avatar1.png", "https://bootdey.com/img/Content/avatar/avatar2.png", "https://bootdey.com/img/Content/avatar/avatar3.png", "https://bootdey.com/img/Content/avatar/avatar4.png", "https://bootdey.com/img/Content/avatar/avatar5.png", "https://bootdey.com/img/Content/avatar/avatar6.png", "https://bootdey.com/img/Content/avatar/avatar7.png"];
    const bios = ['Too dead to die.', "I’m not always sarcastic. Sometimes, I’m sleeping.", "I prefer my puns intended.", "Just another papercut survivor.", 'Write something about you. What do you like more, cats or dogs? Why dogs?']
    const [placeholder_handle, setPlaceholderHandle] = useState(getRandomElement(handles))
    const [placeholder_avatar] = useState(getRandomElement(avatars))
    const [bio] = useState(userProfile.bio || getRandomElement(bios))


   // useEffect(() => {
   //     (async () => {
   //         if ("handle" in userProfile)) {
              //  setUserProfile((prevState => ({
              //      ...prevState,
             //       handle: placeholder_handle
              //  })))
    //        }; 
     //       }
     //   }

    const changeAvatar = (value) => {
        setUserProfile((prevState => ({
            ...prevState,
            avatar: value
        })))
    };

    const changeHandle = e => {
        setPlaceholderHandle('')
        console.log(e)
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
        
        return <Image src={userProfile.avatar || placeholder_avatar}
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
                    <Form.Item> <Input placeholder={"What's your name?"} onChange={changeHandle} value={userProfile.handle || placeholder_handle}/></Form.Item>
                </div>
                <div className="form-group">
                    <label>Bio:</label>
                    <Form.Item><MyCustomQuill text={bio || ''} setText={changeBio}></MyCustomQuill></Form.Item>
                </div>
            </div>
        </Form>
    </div>
}

export default ProfileEditor