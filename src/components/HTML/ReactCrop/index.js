import React, { useEffect, useRef, useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import Style from "./style.module.css";
import FintooButton from "../FintooButton";

const ReactCrop = ({ image, maxWidth = 0, maxHeight = 0, onCrop, onDelete }) => {
  // const [image, setImage] = useState("https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg");
  const [cropData, setCropData] = useState("#");
  // const [cropper, setCropper] = useState();
  const [degree, setDegree] = useState(0);
  const [zoom, setZoom] = useState(0);
  const cropperRef = useRef(null);
  // const [newHeight, setNewHeight] = useState();
  const [newWidth, setNewWidth] = useState(400);
  const [id, setId] = useState(0);


  useEffect(()=> {
    setId((v)=> ++v);
  }, [image]);


  const onLoadInit = () => {
    if (cropperRef) {
      if (cropperRef.current !== null){
        if (cropperRef.current.cropper.imageData.naturalWidth < 400) {
          // setNewHeight(cropperRef.current.cropper.imageData.naturalHeight);
          setNewWidth(cropperRef.current.cropper.imageData.naturalWidth);
        } else {
          setNewWidth(400);
        }
      }
    }
  }

  const rotateCanvas = (type = "plus") => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;
    
    if (cropper == undefined) return;
    cropper.rotate(type === "plus" ? 10 : -10);
  };

  const zoomCanvas = (type = "plus") => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;
    
    if (cropper == undefined) return;
    cropper.zoom(type === "plus" ? 1 : -1);
  };

  const validateCrop = () => {
    
    if(document.querySelector(".cropper-crop-box") == null) return;
    
    document.querySelector(".wh-box").style.color = "#042b62";
    
    document.querySelector('.react-crop-2ui2 .btn-fintoo').removeAttribute("disabled");

    var w = parseFloat(document.querySelector(".cropper-crop-box").style.width);
    var h = parseFloat(
      document.querySelector(".cropper-crop-box").style.height
    );
    document.querySelector("#cropperW").innerHTML = w + "px";
    document.querySelector("#cropperH").innerHTML = h + "px";
    
    if (maxWidth > 0 && w > maxWidth) {
      document.querySelector(".wh-box").style.color = "red";
      document.querySelector(".react-crop-2ui2 .btn-fintoo").setAttribute("disabled", "disabled");
    }
    if (maxHeight > 0 && h > maxHeight) {
      document.querySelector(".wh-box").style.color = "red";
      document.querySelector(".react-crop-2ui2 .btn-fintoo").setAttribute("disabled", "disabled");
    }
  };

  const finishCrop = () => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;
    var w = parseFloat(document.querySelector(".cropper-crop-box").style.width);
    var h = parseFloat(document.querySelector(".cropper-crop-box").style.height);
    const img = cropper.getCroppedCanvas({width: w, height: h}).toDataURL();
    onCrop(img);
  }
  return (
    <>
      {image ? (
        <>
          <div>
            <Cropper
              key={'crop-' + id + newWidth}
              ref={cropperRef}
              dragMode={"move"}
              movable={true}
              style={{ height: 250, width: newWidth }}
              zoomTo={0}
              initialAspectRatio={1}
              preview=".img-preview"
              src={image}
              viewMode={1}
              minCropBoxHeight={10}
              minCropBoxWidth={10}
              background={false}
              responsive={true}
              autoCropArea={1}
              checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
              guides={true}
              className={"crop-bx"}
              cropmove={() => validateCrop()}
              ready={()=> {
                onLoadInit();
                validateCrop();
              }}
              
            />
          </div>
          <div className="py-2 wh-box">
            <span>
              width: <span id="cropperW">100px</span>
            </span>
            &nbsp;&nbsp;&nbsp;
            <span>
              height: <span id="cropperH">100px</span>
            </span>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <button className={Style["mybtn"]} onClick={() => zoomCanvas()}>
                <i class="fa fa-search-plus" aria-hidden="true"></i>
              </button>
              <span>&nbsp;</span>
              <button
                className={Style["mybtn"]}
                onClick={() => zoomCanvas("minus")}
              >
                <i class="fa fa-search-minus" aria-hidden="true"></i>
              </button>
              <span>&nbsp;</span>
              <span>&nbsp;</span>
              <button className={Style["mybtn"]} onClick={() => rotateCanvas()}>
                <i class="fa-sharp fa-solid fa-rotate-right"></i>
              </button>
              <span>&nbsp;</span>
              <button
                className={Style["mybtn"]}
                onClick={() => rotateCanvas("minus")}
              >
                <i class="fa-solid fa-rotate-left"></i>
              </button>
              <span>&nbsp;</span>
              <span>&nbsp;</span>
              <button
                className={Style["mybtn"]}
                onClick={() => {
                  setId((v)=> ++v);
                  onDelete();
                }}
              >
                <i class="fa fa-trash" aria-hidden="true"></i>
              </button>
            </div>
            <div className="react-crop-2ui2">
              <FintooButton
                className={`d-block me-0 ms-auto`}
                onClick={() => finishCrop()}
                title={"Crop"}
              />
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};
export default ReactCrop;
