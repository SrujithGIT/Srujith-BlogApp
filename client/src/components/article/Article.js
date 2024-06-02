import "./Article.css";
import { useLocation } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Card, Button } from 'react-bootstrap';
import { FcComments } from "react-icons/fc";
import { FcPortraitMode } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { TbRestore } from "react-icons/tb";
import axios from "axios";


function Article() {
  let { currentUser } = useSelector(state => state.userAuthorLoginReducer);
  let { register, handleSubmit } = useForm();
  let {state}=useLocation()
  let [comment, setComment] = useState("");
  let [articlesEditStatus,setArticleEditStatus]=useState(false)
  let navigate=useNavigate();
  let [currentArticle,setCurrentArticle]=useState(state)


  let token=localStorage.getItem('token')
  const axiosWithToken=axios.create({
    headers:{Authorization:`Bearer ${token}`}
  })

  const deleteArticle = async() => {
    let art={...currentArticle};
    delete art._id;
    let res=await axiosWithToken.put(`http://localhost:4000/author-api/article/${currentArticle.articleId}`,art)
    if(res.data.message==='Article deleted'){
      setCurrentArticle({...currentArticle,status:res.data.payload})
    }
  };

  const restoreArticle =async () => {
    let art={...currentArticle};
    delete art._id;
    let res=await axiosWithToken.put(`http://localhost:4000/author-api/article/${currentArticle.articleId}`,art)
    if(res.data.message==='Article restored'){
      setCurrentArticle({...currentArticle,status:res.data.payload})
    }
  };

  const enableEditStatus=()=>{
    setArticleEditStatus(true)
  }

  //adding commnet by the users
  const writeComment = async (commentObj) => {
    commentObj.username = currentUser.username;
    let res = await axiosWithToken.post(
      `http://localhost:4000/user-api/comment/${state.articleId}`,
      commentObj
    );
    if (res.data.message === "Comment posted Successfully") {
      setComment(res.data.message);
    }
  };

  const saveModifiedArticle=async(editedArticle)=>{
    console.log(editedArticle)
    let modifiedArticle={...state,...editedArticle}
    modifiedArticle.dateOfModification=new Date();
    delete modifiedArticle._id;
    let res =await axiosWithToken.put('http://localhost:4000/author-api/article',modifiedArticle)
    if (res.data.message==='Article modified'){
      setArticleEditStatus(false)
      navigate(`/authorprofile/article/${modifiedArticle.articleId}`,{state:res.data.article})
    }
  }
  return (
    <div className="article-container text-center">
      {articlesEditStatus === false ? (
        <div>
          <Card className="article-card mx-auto">
            <Card.Header className="article-header">
              <div>{state.title}</div>
              <div className="article-header-buttons">
                {currentUser.userType === "author" && (
                  <>
                    <Button variant="primary" onClick={enableEditStatus}>
                      <FaEdit className="fs-3" />
                    </Button>
                    {currentArticle.status === true ? (
                      <Button variant="danger" onClick={deleteArticle}>
                        <MdDeleteForever className="fs-3" />
                      </Button>
                    ) : (
                      <Button variant="danger" onClick={restoreArticle}>
                        <TbRestore className="fs-3" />
                      </Button>
                    )}
                  </>
                )}
              </div>
            </Card.Header>
            <Card.Body>
              <Card.Text>
                <small className="text-muted">Created on: {state.dateOfCreation}</small><br />
                <small className="text-muted">Modified on: {state.dateOfModification}</small><br /><br />
                <p className="article-content">{state.content}</p>
                <div className="comments my-4">
                  {/* Existing comments */}
                </div>
              </Card.Text>
              {currentUser.userType === "user" && (
                <form className="comment-form" onSubmit={handleSubmit(writeComment)}>
                  <input type="text" {...register("comment")} className="form-control mb-4 comment-input" placeholder="Add comment ...."  />
                  <button type="submit" className="btn btn-success comment-btn">Add a Comment</button>
                </form>
              )}
            </Card.Body>
          </Card>
        </div>
      ) : (
        <div className="container mt-5 text-center">
        <div className="card shadow-lg bg-light article-card">
        <form className="article-form" onSubmit={handleSubmit(saveModifiedArticle)}>
        <div className="mb-3 w-50 mx-auto">
          <label htmlFor="title" className="form-label">Title</label>
          <input type="text" className="form-control" id="title" placeholder="Enter the title" {...register("title")} defaultValue={state.title}/>
        </div>
        <div className="mb-3 w-50 mx-auto">
          <label htmlFor="category" className="form-label">Category</label>
          <select className="form-select" id="category" {...register("category")} defaultValue={state.category}>
            <option>Select a category</option>
            <option value="Technology">Technology</option>
            <option value="Health">Health</option>
            <option value="Finance">Finance</option>
            <option value="Education">Education</option>
          </select>
        </div>
        <div className="mb-3 w-75 mx-auto">
          <label htmlFor="content" className="form-label">Content</label>
          <textarea className="form-control" id="content" rows="5" placeholder="Write your article here" {...register("content")} defaultValue={state.content}></textarea>
        </div>
        <button type="submit" className="btn btn-primary publish-btn">Publish</button>
      </form>
      </div>
      </div>

      )}
    </div>
  );
}

export default Article;