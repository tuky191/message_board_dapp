import React from 'react'
import { useState, useEffect, Accordion  } from 'react'
import DOMPurify from 'dompurify'
import ReactHtmlParser from 'react-html-parser'
import LikeButton from '../LikeButton/LikeButton'
import styles from './post.module.css'

const Post = ({ profileImage, owner, time, subject, content, attachment, alias, likes, message_id, thread_id, refreshPosts, showLike}) => {
    const clean = DOMPurify.sanitize(content)
    const clean_subject = DOMPurify.sanitize(subject)
    const [PostlikesCount, setPostLikesCount] = useState(likes.length)

    const showLikeButton = () => {
        console.log(showLike)
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
            console.log(PostlikesCount)
            //refreshPosts()
        })();
    }, []);

    /*
    useEffect(() => {
        refreshPosts()
        console.log(PostlikesCount);
    }, [PostlikesCount])
   */
    return (
        <>
            <div className="card mb-2">
                <div className="card-body p-2 p-sm-3">
                    <div className="media forum-item">
                        <div><img src={profileImage} className="mr-3 rounded-circle" width="50" alt="User" /></div>
                        <div className="media-body">
                            <a href="#" data-toggle="collapse" data-target={".forum-content" + thread_id} data-parent={".forum-content" + thread_id} className="text-body"><div className={styles.subject}>{ReactHtmlParser(clean_subject)}</div></a>
                            <span className="text-secondary">
                                    <div className="container">
                                        <div className={styles.text}>{ReactHtmlParser(clean)}</div>
                                    </div>
                            </span>
                                <p className="text-muted"><a href="" data-toggle="tooltip" title={owner}>{alias}</a> posted <span className="text-secondary font-weight-bold"> {time} ago</span></p>
                                <span className="text-muted"><span className="text-secondary font-weight-bold">
                                {showLikeButton()}
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