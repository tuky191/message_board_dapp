import React from 'react'

import DOMPurify from 'dompurify'
import ReactHtmlParser from 'react-html-parser'
import Avatar from 'react-avatar'
import 'bootstrap/dist/css/bootstrap.min.css';

import styles from './post.module.css'
import LikeButton from './LikeButton'

const Post = ({ profileImage, owner, time, subject, content, date }) => {
    const clean = DOMPurify.sanitize(content)
    const clean_subject = DOMPurify.sanitize(subject)
    return (

        <>
        <div className="card mb-2">
            <div className="card-body p-2 p-sm-3">
                <div className="media forum-item">
                        <a href="#" data-toggle="collapse" data-target=".forum-content"><img src={profileImage} className="mr-3 rounded-circle" width="50" alt="User" /></a>
                    <div className="media-body">
                            <a href="#" data-toggle="collapse" data-target=".forum-content" className="text-body"><div className={styles.subject}>{ReactHtmlParser(clean_subject)}</div></a>
                        <span className="text-secondary">
                                <div className={styles.text}>{ReactHtmlParser(clean)}</div>
                        </span>
                            <p className="text-muted"><a href="">{owner}</a> posted on <span className="text-secondary font-weight-bold">{date} {time}</span></p>
                        <span className="text-muted"><span className="text-secondary font-weight-bold">
                                <span className=""><LikeButton /></span>

                        </span></span>
                    </div>
                    <div className="text-muted small text-center align-self-center">
                        <span className="d-none d-sm-inline-block"><i className="fa fa-heart"></i> 19</span>
                    </div>
                </div>
            </div>
        </div>       
        </>
    )
}

export default Post