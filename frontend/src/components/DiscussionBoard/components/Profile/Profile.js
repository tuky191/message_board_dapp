import React from 'react'
import { useState} from 'react'


const Profile = ({ userProfile }) => {
    const clean = DOMPurify.sanitize(content)
    const clean_subject = DOMPurify.sanitize(subject)
    const [PostlikesCount, setPostLikesCount] = useState(likes.length)

    return (
        <>
            <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" rel="stylesheet"></link>
                <div class="container bootdey">
                    <div class="row">
                        <div class="col-md-4">
                            <div class="well well-light-orange mini-profile-widget">
                                <div class="image-container">
                                    <img src="https://bootdey.com/img/Content/avatar/avatar6.png" class="avatar img-responsive" alt="avatar"></img>
                                </div>
                                <div class="details">
                                    <h4>John Doe</h4>
                                    <hr>
                                        <div>Works at Bootdey.com</div>
                                        <div>Attended University of Bootdey.com</div>
                                        <div>Lives in Miami, Florida</div>
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