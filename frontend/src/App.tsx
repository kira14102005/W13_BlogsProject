import { useState } from 'react'
import "./App.css"
import { BrowserRouter , Routes, Route} from 'react-router-dom'
import { Signin } from './pages/Signin'
import { Signup } from './pages/Signup'
import { Blog } from './pages/Blog'
function App() {
  // const [count, setCount] = useState(0)

  return (
   <>
   <BrowserRouter>
   <Routes>
<Route path='/signin' element = {<Signin/>}></Route>
<Route path='/signup' element = {<Signup/>}></Route>
<Route path='/blogs' element = {<Signup/>}></Route>
<Route path='/blog/:id' element = {<Blog/>}></Route>
{/* <Route path='/signin' element = {<Signin/>}></Route> */}
   </Routes>
   </BrowserRouter></>
  )
}

export default App
