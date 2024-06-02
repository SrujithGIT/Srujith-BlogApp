import React from 'react';
import './AddArticle.css';
import { useForm } from "react-hook-form";
import { useSelector } from 'react-redux';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function AddArticle() {
  const { register, handleSubmit } = useForm();
  const { currentUser } = useSelector(state => state.userAuthorLoginReducer);
  let [err, setErr] = useState("");
  let navigate = useNavigate();
  let token=localStorage.getItem('token')
  const axiosWithToken=axios.create({
    headers:{Authorization:`Bearer ${token}`}
  })

  const postArticle=async(article)=> {
    article.dateOfCreation = new Date();
    article.dateOfModification = new Date();
    article.articleId = Date.now();
    article.username = currentUser.username;
    article.comments = [];
    article.status = true;
    console.log(article);
    let res=await axiosWithToken.post('http://localhost:4000/author-api/article',article)
    console.log(res)
    if(res.data.message==='New article created'){
      navigate(`/authorprofile/articles-by-author/${currentUser.username}`)
    }else{
      setErr(res.data.message)
    }
  }

  return (
    <div className="container mt-5 text-center">
      <div className="card shadow-lg bg-light article-card">
        <h2 className="mb-4">Article</h2>
        <form className="article-form" onSubmit={handleSubmit(postArticle)}>
          <div className="mb-3 w-50 mx-auto">
            <label htmlFor="title" className="form-label">Title</label>
            <input type="text" className="form-control" id="title" placeholder="Enter the title" {...register("title")} />
          </div>
          <div className="mb-3 w-50 mx-auto">
            <label htmlFor="category" className="form-label">Category</label>
            <select className="form-select" id="category" {...register("category")}>
              <option>Select Your category</option>
              <option value="Technology">Technology</option>
              <option value="Health">Health</option>
              <option value="Finance">Finance</option>
              <option value="Education">Education</option>
            </select>
          </div>
          <div className="mb-3 w-75 mx-auto">
            <label htmlFor="content" className="form-label">Content</label>
            <textarea className="form-control" id="content" rows="5" placeholder="Write your article here" {...register("content")}></textarea>
          </div>
          <button type="submit" className="btn btn-primary publish-btn">Publish</button>
        </form>
      </div>
    </div>
  );
}
export default AddArticle;
