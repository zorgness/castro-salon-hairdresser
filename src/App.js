import React, {useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { connect } from 'react-redux'
import { fetchData} from './Api/FecthData'
import Navigation from './components/Navigation';
import Footer from './components/Footer'
import Index from './components/Index';
import Login from './components/Login';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Gallery from './components/Gallery';
import GalleryShow from './components/GalleryShow';
import Contact from './components/Contact';
import GalleryNewAdmin from './components/admin/GalleryNewAdmin';
import GalleryIndexAdmin from './components/admin/GalleryIndexAdmin';
import GalleryEditAdmin from './components/admin/GalleryEditAdmin';
import TextIntroNewAdmin from './components/admin/TextIntroNewAdmin';
import TextIntroIndexAdmin from './components/admin/TextIntroIndexAdmin';


const App = ({authData}) =>  {



  const [user, setUser] = useState()
  const [authenticated, setAuthenticated] = useState()
  const [load, setLoad] = useState(true)

  // localStorage.clear()
  // sessionStorage.clear()

  useEffect(() => {

    const userId = localStorage.getItem('userId');
    const isAuthenticated = localStorage.getItem('authenticated');


    if (load) {

      if (userId) {

        if (sessionStorage.getItem('userData')) {

          console.log('storage auth')
          setUser(JSON.parse(sessionStorage.getItem('userData')))
          setAuthenticated(isAuthenticated)
          setLoad(false)

        } else {

            console.log('api auth')
            getUserData(userId)
            setAuthenticated(isAuthenticated)
            setLoad(false)

        }
      }



    }


  }, [load])


  const getUserData = async id => {

    const urlMain = process.env.REACT_APP_URL_MAIN
    const userProfileUrl = `${urlMain}/api/users`

    await fetchData(userProfileUrl + '/' + id).then(res => {
      setUser(res)
      sessionStorage.setItem('userData', JSON.stringify(res))
    })

  }




  return (
    <div className="App">

      <Navigation
        isAuthenticated={authenticated}
        userData={user}
       />

      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Index />}/>
            <Route path="/gallerie" element={<Gallery />}/>
            <Route path="/gallerie/:id" element={<GalleryShow />}/>
            <Route path="/contact" element={<Contact />}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/admin_text_intro_new" element={<TextIntroNewAdmin />}/>
            <Route path="/admin_text_intro_index" element={<TextIntroIndexAdmin />}/>
            <Route path="/admin_gallery_new" element={<GalleryNewAdmin />}/>
            <Route path="/admin_gallery_index" element={<GalleryIndexAdmin />}/>
            <Route path="/admin_gallery_edit/:id" element={<GalleryEditAdmin />}/>
        </Routes>
      </BrowserRouter>

      <Footer />



    </div>
  );
}

const mapStateToProps = state => {
  return {
    authData: state.auth
  }
}

// const mapDispatchToProps = dispatch => {
//   return {
//     userProfile: userId => dispatch(fetchUserProfile(userId))
//   }
// }

export default connect(mapStateToProps, null)(App);
