import React from 'react'
import { useState, useEffect } from 'react'
import DOMPurify from 'dompurify'
import ReactHtmlParser from 'react-html-parser'
import LikeButton from '../LikeButton/LikeButton'
import styles from './post.module.css'
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import {IPFS} from "../IPFS/IPFS";
const Post = ({ profileImage, owner, time, subject, content, attachment, alias, likes, message_id, thread_id, refreshPosts, showLike}) => {
    const clean = DOMPurify.sanitize(content)
    const clean_subject = DOMPurify.sanitize(subject)
    const [PostlikesCount, setPostLikesCount] = useState(likes.length)
    const { readFile } = IPFS();
    const showLikeButton = () => {
        if (showLike) {
            return (
                <div>
                    <span className=""><LikeButton index={message_id} likes={likes} setPostLikesCount={setPostLikesCount} PostlikesCount={PostlikesCount} refreshPosts={refreshPosts} /></span>
                </div>

            )
        }
    }
    useEffect(() => {
        (async () => {
            setPostLikesCount(PostlikesCount)
      //      console.log(PostlikesCount)
            //refreshPosts()
        })();
           // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [likes]);

    /*
    useEffect(() => {
        refreshPosts()
        console.log(PostlikesCount);
    }, [PostlikesCount])
   */

    const saveFile = (attached_file) => {
        console.log(attached_file)
        //https://ipfs.io/ipfs/QmbEjRgYtzpbUMPDmbeaDguWZyJhP5N77pJijX3HpHUKao
        let send_request = async () => {
            const result = await readFile(attached_file.cid)
            const element = document.createElement("a");
            const file = new Blob([result], { type: "*" });
            element.href = URL.createObjectURL(file);
            element.download = attached_file.filename;
            element.click();
        }
        send_request()
    }

    const showAttachment = (attachment) => {
      //  console.log(attachment)
        if (attachment.len !==0) {
            return attachment.map((attached_file, index) => {
                return (
                    <div>
                        <Button type="primary" shape="round" icon={<DownloadOutlined />} size="small"
                            onClick={() => { saveFile(attached_file) }}
                        >
                            {attached_file.filename}
                        </Button>
                    </div>
                )
            })
        }

    }

    return (
        <>
            <div className="card mb-2">
                <div className="card-body p-2 p-sm-3">
                    <div className="media forum-item">
                        <div><img src={profileImage} className="mr-3 rounded-circle" width="50" alt="User" /></div>
                        <div className="media-body">
                            <a href="\#" data-toggle="collapse" data-target={".forum-content" + thread_id} data-parent={".forum-content" + thread_id} className="text-body"><div className={styles.subject}>{ReactHtmlParser(clean_subject)}</div></a>
                            <span className="text-secondary">
                                        <div className={styles.text}>{ReactHtmlParser(clean)}</div>
                            </span>
                                {showAttachment(attachment)}  
                                <p className="text-muted"><a href="\#" data-toggle="tooltip" title={owner}>{alias}</a> posted <span className="text-secondary font-weight-bold"> {time} ago</span></p>
                                <span className="text-muted"><span className="text-secondary font-weight-bold">
                                <div className="row">
                                    <div className="col-md-6">
                                        {showLikeButton()}
                                    </div>
                                    <div className="col-md-6">
                                        <div className="text-right align-self-center">
                                            <span className="d-none d-sm-inline-block"><i className="fa fa-heart"></i> {PostlikesCount}</span>
                                        </div>
                                    </div>
                                </div>
                               
                            </span>
                        </span>
                        </div>
                        
                    </div>
                </div>
            </div>  
        </>
    )
}

export default Post