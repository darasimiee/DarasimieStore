import { useEffect } from "react";
import { Button, Image, Col, Row } from "react-bootstrap";
import { Headings, PageLayout } from "../components";
import { useStore } from "../config/store";
import toast from "react-hot-toast";
import { formatCurrency } from "../utils/formatCurrency";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import { RiDeleteBin5Fill } from "react-icons/ri";

export default function Cart() {
  const navigate = useNavigate();
  const {
    cartItems,
    increaseCartQty,
    decreaseCartQty,
    priceTotal,
    currentUser,
    deleteCartItems,
  } = useStore();

  useEffect(() => {
    document.title = "Your Cart";
  }, []);
  return (
    <PageLayout>
      <Headings title="Cart" />
      <div className="d-none d-md-block">
        <Row className="align-items-center mb-0">
          <Col md={5} className="mb-0 fs-5 fw-bold">
            Product
          </Col>
          <Col md={2} className="mb-0 fs-5 fw-bold">
            Price
          </Col>
          <Col md={3} className="mb-0 fs-5 fw-bold">
            Quantity
          </Col>
          <Col md={2} className="mb-0 fs-5 fw-bold">
            Total
          </Col>
        </Row>
        <hr style={{ border: "1px solid black" }} />
      </div>
      {cartItems.map((item) => (
        <div key={item._id}>
          <Row className="align-items-center">
            <Col xs={8} md={5} className="mb-4">
              <div className="d-flex gap-2">
                <Link to={`/collections/${item.category}/${item.slug}`}>
                  <Image
                    src={item?.images[0]}
                    alt={item.title}
                    style={{ width: "120px", height: "auto" }}
                  />
                </Link>
                <div>
                  <p className="fs-6 fw-bold mb-0">{item.title}</p>
                  <span className="fs-6">{item.category}</span>
                </div>
              </div>
            </Col>
            <Col xs={4} md={2} className="mb-4">
              <p className="fs-5">{formatCurrency(item.price)}</p>
            </Col>

            <Col xs={8} md={3} className="mb-4">
              <div className="d-flex gap-1 align-items-center qtyBox">
                <div
                  className="d-flex gap-2 justify-content-between align-items-center border border-black bg-white p-2"
                  style={{ width: "110px" }}
                >
                  <AiOutlineMinusCircle
                    style={{ cursor: "pointer" }}
                    size="16px"
                    onClick={() => decreaseCartQty(item)}
                  />
                  <span className="fs-5 fw-medium">{item.quantity}</span>
                  <AiOutlinePlusCircle
                    style={{ cursor: "pointer" }}
                    size="16px"
                    onClick={() => increaseCartQty(item)}
                  />
                </div>
                <RiDeleteBin5Fill
                  style={{ cursor: "pointer" }}
                  size="20px"
                  onClick={() => deleteCartItems(item._id)}
                  className="hideTrash"
                />
              </div>
            </Col>
            <Col xs={4} md={2} className="mb-2">
              <p className="fs-5">
                {formatCurrency(item.price * item.quantity)}
              </p>
            </Col>
          </Row>
          <hr style={{ border: "1px solid black" }} />
        </div>
      ))}
      <div className="d-flex justify-content-lg-end mt-4">
        <div>
        <h1>
          <span className="fs-4">Subtotal:</span>
          <span className="fw-bold">{formatCurrency(priceTotal)}</span>
        </h1>
        <span className="fs-6 mb-4">
          Taxes and shipping calculated at checkout
        </span>
        <div className="mt-3">
          <Button
            variant="dark"
            className="fw-bold w-100 rounded-0"
            onClick={() =>
              currentUser
                ? navigate("/checkout")
                : toast.error("Please sign in to proceed")
            }
          >
            Checkout
          </Button>
        </div>
      </div>
      </div>
    </PageLayout>
  );
}
