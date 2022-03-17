import React from 'react';
import 'antd/dist/antd.css';
import './index.css';
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { IPFS } from "../IPFS/IPFS";

const FileUpload = ({ changeAttachment}) => {

    const { Dragger } = Upload;
    const {uploadFile} = IPFS();

    const uploadAttachment = ({
            file,
            onSuccess,
            onError
        }) => {
        let send_request = async () => {
            const cid = await uploadFile(file)
            if (cid) {
                onSuccess({cid: cid, filename: file.name})
            } else {
                onError({cid: '',
                         filename: file.name})
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
        customRequest: uploadAttachment,
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
            }
            if (status === 'done') {
                changeAttachment({ cid: info.file.response.cid, filename: info.file.name})
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
                changeAttachment(info.file.response.url)
            } else if (status === 'removed') {
                changeAttachment('')
            }
        },
        onDrop(e) {
        //    console.log('Dropped files', e.dataTransfer.files);
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