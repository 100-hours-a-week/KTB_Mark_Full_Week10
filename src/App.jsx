import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import PostListPage from "./pages/PostListPage.jsx";
import PostViewPage from "./pages/PostViewPage.jsx";
import PostWritePage from "./pages/PostWritePage.jsx";
import PostEditPage from "./pages/PostEditPage.jsx";
import ProfileEditPage from "./pages/ProfileEditPage.jsx";
import PasswordEditPage from "./pages/PasswordEditPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/posts" element={<PostListPage />} />
          <Route path="/posts/write" element={<PostWritePage />} />
          <Route path="/posts/:postId" element={<PostViewPage />} />
          <Route path="/posts/:postId/edit" element={<PostEditPage />} />
          <Route path="/profile/edit" element={<ProfileEditPage />} />
          <Route path="/password/edit" element={<PasswordEditPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
