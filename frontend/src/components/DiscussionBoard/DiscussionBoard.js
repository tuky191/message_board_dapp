import React, { useState, useEffect, Accordion } from 'react'

import PropTypes from 'prop-types'
import ReactPaginate from 'react-paginate'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Post from './components/Post/Post'
import PostEditor from './components/PostEditor/PostEditor'
import ProfileEditor from './components/ProfileEditor/ProfileEditor'
import { Modal } from 'antd';
import "./DiscussionBoard.css";

const DiscussionBoard = ({ onSubmit, posts, threads,showNewUserPopUP, userProfile, setUserProfile, setForumMessage }) => {
    const [text, setText] = useState('')
    const [subject, setSubject] = useState('')
 
   
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(showNewUserPopUP);
    
    const perPage = 100
    const [pageCount, setPageCount] = useState(0)
    const [pageThreads, setPageThreads] = useState([])
    const [currentPage, setCurrentPage] = useState(0)
    useEffect(() => {
        setIsSettingsModalVisible(showNewUserPopUP)
        
        setPageCount(Math.ceil(threads.length / perPage))

        if (threads.length % perPage !== 0 && threads.length > perPage) {
            setPageThreads(
                threads.slice(
                    threads.length - (threads.length % perPage) - 1,
                    threads.length - 1
                )
            )
            setCurrentPage(pageCount - 1)
        } else if (threads.length % perPage === 0 && threads.length > perPage) {
            setPageThreads(threads.slice(threads.length - perPage, threads.length))
            setCurrentPage(pageCount)
        } else {
            setPageThreads(threads.slice(0, perPage))
            setCurrentPage(0)
        }

        return () => {
            setPageThreads([])
        }
    }, [threads])

    const showModal = () => {
        setIsModalVisible(true);
    };

    const showModalSettings = () => {
        setIsSettingsModalVisible(true);
    };

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

    const submitPost = () => {
        onSubmit({
            subject: subject,
            content: text,
            method: 'submitPost'
        })
        setText('')
        setSubject('')
        setIsModalVisible(false)
    }
    const submitSettings = () => {
        userProfile['method'] = 'submitProfile'
        onSubmit(userProfile)
        setIsSettingsModalVisible(false)
    }


    const onPageChange = ({ selected }) => {
        let offset = Math.ceil(selected * perPage)
        setPageThreads(threads.slice(offset, offset + perPage))
        setCurrentPage(selected)
    }

    return (
    <><div>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.0-2/css/all.min.css" integrity="sha256-46r060N2LrChLLb5zowXQ72/iKKNiw/lAmygmHExk/o=" crossOrigin="anonymous" />
            <div className="container">
                <div className="main-body p-0">
                    <div className="inner-wrapper">
                        <div className="inner-sidebar">
                            <div className="inner-sidebar-header justify-content-center">
                                <button className="btn btn-primary has-icon btn-block" type="button" data-toggle="modal" data-target="#threadModal" onClick={showModal}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus mr-2">
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                    NEW DISCUSSION
                                </button>
                            </div>
                            <div className="inner-sidebar-header justify-content-center">
                                <button className="btn btn-primary has-icon btn-block" type="button" data-toggle="modal" data-target="#threadModal" onClick={showModalSettings}>
                                    <div> <i className="fa fa-cog" style={{position: 'relative', left: '-7px' }}></i> UPDATE PROFILE</div>
                                    
                                </button>
                            </div>
                            <div className="inner-sidebar-body p-0">
                                <div className="p-3 h-100" data-simplebar="init">
                                    <div className="simplebar-wrapper" style={{ margin: '-16px' }}> 
                                        <div className="simplebar-height-auto-observer-wrapper"><div className="simplebar-height-auto-observer"></div></div>
                                        <div className="simplebar-mask">
                                            <div className="simplebar-offset" style={{ right: '0px', bottom: '0px' }}>
                                                <div className="simplebar-content-wrapper" style={{ height: '100%', overflow: 'hidden scroll' }}>
                                                    <div className="simplebar-content" style={{ padding: '16px' }}>
                                                        <nav className="nav nav-pills nav-gap-y-1 flex-column">
                                                            <a className="nav-link nav-link-faded has-icon active">All Threads</a>
                                                            <a className="nav-link nav-link-faded has-icon">Popular this week</a>
                                                            <a className="nav-link nav-link-faded has-icon">Popular all time</a>
                                                            <a className="nav-link nav-link-faded has-icon">Solved</a>
                                                            <a className="nav-link nav-link-faded has-icon">Unsolved</a>
                                                            <a className="nav-link nav-link-faded has-icon">No replies yet</a>
                                                        </nav>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="simplebar-placeholder" style={{ width: '234px', height: '292px'}} ></div>
                                    </div>
                                    <div className="simplebar-track simplebar-horizontal" style={{ visibility: 'hidden' }}><div className="simplebar-scrollbar" style={{ width: '0px', display: 'none'  }}></div></div>
                                    <div className="simplebar-track simplebar-vertical" style={{ visibility: 'visible' }}><div className="simplebar-scrollbar" style={{ height: '151px', block: 'none', transform: 'translate3d(0px, 0px, 0px)' }}></div></div>
                                </div>
                            </div>
                        </div>

                        <div className="inner-main">
                            <div className="inner-main-header">
                                <a className="nav-link nav-icon rounded-circle nav-link-faded mr-3 d-md-none" href="#" data-toggle="inner-sidebar"><i className="material-icons">arrow_forward_ios</i></a>
                                <select className="custom-select custom-select-sm w-auto mr-1">
                                    <option defaultValue="">Latest</option>
                                    <option value="1">Popular</option>
                                    <option value="3">Solved</option>
                                    <option value="3">Unsolved</option>
                                    <option value="3">No Replies Yet</option>
                                </select>
                                <span className="input-icon input-icon-sm ml-auto w-auto">
                                    <input type="text" className="form-control form-control-sm bg-gray-200 border-gray-200 shadow-none mb-4 mt-4" placeholder="Search forum" />
                                </span>
                            </div>
                            <div>
                                {pageThreads.map((thread, idx) => {
                                    const newTime = timeSince(thread.created);
                                    const thread_id = thread.thread_id 
                                    console.log(newTime)
                                    return (
                                        <React.Fragment key={idx}>
                                            <div id={"myGroup" + thread_id} class="container">
                                                <div class="panel">
                                                    <div className={"inner-main-body p-2 p-sm-3 collapse forum-content" + thread_id + " show"} data-parent={"myGroup" + thread_id}>
                                                        <Post {...thread.related_messages[0]} time={newTime} thread_id={thread_id}/>
                                                    </div>
                                                <div className={"inner-main-body p-2 p-sm-3 collapse forum-content" + thread_id}>
                                                        <a href="#" className="btn btn-light btn-sm mb-3 has-icon" data-toggle="collapse" data-target={".forum-content" + thread_id} data-parent={"myGroup" + thread_id}><i className="fa fa-arrow-left mr-2"></i>Back</a>
                                                        {thread.related_messages.map((post, index) => {
                                                            const timePost = timeSince(post.created);
                                                            return (
                                                                <div>
                                                                    <Post {...post} time={timePost} thread_id={thread_id} />
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                                <hr className={`mt-0`} />
                                            </div>
                                        </React.Fragment>   
                                    );
                                })}

                          
                                
                                <div className='pagination pagination-sm pagination-circle justify-content-center mb-0'>
                                    <ReactPaginate
                                        pageCount={pageCount}
                                        pageRangeDisplayed={5}
                                        marginPagesDisplayed={5}
                                        previousLabel='Previous'
                                        nextLabel='Next'
                                        breakLabel='...'
                                        breakClassName='page-item'
                                        onPageChange={onPageChange}
                                        forcePage={currentPage}
                                        containerClassName='pagination'
                                        pageClassName='page-item'
                                        pageLinkClassName='page-link'
                                        previousClassName='page-item'
                                        nextClassName='page-item'
                                        previousLinkClassName='page-link'
                                        nextLinkClassName='page-link' />
                                </div>

                            </div>


                        </div>
                    </div>
                    <div>
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
                        </Modal>                        
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