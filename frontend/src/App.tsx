import "./App.css"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Signin } from './pages/Signin'
import { Signup } from './pages/Signup'
import { Blog } from './pages/Blog'
import { CreateBlog } from "./pages/CreateBlog"
import { BlogDetails } from "./pages/IndividualBlog"
import { UpdateBlog } from "./pages/UpdateBlog"
import { Home } from "./pages/Home"
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/signin' element={<Signin />}></Route>
          <Route path='/signup' element={<Signup />}></Route>
          <Route path='/blogs' element={<Blog />}></Route>
          <Route path='/createBlog' element={<CreateBlog />}></Route>
          <Route path='/blog/:id' element={<BlogDetails />}></Route>
          <Route path="/update/:id" element={<UpdateBlog />} />
        </Routes>
      </BrowserRouter></>
  )
}

export default App
