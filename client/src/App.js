import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import { lazy,Suspense} from 'react';
import Layout from './components/Layout';
import { Navigate } from 'react-router-dom';
import Articles from './components/articles/Articles';
import Home from './components/home/Home';
import Article from './components/article/Article';
import Signup from './components/singup/Signup';
import Signin from './components/singin/Signin';
import UserProfile from './components/userprofile/UserProfile';
import AuthorProfile from './components/authorprofile/AuthorProfile';
import ArticlesByAuthor from './components/articlesbyauthor/ArticlesByAuthor';
import ErrorPage from './components/ErrorPage';

const AddArticle=lazy(()=>import('./components/addarticle/AddArticle'))

function App() {
  let router = createBrowserRouter([
    {
      path: "",
      element: <Layout />,
      errorElement:<ErrorPage/>,
      children: [
        {
          path: "",
          element: <Home />
        },
        {
          path: "signup",
          element: <Signup />
        },
        {
          path: 'signin',
          element: <Signin />
        },
        {
          path: "/userprofile",
          element: <UserProfile />,
          children: [
            {
              path: 'articles',
              element: <Articles />,
            },
            {
              path: 'article/:articleId',
              element: <Article />,
            },
            {
              path: '',
              element: <Navigate to='articles' />
          }
          ]
        },
        {
          path: '/authorprofile',
          element: <AuthorProfile />,
          children: [
            {
              path: 'newarticle',
              element:<Suspense fallback="loading..."><AddArticle /></Suspense> ,
            },
            {
              path: 'articles-by-author/:author',
              element: <ArticlesByAuthor />,
            },
            {
              path: 'article/:articleId',
              element: <Article />,
            },
            {
              path: '',
              element: <Navigate to='articles-by-author/:author'/>,
          }
          ]
        },
      ]
    }
  ]);

  return (
    <div className="App ">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
