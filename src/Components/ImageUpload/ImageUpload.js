import React,{useState,useEffect} from 'react'
import './ImageUpload.css';
import Carousal from '../Carousal/Carousal'
import DrawAnnotations from '../DrawAnnotations/DrawAnnotations';

function ImageUpload() {

    const [selectedFile, setSelectedFile] = useState()
    const [preview, setPreview] = useState()
    const [allImages,setAllImages] = useState([]);
    const [rects,setRects] = useState([]);
    const [isDone,setIsDone] = useState(false);
    const [file,setFile] = useState([]);

    console.log(rects);

    // create a preview as a side effect, whenever selected file is changed
    useEffect(() => {
        if (!selectedFile) {
            setPreview(undefined)
            return
        }

        const objectUrl = URL.createObjectURL(selectedFile)
        setPreview(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])

    const handleRects = (rects) =>{
            setRects(rects);
    }

    const prepareFile = () =>{
        
        const file = [];
        console.log(rects);
        console.log(allImages)
        rects.splice(0,2);
        for(var i=0;i<allImages.length;i++){
            file.push({name:allImages[i].name,rects:rects[i]});
        }
        file.reverse();
        setFile(file);
    }

    const onSelectFile = e => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined)
            return
        }

       
       
        setSelectedFile(e.target.files[0]);
        

        const newImgList  = allImages;
        newImgList.push(e.target.files[0]);
        setAllImages(newImgList);
    
    }
  

    return (
        <>
         <div className='image-upload-container'>
            {selectedFile &&
            <>
            <div className='imgbox'>
            <DrawAnnotations selectedImage={preview} rects={handleRects} done ={isDone}/>
            </div>
            </>
          }
          <div className='right-side-container'>

              <div className='export-btn-container'>
                  
              <a onClick={prepareFile} className='export-btn' href={`data:text/json;charset=utf-8,${encodeURIComponent(
                JSON.stringify(file)
              )}`} 
              download ="filename.json"
              >Export </a>

              
              </div>

            <div className='input-container'>
                <form>
                  <label for ="imagefile">
                     <div className='input-click'>Click Here to upload Images</div>
                  </label>   
                   <input name='imagefile' id='imagefile' className='file-input' type='file'  onChange={onSelectFile} />
                </form>
                <button  onClick={()=>setIsDone(true)} className='done-btn'>Done</button>

            </div>

          </div>
          
        </div>

        <Carousal items= {allImages}/>

        </>
       
    )
    
}

export default ImageUpload
