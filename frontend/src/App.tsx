import "./App.css"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Signin } from './pages/Signin'
import { Signup } from './pages/Signup'
import { Blog } from './pages/Blog'
import { CreateBlog } from "./pages/CreateBlog"
function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/signin' element={<Signin />}></Route>
          <Route path='/signup' element={<Signup />}></Route>
          <Route path='/blogs' element={<Blog />}></Route>
          <Route path='/createBlog' element={<CreateBlog />}></Route>
          <Route path='/blog/:id' element={<Blog />}></Route>
        </Routes>
      </BrowserRouter></>
  )
}

export default App
