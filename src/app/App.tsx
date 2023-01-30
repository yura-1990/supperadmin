import React from "react";
import { useAppSelector } from "../store/hooks";
import { Navigate, Route, Routes } from "react-router-dom";
import { GlobalStyles } from "../styles/global-styles";
import Signin from "./pages/Auth/Signin/Signin";
import { AUTH_ROUTES, MAIN_ROUTES } from "../routes";
import Sidebar from "./components/Sidebar";
import { Layout } from "antd";
import { StyledApp } from "../styles/index.style";
import { IAccount } from "../types";
import Headers from "./components/Header/Header";

const { Content } = Layout;
function App() {
  const { token } = useAppSelector(
    (state: { account: IAccount }) => state.account
  );

  if (!token) {
    return (
      <Routes>
        {AUTH_ROUTES.map((item) => {
          const { path, element: Component } = item;
          return <Route key={path} path={path} element={<Component />} />;
        })}
        <Route path="*" key="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }
  return (
    <div className="App">
      <StyledApp>
        <Layout>
          <Sidebar />
          <Layout id="main">
            <Headers />
            <Content style={{ margin: "20px 16px 0" }}>
              <div
                className="site-layout-background"
                style={{ padding: 24, minHeight: "calc(100vh - 48px)" }}
              >
                <Routes>
                  {MAIN_ROUTES.map((item) => {
                    const { path, element: Component } = item;
                    return (
                      <Route key={path} path={path} element={<Component />} />
                    );
                  })}
                  <Route path="*" key="*" element={<Navigate to="/" />} />
                </Routes>
              </div>
            </Content>
          </Layout>
        </Layout>
      </StyledApp>
    </div>
  );
}

export default App;
