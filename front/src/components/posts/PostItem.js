import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { connect } from "react-redux";
import {updateLike, deletePost} from "../../actions/post"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faChevronUp, faChevronDown, faComment} from "@fortawesome/free-solid-svg-icons"
import axios from "axios";
const PostItem = ({updateLike, deletePost, auth, post: {_id, text, title, image, tags, name, likes, dislikes, comments, date, photo, user, category}, showActions}) => {
  const stringToColour = str => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let colour = '#';
    for (let i = 0; i < 3; i++) {
      let value = (hash >> (i * 8)) & 0xFF;
      colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
  }

  const invertHex = hex => {
    return (Number(`0x1${hex}`) ^ 0xFFFFFF).toString(16).substr(1).toUpperCase();
  }

    return (
     <Fragment>
       <div className="col-lg-4 col-md-6" style={{marginTop: "15px", marginBottom: "15px", marginLeft: "auto", marginRight: "auto"}}>
          <div className="card h-100">
            <div className="single-post post-style-1">
            <div class="post_grid_more_meta_wrapper ">
            <span class="meta-category-small">
            <a class="post-category-color-text" style={{background: stringToColour(category), color: invertHex(stringToColour(category))}}>{category}</a>
              </span></div>

              <div className="blog-image"><Link to={`/posts/${_id}`}><img src={image} alt="Blog Image"/></Link></div>
                <a className="avatar" href="#"><Link to={`/posts/${_id}`}><img src={photo} alt="Profile Image"/></Link></a>
                <div className="blog-info">
                <div className="title"><Link to={`/posts/${_id}`}><h4 className="title">{title}</h4></Link></div>
                  <ul className="post-footer">
                    <li onClick={e => updateLike(_id, "like")}><a><FontAwesomeIcon icon={faChevronUp}></FontAwesomeIcon>{'  '}{likes.length > 0 && likes.length}</a></li>
                    <li onClick={e => updateLike(_id, "dislike")}><a ><FontAwesomeIcon icon={faChevronDown}></FontAwesomeIcon>{'  '}{dislikes.length > 0 && dislikes.length}</a></li>
                    <li><Link to={`/posts/${_id}`}><FontAwesomeIcon icon={faComment}></FontAwesomeIcon>{'  '}{comments.length > 0 && comments.length}</Link></li>
                  </ul>
                </div>
              </div>
          </div>
        </div>
     </Fragment>
  );
   
}

PostItem.defaultProps = {
  showActions: true
}
PostItem.propTypes = {
    post: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    updateLike: PropTypes.func.isRequired,
    deletePost: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
}) 
export default connect(mapStateToProps, {updateLike, deletePost})(PostItem)
