import React from "react";
import Toolbar from "./ToolBar.js";

const Layout = ({ children }) => {
  return (
    <div>
      <Toolbar />
      <div className="content">{children}</div>
    </div>
  );
};

export default Layout;
