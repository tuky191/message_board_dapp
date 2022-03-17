import React, { useState, useEffect } from 'react'

import PropTypes from 'prop-types'
import Post from './components/Post/Post'
import ThreadTitle from './components/ThreadTitle/ThreadTitle'
import Profile from './components/Profile/Profile'
import PostEditor from './components/PostEditor/PostEditor'
import ProfileEditor from './components/ProfileEditor/ProfileEditor'
import { Modal } from 'antd';
import "./DiscussionBoard.css";
import Paginator from "./components/Paginator/Paginator"
//import DisconnectWallet from "../TerraWallet/DisconnectWallet"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const DiscussionBoard = ({ onSubmit, threads, showNewUserPopUP, userProfile, setUserProfile, forumMessage, setForumMessage, refreshPosts, userProfiles}) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(showNewUserPopUP);
    const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
    const [currentVisibleProfile, setCurrentVisibleProfile] = useState({});
    const [items, setItems] = useState([])

    const activateMessageDialog = (value) => {
        setForumMessage((prevState => ({
            ...prevState,
            thread_id: value
        })))
        showModal()

    }
    const showModal = () => {
        setIsModalVisible(true);
    };

    const showModalSettings = () => {
        setIsSettingsModalVisible(true);
    };

    const showModalProfile = (userProfile) => {
        setCurrentVisibleProfile(userProfile);
        setIsProfileModalVisible(true);
    };

    const generateItems = () => {
        
        return threads.map((thread, idx) => {
            const newTime = timeSince(thread.created);
            const thread_id = thread.thread_id
            return (
                <React.Fragment key={idx}>
                    <div id={"myGroup" + thread_id} className="container" >
                        <div className={"inner-main-body p-2 p-sm-3 collapse forum-content" + thread_id + " show"} data-parent={"myGroup" + thread_id}>
                            <ThreadTitle {...thread.related_messages[0]} time={newTime} thread_id={thread_id}  />
                            </div>
                            <div className={"inner-main-body p-2 p-sm-3 collapse forum-content" + thread_id}>
                                <a href="/#" className="btn btn-light btn-sm mb-3 has-icon" data-toggle="collapse" data-target={".forum-content" + thread_id} data-parent={"myGroup" + thread_id}><i className="fa fa-arrow-left mr-2"></i>Back</a>
                                {thread.related_messages.map((post, index) => {
                                    const timePost = timeSince(post.created);
                                    return (
                                        <div>
                                            <Post {...post} time={timePost} thread_id={thread_id} refreshPosts={refreshPosts} showLike={true} />
                                        </div>
                                    )
                                })}
                                <button className="btn btn-primary has-icon btn-block" type="button" data-toggle="modal" data-target="#threadModal" onClick={() => activateMessageDialog(thread_id)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus mr-2">
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                </button>
                            </div>
                    </div>
                </React.Fragment>
            );
        })
    }

    useEffect(() => {
        setIsSettingsModalVisible(showNewUserPopUP)
        setItems(generateItems())
           // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [threads])


    const timeSince = (date) => {
        if (typeof date !== 'object') {
            date = new Date(Number(date));
        }
        var seconds = Math.floor((new Date() - date) / 1000);
        var intervalType;

        var interval = Math.floor(seconds / 31536000);
        if (interval >= 1) {
            intervalType = 'year';
        } else {
            interval = Math.floor(seconds / 2592000);
            if (interval >= 1) {
                intervalType = 'month';
            } else {
                interval = Math.floor(seconds / 86400);
                if (interval >= 1) {
                    intervalType = 'day';
                } else {
                    interval = Math.floor(seconds / 3600);
                    if (interval >= 1) {
                        intervalType = "hour";
                    } else {
                        interval = Math.floor(seconds / 60);
                        if (interval >= 1) {
                            intervalType = "minute";
                        } else {
                            interval = seconds;
                            intervalType = "second";
                        }
                    }
                }
            }
        }

        if (interval > 1 || interval === 0) {
            intervalType += 's';
        }

        return interval + ' ' + intervalType;
    };

    const submitPost = (e) => {
        forumMessage['method'] = 'submitPost'
        onSubmit(forumMessage)
        setForumMessage({ content: '', subject: '', attachment: [] })
        setIsModalVisible(false)
    }
    const submitSettings = () => {
        userProfile['method'] = 'submitProfile'
        onSubmit(userProfile)
        setIsSettingsModalVisible(false)
    }

    return (
    <><div>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.0-2/css/all.min.css" integrity="sha256-46r060N2LrChLLb5zowXQ72/iKKNiw/lAmygmHExk/o=" crossOrigin="anonymous" />
            <div>
                <div className="main-body p-0">
                    <div className="inner-wrapper">
                        <div className="inner-sidebar">
                            <div className="inner-sidebar-header justify-content-center">
                                <button className="btn btn-primary has-icon btn-block" type="button" data-toggle="modal" data-target="#threadModal" onClick={() => activateMessageDialog(null)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus mr-2">
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                    NEW DISCUSSION
                                </button>
                            </div>
                            <div className="inner-sidebar-body p-0">
                                <div className="row clearfix">
                                    <div className="col-lg-12">
                                        <div className="chat-app">
                                            <div id="plist" className="people-list">
                                                <ul className="list-unstyled chat-list mt-2 mb-0">
                                                    {
                                                        userProfiles.map((userProfile, index) => {
                                                            return (
                                                                
                                                                <div>
                                                                    <div>
                                                                        <a href="/#" onClick={() => showModalProfile(userProfile)}> <li className="clearfix">
                                                                            <img src={userProfile.avatar} className="mr-3 rounded-circle" width="50" alt="User" />
                                                                            <div className="about">
                                                                                <div className="name">{userProfile.handle}</div>
                                                                                <div className="status"> <i className="fa fa-circle online"></i> online </div>
                                                                            </div>
                                                                        </li></a>
                                                                    </div>
                                                                </div>                                                                
                                                            )
                                                        })
                                                    }
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="inner-main">
                            <div className="inner-main-header">
                                <a href="/#" onClick={() => showModalSettings()} ><img src={userProfile.avatar} className="mr-3 rounded-circle" width="50" alt="User" /></a>
                                <span>{userProfile.handle}</span>
                               { /*
                               Commenting out for now, backend contract has search implemented, will update later on
                                <span className="input-icon input-icon-sm ml-auto w-auto">
                                    <input type="text" className={"form-control form-control-sm bg-gray-200 border-gray-200 shadow-none mb-4 mt-4"} placeholder="Search forum" />
                                </span>
                               */}
                            </div>
                            <div className="container">
                                <Paginator itemsPerPage={4} items={items} />

                            </div>
                        </div>
                    </div>
                    <div>
                        {(isModalVisible) ? 
                            <Modal
                                visible={isModalVisible}
                                onCancel={() => {
                                    setIsModalVisible(false);
                                }}
                                className='modal-dialog modal-lg'
                                title='Say something nice'
                                footer={[
                                    <div className='row pt-2'>
                                        <div className='col'>
                                            <button onClick={submitPost} className='btn btn-primary'>
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                ]}>
                                <div>
                                    <PostEditor setForumMessage={setForumMessage} />
                                </div>
                        </Modal> : null}
                                             
                    </div>
                    <div>
                        <Modal
                            visible={isSettingsModalVisible}
                            onCancel={() => {
                                setIsSettingsModalVisible(false);
                            }}
                            className='modal-dialog modal-lg'
                            title='Profile'
                            footer={[
                                <div className='row pt-2'>
                                    <div className='col'>
                                        <button onClick={submitSettings} className='btn btn-primary'>
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            ]}>
                            <div>
                                <ProfileEditor userProfile={userProfile} setUserProfile={setUserProfile}  />
                            </div>
                        </Modal>
                    </div>
                    <div>
                        <Modal
                            visible={isProfileModalVisible}
                            onCancel={() => {
                                setIsProfileModalVisible(false);
                            }}
                            className='modal-dialog modal-lg'
                            footer={[
                                <div>
                                </div>
                            ]}>
                            
                            <div>
                                <Profile profile={currentVisibleProfile}/>
                            </div>
                        </Modal>
                    </div>
                </div>
            </div>
                </div>
            <></>
        </>
    )
}

DiscussionBoard.defaultProps = {
    posts: [],
    threads: []
}

DiscussionBoard.propTypes = {
    posts: PropTypes.array,
    threads: PropTypes.array,
    onSubmit: PropTypes.func
}


export default DiscussionBoard