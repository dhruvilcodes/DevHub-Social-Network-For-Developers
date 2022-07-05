import React, { Fragment, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getPosts } from '../../actions/post'
import Spinner from '../layouts/Spinner'
import PostItem from './PostItem'
import PostForm from './PostForm'

const Posts = ({ getPosts, post }) => {
    const [change, setChange] = useState(false);
    useEffect(() => {
        getPosts();
    }, [change])
    return (
        <Fragment>
            {(post && post.loading) ? <Spinner /> : <Fragment><h1 className="large text-primary">Posts</h1></Fragment>}
            <p className='lead'>
                <i className='fas fa-user'></i>Welcome to the community
            </p>
            <PostForm change={change} setChange={setChange} />
            <div className='posts'>
                {post && post.posts && post.posts.map((post) => {
                    return (<PostItem key={post._id} post={post} change={change} setChange={setChange} />)
                })}
            </div>
        </Fragment>
    )
}



Posts.propTypes = {

    getPosts: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired

}

const mapStateToProps = state => ({
    post: state.post
})

export default connect(mapStateToProps, { getPosts })(Posts);