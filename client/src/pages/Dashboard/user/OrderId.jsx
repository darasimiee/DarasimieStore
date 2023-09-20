import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useStore } from "../../../config/store";
import useFetchData from "../../../hooks/fetchData";
import { Row, Col, Image } from "react-bootstrap";
import Loader from "../../../utils/Loader";
import { formatCurrency } from "../../../utils/formatCurrency";
import { getOrderDetail } from "../../../config/api";
import { format } from "timeago.js";

export default function OrderId() {
  const { orderid } = useParams();
  const [isPay, setNotPay] = useState(" ")


  const { currentUser } = useStore();
  const {
    data: ord,
    error,
    loading,
  } = useFetchData(getOrderDetail, orderid, currentUser?.access_token);
  console.log("OrderId", ord);

  useEffect(() => {
    document.title = `Your order ${ord?._id}`;
  }, [ord?._id]);

  error && <p className="mt-5 fs-5">{error.message}</p>;

  const track = ord.status

  useEffect(() =>
  {
    track === 0 ? setNotPay('Preparing'): ''
    track === 1 ? setNotPay('On the way'): ''
    track === 2 ? setNotPay('Delivered'): ''
  }, [track])

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Row>
          <Col md={4} className="mb-3">
            <div className="mb-3">
              <p className="fs-6">
                <span className="fw-bold fs-5 me-1">Order id:</span>
                {orderid}
              </p>
              <p className="fs-6">
                <span className="fw-bold fs-5 me-1">Quantity:</span>
                {ord?.orderItems?.length} items(s)
              </p>
              <p>Placed order {format(ord?.createdAt)}</p>
            </div>
          </Col>

          <Col md={5} className="mb-3">
            <>
              <p className="mb-1 fs-5 fw-bold">Product</p>
              {ord?.orderItems?.map((order) => (
                <div
                  key={order._id}
                  className="d-flex flex-wrap align-items-center gap-2 mb-2"
                >
                  <Image
                    src={order?.images[0]}
                    style={{
                      width: "70px",
                      height: "70px",
                      objectFit: "contain",
                    }}
                  />
                  <div>
                    <span className="mb-1 fs-6">
                      {order.title?.length > 40
                        ? order.title.slice(0, 40) + "..."
                        : order.title}
                    </span>
                    <br />
                    <span className="fs-6">{formatCurrency(order.price)}</span>
                  </div>
                </div>
              ))}
            </>
          </Col>
          <Col md={3} className="mb-3">
            <div className="mb-2">
              <p className="mb-1 fs-5 fw-bold">Payment status</p>
              {ord.isPaid ? (
                <p className="fs-6 mb-0">Paid {ord.paidAt}</p>
              ) : (
                <p className="fs-6 mb-0">Not paid</p>
              )}
            </div>
            <div className="mb-2">
              <p className="mb-1 fs-5 fw-bold">Delivery status</p>
              {ord.isDelivered ? (
                <p className="fs-6 mb-0">Delivered {ord.deliveredAt}</p>
              ) : (
                <p className="fs-6 mb-0">{isPay}</p>
              )}
            </div>
          </Col>
          <hr />
          <Col md={6} className="mb-3">
            <>
              <h1 className="fs-6 fw-bold">PAYMENT INFORMATION</h1>
              <p className="fs-5 fw-medium mb-1">Payment method</p>
              <p className="fs-6">Mode: {ord.paymentMethod}</p>
              <p className="fs-5 fw-medium mb-1">Payment detail </p>
              {ord.orderItems?.map((order) => (
                <p key={order._id} className="fs-6 mb-1">
                  Item Price: {formatCurrency(order.price)}
                </p>
              ))}
              <p className="fs-6 mb-1">Tax: {formatCurrency(ord.taxPrice)}</p>
              <p className="fs-6 mb-1">
                Delivery Fee: {formatCurrency(ord.shippingPrice)}
              </p>
              <p className="fs-6 mb-1">
                Total: {formatCurrency(ord.totalPrice)}
              </p>
            </>
          </Col>
          <Col md={6} className="mb-3">
            <>
            <h1 className="fs-6 fw-bold">DELIVERY INFORMATION</h1>
            <p className="fs-5 fw-medium mb-1">Delivery method</p>
            <p className="fs-6 mb-1">{ord.shippingDetails?.address}</p>
            <p className="fs-6 mb-1">Receiver: {ord.shippingDetails?.fullname}</p>
            <p className="fs-6 mb-1">Contact Detail: {ord.shippingDetails?.phone}</p>
            <p className="fs-6 mb-1">Location: {ord.shippingDetails?.state}</p>
            <p className="fs-5 fw-bold mb-1">Buyer info</p>
            <p className="fs-6 text-capitalize mb-1">Name: {ord?.user?.username}</p>
            <p className="fs-6">Email: {ord?.user?.email}</p>
            </>
          </Col>
        </Row>
      )}
    </>
  );
}
