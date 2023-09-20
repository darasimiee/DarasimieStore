import { useParams } from "react-router-dom";
import { useEffect, useState, useReducer, useCallback } from "react";
import { Button, Row, Col, Image, Container } from "react-bootstrap";
import { formatCurrency } from "../utils/formatCurrency";
import { toast } from "react-hot-toast";
import Loader from "../utils/Loader";
import { PageLayout, ProductCard, ImageModal } from "../components";
import { initialState, productReducer } from "../reducers/productReducer";
import {
  getOneProduct,
  getAllProducts,
  likeProduct,
  dislikeProduct,
} from "../config/api";
import { BiSolidLike} from "react-icons/bi";
import useFetchData from "../hooks/fetchData";
import useScroll from "../hooks/scroll";
import { BsArrowLeftCircle, BsArrowRightCircle } from "react-icons/bs";
import { useStore } from "../config/store";


export default function ProductDetails() {
  const { slug } = useParams();
  const [state, dispatch] = useReducer(productReducer, initialState);
  const [showModal, setShowModal] = useState(false);
  const [current, setCurrent] = useState(0);
  const { error, data, loading } = useFetchData(getAllProducts);
  
  const { scroll, scrollRef } = useScroll();
  const { currentUser, increaseCartQty, setShow } = useStore();

  const suggestedProduct = data.filter(
    (product) => product.category !== state?.product?.category
  );

  const addToCart = (item) =>
  {
    increaseCartQty(item)
    toast.success(`${item.title} added to cart`)
    setShow(true)
  }

  const handleLike = async () => {
    try {
      await likeProduct(
        state?.product?._id,
        currentUser.user._id,
        currentUser?.access_token
      );
      dispatch({ type: "LIKE_PRODUCT", payload: currentUser?.user._id });
      toast.success("You liked this.");
    } catch (error) {
      toast.error("Unable to like product, kindly log in first.");
    }
  };

  const handleDislike = async () => {
    try {
      await dislikeProduct(
        state?.product?._id,
        currentUser.user._id,
        currentUser?.access_token
      );
      dispatch({ type: "DISLIKE_PRODUCT", payload: currentUser?.user._id });
      toast.success("You disliked this.");
    } catch (error) {
      toast.error("log in first");
    }
  };
  const getProductDetail = useCallback(async () => {
    dispatch({ type: "PRODUCT_REQUEST" });
    try {
      const res = await getOneProduct(slug);
      dispatch({ type: "GET_PRODUCT_DETAIL_SUCCESS", payload: res.data });
    } catch (error) {
      console.log(error);
      dispatch({ type: "PRODUCT_ERROR", payload: error.message });
      toast.error("Failed to fech product");
    } finally {
      dispatch({ type: "END_PRODUCT_REQUEST" });
    }
  }, [slug])
  //Useeffect is used to fetch data
  useEffect(() => {
   document.title = state?.product?.title
   window.scrollTo({top: '0'})
    getProductDetail();
  }, [getProductDetail, state?.product?.title]);

  return (
    <>
      <PageLayout>
        {state?.loading ? (
          <Loader />
        ) : (
          <Row className="justify-content-around g-4 mt-2">
            {state?.errorMessage && (
              <p className="fs-5">{state.errorMessage}</p>
            )}

            <Col lg={6} className="mb-5">
              <Row className="g-2">
                {state?.product?.images?.map((image, i) => (
                  <Col xs={6} key={i}>
                    <Image
                      src={image}
                      alt={state?.product.title}
                      className="w-100 h-100"
                      loading="lazy"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setShowModal(true), setCurrent(i);
                      }}
                    />
                    {showModal && (
                      <ImageModal
                        showModal={showModal}
                        setShowModal={setShowModal}
                        current={current}
                        setCurrent={setCurrent}
                        data={state?.product}
                      />
                    )}
                  </Col>
                ))}
              </Row>
            </Col>
            <Col lg={3}>
              <h1 className="fw-bold fs-3">{state?.product?.title}</h1>
              <div className="mt-3 d-flex justify-content-between align-items-center flex-wrap">
                <span className="fs-5">
                  Brand: <b>{state?.product?.brand}</b>
                </span>
                <div>
                  <BiSolidLike
                    style={{ cursor: "pointer" }}
                    size="1.5rem"
                    color={
                    state?.product?.likes?.includes(currentUser?.user?._id)
                      ? "red"
                      : ""
                  }
                  onClick={
                    state?.product?.likes?.includes(currentUser?.user?._id)
                      ? handleDislike
                      : handleLike
                  }
                  />
                  {/* <BiSolidDislike style={{ cursor: "pointer" }} size="1.5rem" /> */}
                </div>
              </div>
              <p className="mt-3 fs-5">
                {formatCurrency(state?.product?.price)}
              </p>
              <Button variant="dark" className="mt-3 w-100 rounded-0" onClick={() => addToCart(state?.product)}>
                ADD TO CART
              </Button>
              <div className="mt-5">
                <p className="text-uppercase fw-bold fs-6 ">
                  Product description
                </p>
                <p className="fs-6">{state?.product?.description}</p>
              </div>
              {state?.product?.extra?.length > 0 && (
                <div className="mt-5">
                  <hr />
                  <p className="fw-bold fs-6 text-uppercase">ADDITIONAL</p>
                  {state?.product?.extra?.map((item, i) => (
                    <p key={i} className="fs-6">
                      *{item}
                    </p>
                  ))}
                </div>
              )}
            </Col>
          </Row>
        )}
      </PageLayout>
      <h1 className="mt-5 text-center fw-bold fs-4">You may also like</h1>
      <Container className="mt-4 mx-auto">
        {error && <p className="fs-5">{error.message}</p>}
        {loading ? (
          <Loader />
        ) : (
          <div className="position-relative">
            <BsArrowLeftCircle
              className="d-none d-lg-block position-absolute top-50 start-0 translate-middle text-black z-2"
              size="1.8rem"
              style={{ cursor: "pointer" }}
              onClick={() => scroll("left")}
            />
            <BsArrowRightCircle
              className="d-none d-lg-block position-absolute top-50 start-100 translate-middle text-black z-2"
              size="1.8rem"
              style={{ cursor: "pointer" }}
              onClick={() => scroll("right")}
            />
            <div
              className="d-flex gap-4 overflow-x-auto overflow-y-hidden h-100"
              ref={scrollRef}
            >
              {suggestedProduct.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </>
  );
}
