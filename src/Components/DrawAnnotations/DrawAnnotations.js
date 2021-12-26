import React, { useState,useEffect } from "react";
import { Stage, Layer, Rect ,Image } from "react-konva";
import useImage from "use-image";
import './DrawAnnotations.css';

//import icons
import {BsPencilFill} from 'react-icons/bs'
import {BsEraserFill} from 'react-icons/bs'
import {FaEdit} from 'react-icons/fa'

const DrawAnnotations = ({selectedImage,rects,done}) => {
    const [annotations, setAnnotations] = useState([]);
    const [newAnnotation, setNewAnnotation] = useState([]);
    const [randomColors,setRandomColors] = useState([]);
    const [fileArr,setFileArr] =useState('');

    const [tool,setTool] = useState('draw');

    useEffect(()=>{
      const rectsToAdd = annotations.map((annotation)=>{
        return {
          x1:annotation.x/800,
          y1:annotation.y/450,
          x2:(annotation.x+ annotation.width)/800,
          y2:(annotation.y+ annotation.height)/450
        }
      })
      setAnnotations([]);
      setRandomColors([]);

      
      setFileArr([...fileArr,rectsToAdd]);
      rects(fileArr);

    },[selectedImage]);

    useEffect(()=>{
      const rectsToAdd = annotations.map((annotation)=>{
        return {
          x1:(annotation.x/800).toFixed(3),
          y1:(annotation.y/450).toFixed(3),
          x2:((annotation.x+ annotation.width)/800).toFixed(3),
          y2:((annotation.y+ annotation.height)/450).toFixed(3)
        }
      })
      setAnnotations([]);

      
      setFileArr([...fileArr,rectsToAdd]);
      rects(fileArr);


    },[done]);
  
    const handleMouseDown = event => {
      if (newAnnotation.length === 0) {
        const { x, y } = event.target.getStage().getPointerPosition();
       if(tool === 'draw')setNewAnnotation([{ x, y, width: 0, height: 0, key: "0" }]);
        var randomColor = Math.floor(Math.random()*16777215).toString(16);
        setRandomColors([...randomColors,randomColor]);
        
      }
    };
  
    const handleMouseUp = event => {
      if (newAnnotation.length === 1 ) {
        const sx = newAnnotation[0].x;
        const sy = newAnnotation[0].y;
        const { x, y } = event.target.getStage().getPointerPosition();
        const annotationToAdd = {
          x: sx,
          y: sy,
          width: x - sx,
          height: y - sy,
          key: annotations.length + 1
        };
        if(tool === 'draw'){
          annotations.push(annotationToAdd);
          setNewAnnotation([]);
          setAnnotations(annotations);
        }
      }
    };
  
    const handleMouseMove = event => {
      if (newAnnotation.length === 1) {
        const sx = newAnnotation[0].x;
        const sy = newAnnotation[0].y;
        const { x, y } = event.target.getStage().getPointerPosition();
        setNewAnnotation([
          {
            x: sx,
            y: sy,
            width: x - sx,
            height: y - sy,
            key: "0"
          }
        ]);
        var randomColor = Math.floor(Math.random()*16777215).toString(16);
        setRandomColors([...randomColors,randomColor]);
        
      }
    };
     
     rects(fileArr);

    const handleDoubleClick = (e)=>{
       if(tool === 'erase') {
         const {x,y,width,height} = e.target.attrs;
         console.log(e);
         const indexTobeDeleted = annotations.findIndex((annotation)=>{
            return annotation.x === x && annotation.y === y && annotation.width === width && annotation.height === height
         })
         annotations.splice(indexTobeDeleted,1);
         setAnnotations(annotations)
       }
    }
    


    const [image] = useImage(selectedImage);
  
    let annotationsToDraw = [...annotations, ...newAnnotation];
    
    return (
      <>
      <div className="draw-container">

      <div>

      <Stage
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        width={800}
        height={450}
      >
        <Layer>
           <Image image={image} width={800} height={450}/>
        </Layer>
        <Layer>
          {annotationsToDraw.map((value,index) => {
            return (
              <Rect
                x={value.x}
                y={value.y}
                width={value.width}
                height={value.height}
                fill="transparent"
                stroke={`#${randomColors[index]}`}
                draggable= {tool === 'edit' ? true : false}
                onDblClick={handleDoubleClick}

              />
            );
          })}
        </Layer>
      </Stage>

      </div>   
      

      <div className="icon-container">
        <BsPencilFill color={tool === 'draw' ? '#4B4E9C':'black'} size={40} className="icon" onClick={()=>(setTool('draw'))}/>
        <FaEdit color={tool === 'edit' ? '#4B4E9C':'black'} size={40}   className="icon" onClick={()=>(setTool('edit'))}/>
        <BsEraserFill color={tool === 'erase' ? '#4B4E9C':'black'} size={40}  className="icon" onClick={()=>(setTool('erase'))}/>
      </div>

      </div>
      
  
      
  
      </>
    );
  };
  

export default DrawAnnotations  