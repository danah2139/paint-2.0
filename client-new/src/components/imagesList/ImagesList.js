import { useEffect, useState } from "react";
import api from "../../api";

const ImagesList = ({ isChange, ctx }) => {
  const [imagesList, setImagesList] = useState([]);
  const handleSetImageBg = (e) => {
    console.log(typeof e.target);
    const img = new Image();
    //let imgSrc = window.URL.createObjectURL(e.target.src);
    img.onload = function () {
      ctx.drawImage(img, 0, 0);
    };
    img.src = e.target.src;
  };
  useEffect(() => {
    (async () => {
      const { data } = await api.get("images");
      setImagesList(data);
    })();
  }, [isChange]);
  const renderList = () => {
    return imagesList
      .slice(0)
      .reverse()
      .map((image, index) => (
        <img
          src={image.src}
          alt="description"
          key={index}
          onClick={handleSetImageBg}
        />
      ));
  };
  return <div id="imagesList">{imagesList.length ? renderList() : null}</div>;
};
export default ImagesList;
