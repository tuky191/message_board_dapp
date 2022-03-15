import React from 'react'
import './Profile.css'

const Profile = ({ profile }) => {
    return (
        <div>
            <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" rel="stylesheet"></link>
                <div className="container bootdey">
                            <div className="well well-light-orange mini-profile-widget">
                                <div className="image-container">
                                <img src={profile.avatar} className="avatar img-responsive" alt="avatar"></img>
                                </div>
                            <div className="details">
                                <h4>{profile.handle}</h4>
                                <div>{profile.bio}</div>
                                    <div className="mg-top-10">32 Followers | 120 Following | 18 Posts</div>                             
                                </div>
                            </div>
                </div>
            </div>
    )
}

export default Profile