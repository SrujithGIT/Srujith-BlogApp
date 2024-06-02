import React from 'react'
import './Userprofile.css'
import {NavLink,Outlet} from 'react-router-dom'
function UserProfile() {
  return (
    <>
    <div className='body'>
    <NavLink to='articles' className='fs-3 nav-link '>Articles</NavLink>
    <Outlet/>
    </div>
    </>
  )
}

export default UserProfile;