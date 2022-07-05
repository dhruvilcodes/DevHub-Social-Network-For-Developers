import React,{Fragment,useEffect} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import Spinner from '../layouts/Spinner'
import {getPost} from '../../actions/post'
import PostItem from '../posts/PostItem'
import { Link } from 'react-router-dom'
import CommentForm from './CommentForm'
import CommentItem from './CommentItem'

const Post =( {getPost,post,match}) => {


    useEffect(()=>{
        getPost(match.params.id);

        

    },[])

  return post.post==null||post.loading?<Spinner/>:<Fragment>
    <Link to="/posts" className="btn">
        Back To Posts
      </Link>
    <PostItem post={post.post} showActions={false}/>
    <CommentForm postId={post.post._id}/>
    {post.post.comments.map(comment=>(
        <CommentItem key={comment._id} comment={comment} postId={post.post._id}/>

    ))}
  </Fragment>
}

Post.propTypes = {
    getPost:PropTypes.func.isRequired,
    post:PropTypes.object.isRequired
}

const mapStateToProps=state=>({
    post:state.post
})

export default connect(mapStateToProps,{getPost})(Post)