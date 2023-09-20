import { Image, Modal } from "react-bootstrap";
import { BsArrowLeftCircle, BsArrowRightCircle } from "react-icons/bs";
import { HiOutlineLockClosed } from "react-icons/hi";

export default function ImageModal({
  showModal,
  setShowModal,
  current,
  setCurrent,
  data,
}) {
  const handleClose = () => setShowModal(false);
  const imgPics = data.images?.map((image) => image);

  const nextSlide = () => {
    setCurrent(current === imgPics.length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? imgPics.length - 1 : current - 1);
  };

  return (
    <Modal
      show={showModal}
      onHide={handleClose}
      fullscreen={true}
      backdrop="static"
    >
      <Modal.Body>
        <div className="text-end w-100">
          <HiOutlineLockClosed
            size="1.8rem"
            style={{ cursor: "pointer" }}
            onClick={handleClose}
          />
        </div>
        <div className="position-relative w-100 h-100">
          <Image src={imgPics[current]} alt="images" 
          style={{width: '100%',
             height: '100%', position:'relative', objectFit:'contain'}}/>

                            <BsArrowLeftCircle
                              className="position-absolute top-50 start-0 translate-middle text-black z-2"
                              size="1.8rem"
                              style={{ cursor: "pointer" }}
                              onClick={prevSlide}
                            />
                            <BsArrowRightCircle
                              className="position-absolute top-50 start-100 translate-middle text-black z-2"
                              size="1.8rem"
                              style={{ cursor: "pointer" }}
                              onClick={nextSlide}/>
        </div>
        
      </Modal.Body>
    </Modal>
  );
}
