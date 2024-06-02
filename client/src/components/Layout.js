import React from "react";
import Head from './head/Head';
import Foot from './foot/Foot';
import { Outlet } from "react-router-dom";
function Layout(){
    return(
        <div>
        <Head />
        <div style={{ minHeight: "87vh"}}><Outlet /></div>
        <Foot />
        </div>
    )
}
export default Layout;