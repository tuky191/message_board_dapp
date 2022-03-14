import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './index.css';
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { IPFS } from "../IPFS/IPFS";

const FileUpload = ({ changeAttachement}) => {

    const { Dragger } = Upload;
    const uploadFile = IPFS();

    const uploadAttachement = ({
            file,
            onSuccess,
            onError
        }) => {
        let send_request = async () => {
            const res = await uploadFile(file)
            let url = 'https://ipfs.io/ipfs/' + res
            if (res) {
                onSuccess({url: url})
            } else {
                onError({url: ''})
            }
        }
        send_request()
    }    
    const props = {
        name: 'file',
        multiple: false,
        showUploadList: {
            showRemoveIcon: false
        },
        customRequest: uploadAttachement,
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
            }
            if (status === 'done') {
                changeAttachement(info.file.response.url)
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
                changeAttachement(info.file.response.url)
            } else if (status === 'removed') {
                changeAttachement('')
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        }
    };

    return (
        <Dragger {...props}>
            <p className="ant-upload-drag-icon">
            <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
                Do not upload any sensitive data as they will live forever in the cloud.
            </p>
        </Dragger>
    )
}

export default FileUpload