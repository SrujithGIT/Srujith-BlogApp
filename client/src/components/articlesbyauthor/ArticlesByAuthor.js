import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Outlet } from "react-router-dom";
import "./ArticlesByAuthor.css";

function ArticlesByAuthor() {
  const [articlesList, setArticlesList] = useState([]);
  let { currentUser } = useSelector((state) => state.userAuthorLoginReducer);
  let navigate = useNavigate();

  const token = localStorage.getItem("token");
  const axiosWithToken = axios.create({
    headers: { Authorization: `Bearer ${token}` },
  });

  const getArticlesOfCurrentAuthor = async () => {
    try {
      const res = await axiosWithToken.get(
        `http://localhost:4000/author-api/articles/${currentUser.username}`
      );
      setArticlesList(res.data.payload);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  const readArticleByArticleId = (articleObj) => {
    navigate(`../article/${articleObj.articleId}`, { state: articleObj });
  };

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
                <button
                  className="custom-btn btn-4"
                  onClick={() => readArticleByArticleId(article)}
                >
                  <span>Read More</span>
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

export default ArticlesByAuthor;
