import React from 'react';
import axios from 'axios';
import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import './Articles.css'; // Import custom CSS
import { MdReadMore } from "react-icons/md";

function Articles() {
  const [articlesList, setArticlesList] = useState([]);
  let navigate = useNavigate();
  let token = localStorage.getItem('token');
  const axiosWithToken = axios.create({
    headers: { Authorization: `Bearer ${token}` }
  });

  const getArticlesOfCurrentAuthor = async () => {
    let res = await axiosWithToken.get('http://localhost:4000/user-api/articles');
    console.log(res);
    setArticlesList(res.data.payload);
  }

  const readArticleByArticleId = (articleObj) => {
    navigate(`../article/${articleObj.articleId}`, { state: articleObj });
  }

  useEffect(() => {
    getArticlesOfCurrentAuthor();
  }, []);

  return (
    <div className="articles-container">
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4 mt-5">
        {articlesList.map((article) => (
          <div className="col" key={article.articleId}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{article.title}</h5>
                <p className="card-text">
                  {article.content.substring(0, 80) + "...."}
                </p>
                <button className="custom-btn" onClick={() => readArticleByArticleId(article)}>
                  <MdReadMore className='read-more-icon' />
                </button>
              </div>
              <div className="card-footer">
                <small className="text-body-secondary">
                  Last updated on {article.dateOfModification}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Outlet />
    </div>
  );
}

export default Articles;
