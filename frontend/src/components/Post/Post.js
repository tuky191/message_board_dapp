import React from 'react'
import { useState, useEffect } from 'react'
import DOMPurify from 'dompurify'
import ReactHtmlParser from 'react-html-parser'
import Avatar from 'react-avatar'
import 'bootstrap/dist/css/bootstrap.min.css';

import styles from './post.module.css'
import LikeButton from '../LikeButton/LikeButton'

const Post = ({ profileImage, owner, time, subject, content, image, alias, likes, index }) => {
    const clean = DOMPurify.sanitize(content)
    const clean_subject = DOMPurify.sanitize(subject)
    const [PostlikesCount, setPostLikesCount] = useState(likes.length)

    
    useEffect(() => {
        (async () => {
            setPostLikesCount(PostlikesCount)
        })();
    }, []);
    
    return (
        <>
        <div className="card mb-2">
            <div className="card-body p-2 p-sm-3">
                <div className="media forum-item">
                        <a href="#" data-toggle="collapse" data-target=".forum-content"><img src={profileImage} className="mr-3 rounded-circle" width="50" alt="User" /></a>
                    <div className="media-body">
                            <a href="#" data-toggle="collapse" data-target=".forum-content" className="text-body"><div className={styles.subject}>{ReactHtmlParser(clean_subject)}</div></a>
                        <span className="text-secondary">
                                <div className="container">
                                    <div className={styles.text}>{ReactHtmlParser(clean)}</div>
                                </div>
                        </span>
                            <p className="text-muted"><a href="" data-toggle="tooltip" title={owner}>{alias}</a> posted <span className="text-secondary font-weight-bold"> {time} ago</span></p>
                        <span className="text-muted"><span className="text-secondary font-weight-bold">
                                <span className=""><LikeButton index={index} likes={likes} setPostLikesCount={setPostLikesCount} PostlikesCount={PostlikesCount} /></span>

                        </span></span>
                    </div>
                    <div className="text-muted small text-center align-self-center">
                            <span className="d-none d-sm-inline-block"><i className="fa fa-heart"></i> {PostlikesCount}</span>
                    </div>
                </div>
            </div>
        </div>       
        </>
    )
}

export default Post