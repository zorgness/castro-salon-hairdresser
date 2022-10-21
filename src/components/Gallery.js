import React, {useState, useEffect} from 'react'
import { Link } from "react-router-dom";
import Banner from './Banner';
import { fetchData } from '../Api/FecthData';
import { checkDataAgeToCleanLocaleStorage } from '../cleanStorage/CleanStorage'


const Gallery = () => {

  const urlMain = process.env.REACT_APP_URL_MAIN
  const urlBlogPosts = `${urlMain}/api/blog_posts`
  const imagePath = process.env.REACT_APP_AWS_S3_URL;

  const [infos ,setInfos] = useState([]);
  const [nameImages, setNameImages] = useState([]);
  const [load, setLoad] = useState(true);


  useEffect(() => {

    if (localStorage.getItem('storageDateIndex')) {
      const date = localStorage.getItem('storageDateIndex');
      checkDataAgeToCleanLocaleStorage (date);
     }

     // to slow  if is inside function getInfo
  const isInLocaleStorage = localStorage.hasOwnProperty('infoStorageGallery')
  const getInfos = async () => {

    if (isInLocaleStorage) {

      console.log('storage gallery')

      const infoStorage = JSON.parse(localStorage.getItem('infoStorageGallery'));
      const imageStorage = JSON.parse(localStorage.getItem('imageStorageGallery'));

      setInfos(infoStorage);
      setNameImages(imageStorage);

    } else {

      console.log('api')

      const fetchedData = await fetchData(urlBlogPosts );
      setInfos(fetchedData);


      const tmpImageStorage = []

      fetchedData["hydra:member"].forEach(element => {

          const filesName = fetchData(urlMain + element.productImages[0]);

          filesName.then(data => {

            tmpImageStorage.push(data)

            setNameImages([...tmpImageStorage])
            localStorage.setItem('imageStorageGallery', JSON.stringify(tmpImageStorage))
          })

        })

      localStorage.setItem('infoStorageGallery', JSON.stringify(fetchedData));

      if ( !localStorage.getItem('storageDateIndex') ) {
        localStorage.setItem('storageDateIndex', Date.now());
      }
    }

  }

    if(load) {

      return () => {
        getInfos();
        setLoad(false)
      }

    }

  }, [infos, load, urlBlogPosts, urlMain]);


  // to sort images by post id
  const sortedImages = nameImages?.sort((a,b)=> parseInt(a?.post.replace(/[^0-9]/g, "")) - parseInt(b?.post.replace(/[^0-9]/g, "")));

  return (
    <div className='content-container'>

      <Banner />

        <div className="index-item">

        <h1 className='pattaya text-center m-3' style={{fontSize: "48px", textDecoration: " black  underline"}}>Gallerie</h1>

        <div className="d-flex justify-content-around flex-wrap">

        {

            infos?.['hydra:member']?.map(({id, title} , index )=> {

              return (
                <Link to={`/gallerie/${id}`} key={id} >


                    <div className='m-5'>
                      <h2 className='pattaya text-secondary text-end' style={{fontSize: "24px"}}>{title}</h2>
                      {sortedImages[index] !== undefined && <img src={imagePath + sortedImages[index]?.name} alt={sortedImages[index]?.name} className="avatar-super-large"  />}
                    </div>


                    {/* {sortedImages[index] !== undefined &&     <div className="card-category" style={{ backgroundImage: `url(${imagePath + sortedImages[index]?.name})` }}>
                        <h3>{title}</h3>
                    </div>} */}


                    </Link>
                    )
                  })
                }

         </div>
        </div>

    </div>

  )

}

export default Gallery
