import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import AuthCallbackPage from "./pages/auth-callback/AuthCallbackPage";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import MainLayout from "./layout/MainLayout";
import AdminPage from "./pages/admin/AdminPage";
import SearchResultsPage from "./pages/search/SearchResultsPage";
import AlbumPage from "./pages/album/AlbumPage";
import StreamingPage from "./pages/StreamingPage";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
    <Routes>
      <Route
        path="/sso-callback"
        element={
          <AuthenticateWithRedirectCallback
            signUpForceRedirectUrl={"/auth-callback"}
          />
        }
      />
      <Route path="/auth-callback" element={<AuthCallbackPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/albums/:albumId" element={<AlbumPage />} />
        <Route path="/streaming" element={<StreamingPage />} />
      </Route>
    </Routes>

    <Toaster/>
    </>
  );
}
export default App;
