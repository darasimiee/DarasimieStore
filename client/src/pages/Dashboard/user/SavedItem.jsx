import { useEffect } from "react";
import { useStore } from "../../../config/store";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AiOutlineDelete } from "react-icons/ai";
import Loader from "../../../utils/Loader";
import useFetchData from "../../../hooks/fetchData";
import { Row, Col, Image, Button } from "react-bootstrap";
import { formatCurrency } from "../../../utils/formatCurrency";
import { toast } from "react-hot-toast";
import { getSavedProducts, dislikeProduct } from "../../../config/api";

export default function SavedItem() {
  const {currentUser, increaseCartQty} = useStore()
const { username } = useParams();
  const { error, data, loading } = useFetchData(
    getSavedProducts,
    username,
    currentUser?.access_token
  );
  console.log("saved", data);

  const navigate = useNavigate()
 

  useEffect(()=>{
    document.title = `${currentUser?.user?.username} saved items`
  }, [currentUser?.user?.username])

 const addToBag= (item) => {
    increaseCartQty(item)
    toast.success(`${item.title} added to cart`)
    navigate('/cart')
 }

 const deleteSavedProduct = async(product) => {
    try {
    await dislikeProduct(product, currentUser?.user?._id, currentUser?.access_token)    
    toast.success(`Product successfully removed from your saved items`)
    navigate(0)
    } catch (error) {
        console.log(error)
        toast.error('Problem deleting this product')
    }
 }

  error && <p className="mt-5 fs-5">{error.message}</p>;

  return (
    <>
      <h1 className="fs-5 fw-bold mb-4">Your saved products </h1>
      {loading ? (
        <Loader />
      ) : (
        <>
          {data?.length > 0 ? (
            <>
              {data.map((item) => (
                <Row
                  key={item._id}
                  className="py-2 mb-4 align-items-center justify-content-between border bg-white"
                >
                  <Col md={8} className="mb-4">
                    <div className="d-flex align-items-center gap-3">
                    <Link to={`/collections/${item.category}/${item.slug}`}>
                      <Image
                        src={item?.images[0]}
                        alt={item.title}
                        title={item.title}
                        style={{
                          width: "90px",
                          height: "100px",
                          objectFit: "contain",
                        }}
                      />
                      </Link>
                      
                      <div>
                      <Link to={`/collections/${item.category}/${item.slug}`} className="fs-5 text-black">
                        {item.title}</Link>
                        <div>
                          <span className="fs-6">{item.category}</span>
                          <br />
                          <span className="fs-6 fw-bold">
                            {formatCurrency(item.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col md={3} className="mb-4">
                    <div
                      className="d-flex align-items-center gap-lg-4 
                  justify-content-between justify-content-lg-start qtyBox"
                    >
                      <Button variant="dark" className="rounded-0" onClick={() => addToBag(item)}>
                        ADD TO CART
                      </Button>
                      <AiOutlineDelete
                        style={{ cursor: "pointer" }}
                        size="20px"
                        title="delete"
                        className="hideTrash"
                      onClick={() => deleteSavedProduct(item._id)}
                      />
                    </div>
                  </Col>
                </Row>
              ))}
            </>
          ) : (
            <h1 className="fs-6">Sorry, you have not liked a product yet.</h1>
          )}
        </>
      )}
    </>
  );
}