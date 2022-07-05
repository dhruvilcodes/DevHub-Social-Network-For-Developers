import React,{Fragment,useEffect,useState} from 'react'
import PropTypes from 'prop-types'
import  {connect} from 'react-redux';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { deleteComment } from '../../actions/post';
import { getUserProfile } from '../posts/postapicalls';
import { API } from '../../backend';


const CommentItem = ({
    postId,
    comment,
    auth,
    deleteComment
}) => {

    const[id,setId]=useState('');

    const check=async(id)=>{

        const res=await getUserProfile(id);
        console.log(res)

        setId(res);
    }
    useEffect(() => {
        check(comment.user)
          
      }, [])
  return (
    <div className="post bg-white p-1 my-1">
    <div>
      <Link to={`/profile/${comment.user}`}>
        <img className="round-img" src={id ? `${API}/api/profile/photo/${id}` : comment.avatar} alt="" />
        <h4>{comment.name}</h4>
      </Link>
    </div>
    <div>
      <p className="my-1">{comment.text}</p>
      <p className="post-date">Posted on <Moment format="DD/MM/YYYY">{comment.date}</Moment></p>
      {!auth.loading && comment.user === auth.user._id && (
        <button
          onClick={() => deleteComment(postId, comment._id)}
          type="button"
          className="btn btn-danger"
        >
          <i className="fas fa-times" />
        </button>
      )}
    </div>
  </div>
  )
}

CommentItem.propTypes = {
    postId:PropTypes.number.isRequired,
    comment:PropTypes.object.isRequired,
    auth:PropTypes.object.isRequired,
    deleteComment:PropTypes.func.isRequired

}

const mapStateToProps=state=>({
    auth:state.auth
})

export default connect(mapStateToProps,{deleteComment})(CommentItem)