import React from 'react'

import ReactQuill from 'react-quill'

import './editor.css'
import 'react-quill/dist/quill.snow.css'
import { Form, Input, Modal } from 'antd';
import 'antd/dist/antd.css';

const PostEditor = ({ text, setText, subject, setSubject }) => {
    const handleChange = (newValue) => {
        setText(newValue)
    }

    const handleChangeSubject = e => {
        setSubject(e.target.value)
    };
    return <div>
                <Form>
                    <Form.Item  label="subject"
                                name="subject"
                                rules={[{ required: true, message: 'Write something nice' }]}
                    >
                    <Input onChange={handleChangeSubject}  
                    />
                    </Form.Item>
                    <Form.Item label="content">
                        <ReactQuill value={text} onChange={handleChange} />
                    </Form.Item>
                </Form>
           </div>
}

export default PostEditor