import React from 'react'
import { useState} from 'react'


const Profile = ({ userProfile }) => {
    const clean_bio = DOMPurify.sanitize(userProfile.bio)
    return (
        <>
            <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" rel="stylesheet"></link>
                <div class="container bootdey">
                    <div class="row">
                        <div class="col-md-4">
                            <div class="well well-light-orange mini-profile-widget">
                                <div class="image-container">
                                <img src={userProfile.avatar} class="avatar img-responsive" alt="avatar"></img>
                                </div>
                                <div class="details">
                                <h4>{userProfile.handle}</h4>
                                    <hr>
                                        <div>{clean_bio}</div>
                                        <div class="mg-top-10">32 Followers | 120 Following | 18 Posts</div>                             
                                    </hr>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
    )
}

export default Profile