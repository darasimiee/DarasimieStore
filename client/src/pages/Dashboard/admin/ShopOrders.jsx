import { useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import { useStore } from "../../../config/store";
import useFetchData from "../../../hooks/fetchData";
import { formatCurrency } from "../../../utils/formatCurrency";
import { Link } from "react-router-dom";
import Loader from "../../../utils/Loader";
import { getAllOrders, trackOrders } from "../../../config/api";
import toast from "react-hot-toast";

export default function ShopOrders() {
  const { currentUser } = useStore();
  const { data, error, loading, setData } = useFetchData(
    getAllOrders,
    currentUser?.access_token
  );
  console.log("allorders", data);

  useEffect(() => {
    document.title = "Shop orders";
  }, []);

  const handleOrderUpdate = async (id) => {
    const item = data.filter((order) => order._id === id)[0];
    const currentStatus = item.status;
    try {
      const res = await trackOrders(
        id,
        { status: currentStatus + 1 },
        currentUser?.access_token
      );
      setData([res.data, ...data.filter((order) => order._id !=id)])
    } catch (error) {
      console.log(error);
      toast.error('Error updating this order request.')
    }
  };

  error && <p className="mt-5 fs-5">{error.message}</p>;
  return (
    <>
      <h1>Total orders ({data?.length})</h1>
      {loading ? (
        <Loader />
      ) : (
        <>
          {data?.length > 0 ? (
            <Table striped bordered hover variant="light" responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th className="fw-medium">OrderId</th>
                  <th className="fw-medium">Customer</th>
                  <th className="fw-medium">Total</th>
                  <th className="fw-medium">Payment Mode</th>
                  <th className="fw-medium">Payment status</th>
                  <th className="fw-medium">Order status</th>
                  <th className="fw-medium">Delivery status</th>
                  <th className="fw-medium">Update action</th>
                </tr>
              </thead>
              {data.map((order, i) => (
                <tbody key={order._id}>
                  <tr>
                    <td>{i}</td>
                    <td>
                      <Link
                        to={`/account/${currentUser?.user?.username}/orders/${order._id}`}
                        className={
                          order.isDelivered
                            ? "text-success fs-6"
                            : "text-black fs-6"
                        }
                      >
                        {order._id}
                      </Link>
                    </td>
                    <td>{order.shippingDetails.fullname}</td>
                    <td>{formatCurrency(order.totalPrice)}</td>
                    <td>{order.paymentMethod}</td>
                    <td>{order ? "Paid" : "Not-paid"}</td>
                    <td className={
                      (order.status === 0 && "text-warning")||
                      (order.status === 1 && "text-danger")||
                      (order.status === 2 && "text-success fw-medium")
                    }>
                      {order.status === 0 && "Waiting"}
                      {order.status === 1 && "Processing"}
                      {order.status === 2 && "Fulfilled"}
                    </td>
                    <td className={order.isDelivered ? 'text-sucess fw-medium' : 'text-black'}>{order.isDelivered ? "Delivered" : "Pending"}</td>
                    <td>
                      <Button
                        variant={order.isDelivered ? "success" : "warning"}
                        className="rounded-0 fw-bold"
                        onClick={() => handleOrderUpdate(order._id)}
                        disabled={order.isDelivered === true}
                      >
                        {order.isDelivered ? "COMPLETED" : "UPDATE"}
                        {order.isDelivered === false && order.status === 0 && 'UPDATE'}
                        {order.isDelivered === false && order.status === 1 && 'FULFILL'}
                      </Button>
                    </td>
                  </tr>
                </tbody>
              ))}
            </Table>
          ) : (
            <h1 className="fs-6">No customer orders yet.</h1>
          )}
        </>
      )}
    </>
  );
}
