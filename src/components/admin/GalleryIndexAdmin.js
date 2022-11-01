import React, {useState, useEffect, Fragment} from 'react'
import { Link } from "react-router-dom";
import { checkDataAgeToCleanLocaleStorage } from '../../cleanStorage/CleanStorage';
import { fetchData } from '../../Api/FecthData';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Popup from './PopUp';
import { galleryDestroy } from './adminDestroy';
import { deleteImageFromS3 } from "../../S3/S3";
import { capitalizeFirstLetter } from '../../util/capitalize';


const GalleryIndexAdmin = () => {

  const imagePath = process.env.REACT_APP_AWS_S3_URL;

  const urlMain = process.env.REACT_APP_URL_MAIN
  const urlBlogPosts = `${urlMain}/api/blog_posts`

  const navigate = useNavigate()

  const [infos ,setInfos] = useState([]);
  const [nameImages, setNameImages] = useState([]);
  const [show, setShow] = useState(false);
  const [load, setLoad] = useState(true);
  const [idBlogPost, setIdBlogPost] = useState(null);


    useEffect(() => {

    if (localStorage.getItem('storageDateIndex')) {
      const date = localStorage.getItem('storageDateIndex');
      checkDataAgeToCleanLocaleStorage (date);
     }

  const getInfos = async () => {

    const isInLocaleStorage = localStorage.hasOwnProperty('infoStorageGallery')

    if (isInLocaleStorage) {

      console.log('storage gallery')

      const infoStorage = JSON.parse(localStorage.getItem('infoStorageGallery'));
      const imageStorage = JSON.parse(localStorage.getItem('imageStorageGallery'));

      setInfos(infoStorage);
      setNameImages(imageStorage);

    } else {

      console.log('api')
      const fetchedData = await fetchData(urlBlogPosts);
      setInfos(fetchedData);

      const tmpImageStorage = [];

      fetchedData["hydra:member"]?.forEach(element => {

          const filesName = fetchData(urlMain + element.productImages[0]);

          filesName.then(data => {
            tmpImageStorage.push(data);
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
      getInfos()
      setLoad(false)
    }
  }
  }, [load, infos, urlBlogPosts, urlMain]);

  // to sort images by post id
  const sortedImages = nameImages?.sort((a,b)=> parseInt(a?.post.replace(/[^0-9]/g, "")) - parseInt(b?.post.replace(/[^0-9]/g, "")));

  const handleClose = () => setShow(false);

  const handleShow = (id) =>{
    setShow(true);
    setIdBlogPost(id)
  }

  const handleDelete = (id) => {
    galleryDestroy(id);
    handleClose();

    const toDeleteFromS3 = infos['hydra:member'].filter(member => member.id === id);

    for(let i = 0; i < toDeleteFromS3[0].productImages.length; i++) {

      const filesName = fetchData( urlMain + toDeleteFromS3[0].productImages[i])

      filesName.then(data => {
        deleteImageFromS3(data.name)
      });

    }

    localStorage.clear()
    navigate('/gallerie')
  }


  return (
    <div className='index-item'>


        <div className='pattaya text-center text-decoration-underline' style={{fontSize: '48px'}}>Gallery Index</div>

         {
           show &&
             <Popup
              show={show}
              idBlogPost={idBlogPost}
              handleClose={handleClose}
              handleDelete={handleDelete}
              setShow={setShow}
             />
        }

        <div className="text-end m-5">
            <Link to={'/admin_gallery_new'}
             className="btn btn-primary"
             style={{backgroundColor: ' #670BFF', border: '1px solid  #670BFF'}}
             >
             Nouveau
             </Link>
        </div>

        {

        infos?.['hydra:member']?.map(({id, title} , index )=> {

           return (

              <Fragment key={id}  >


                <div className="border border-secondary rounded m-5 p-3 bg-light">

                  <div className='m-3 text-center '>
                    <h2 className='pattaya text-secondary'>{capitalizeFirstLetter(title ?? '')}</h2>
                    {sortedImages[index] !== undefined && <img src={imagePath + sortedImages[index]?.name} alt={sortedImages[index]?.name} className="avatar-large" />}
                  </div>

                  <div className="d-flex justify-content-around">
                    <Link to={`/admin_gallery_edit/${id}`} key={id}><Button variant="secondary">Modifier</Button></Link>
                    <Button variant="danger" onClick={() => handleShow(id)}>Supprimer</Button>
                  </div>

                </div>
              </Fragment>

            )
          })
        }

    </div>

  )
}

export default GalleryIndexAdmin
