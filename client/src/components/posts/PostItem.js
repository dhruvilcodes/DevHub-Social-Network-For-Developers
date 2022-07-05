import React, { Fragment, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Moment from 'react-moment'
import { connect } from 'react-redux'
import { API } from "../../backend";
import { getProfileById } from '../../actions/profile'
import { addLike, removeLike,deletePost } from '../../actions/post'
import { getUserProfile } from './postapicalls'


const PostItem = ({ post, auth,deletePost, getProfileById, profile, addLike, removeLike, change, setChange,showActions }) => {

    const[id,setId]=useState('');

    const check=async(id)=>{

        const res=await getUserProfile(id);
        console.log(res)

        setId(res);
    }
    
    useEffect(() => {
      check(post.user)
        
    }, [])

    return (

        <div class="post bg-white p-1 my-1">
            <div>
            <Link to={`/profile/${post.user}`}>
                    <img
                        class="round-img"
                        src={id ? `${API}/api/profile/photo/${id}` : post.avatar}
                        alt=""
                    />
                    <h4>{post.name}</h4>
                </Link>
            </div>
            <div>
                <p class="my-1">
                    {post.text}
                </p>
                <p class="post-date">
                    Posted on <Moment format='DD/MM/YYYY'>{post.date}</Moment>
                </p>
                {showActions && (
                    <Fragment>
                        <button onClick={async e => { await addLike(post._id); setChange(!change) }} type="button" class="btn btn-light">
                    <i class="fas fa-thumbs-up"></i>{ }
                    {post.likes.length > 0 && <span class='comment-count'>{post.likes.length}</span>}
                </button>
                <button onClick={async e => { await removeLike(post._id); setChange(!change) }} type="button" class="btn btn-light">
                    <i class="fas fa-thumbs-down"></i>
                </button>
                <Link to={`/posts/${post._id}`} class="btn btn-primary">
                    Discussion{post.comments.length > 0 && <span class='comment-count'>{post.comments.length}</span>}
                </Link>

                {auth && !auth.loading && post&& post.user&& post.user === auth.user._id && (
                    <button
                        onClick={(e)=>{
                            deletePost(post._id);
                        }}
                        type="button"
                        className="btn btn-danger"
                    >
                        <i className="fas fa-times" />
                    </button>
                )}
                    </Fragment>
                )}

            </div>
        </div>

    )
}
PostItem.defaultProps={
    showActions:true
}

PostItem.propTypes = {
    post: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    getProfileById: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    addLike: PropTypes.func.isRequired,
    removeLike: PropTypes.func.isRequired,
    deletePost:PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    state: state.auth,
    profile: state.profile,
    auth:state.auth

})

export default connect(mapStateToProps, { getProfileById, addLike, removeLike,deletePost })(PostItem)