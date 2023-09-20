import { useState, useEffect } from "react";
import { PageLayout, Headings, Paypal } from "../components";
import { Button, Row, Col, Spinner } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import registerOptions from "../utils/formValidation";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../utils/formatCurrency";
import { useStore } from "../config/store";
import { createOrder } from "../config/api";

export default function Checkout() {
  const [next, setNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    setShippingDetails,
    shippingDetails,
    paymentMethod,
    setPaymentMethod,
    currentUser,
    priceTotal,
    cartItems,
    setCartItems,
  } = useStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullname: shippingDetails.fullname || "",
      shippingAddress: shippingDetails.shippingAddress || "",
      phone: shippingDetails.phone || "",
      state: shippingDetails.state || "",
    },
  });

  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Checkout";
  }, []);

  const paymentOptions = [{ name: "Cash" }, { name: "Paypal" }];

  const tax = 0.05;
  const calcTax = (tax * priceTotal).toFixed(2);
  const calcShippingFee = (priceTotal / 2) * tax;
  const shippingFee = priceTotal > 3500 ? 0 : calcShippingFee.toFixed(2);

  const onSubmit = async (data, e) => {
    e.preventDefault();
    setShippingDetails(data);
    next ? null : setNext((prev) => !prev);
  };

  const total = (
    Number(priceTotal) +
    Number(calcTax) +
    Number(shippingFee)
  ).toFixed(2);

  const order = {
    orderItems: cartItems,
    paymentMethod: paymentMethod,
    taxPrice: calcTax,
    shippingPrice: shippingFee,
    shippingDetails: shippingDetails,
    totalPrice: total,
  };

  const placeOrder = async () => {
    setLoading(true);

    try {
      const res = await createOrder(order, currentUser?.access_token);
      if (res.status === 201) {
        toast.success(`Order successfully created.`);
        setCartItems([]);
        navigate(`/account/${currentUser?.user?.username}/orders/${res.data?._id}`);
      }
    } catch (error) {
      console.log(error);
      toast.error("Order could not be placed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <PageLayout>
      <Headings title="Checkout" />
      {cartItems?.length > 0 ? (
        <Row className="justify-content-between">
          <Col md={6} lg={5} className="mb-5">
            <h1 className="fs-4">Order summary</h1>
            {cartItems.map((item) => (
              <Row key={item._id} className="py-2">
                <Col md={6}>
                  <p className="mb-0 fs-6">{item.title}</p>
                </Col>
                <Col md={2}>
                  <p className="mb-0 fs-6">Qty: {item.quantity}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-0 fs-6">
                    Price: {formatCurrency(item.price)}
                  </p>
                </Col>
              </Row>
            ))}
            <hr />
            <div className="mt-4">
              <div className="d-flex justify-content-between mb-2 fs-6">
                <p className="mb-0">Subtotal: </p>
                <p>{formatCurrency(priceTotal)}</p>
              </div>
              <div className="d-flex justify-content-between mb-2 fs-6">
                <p className="mb-0">Tax: </p>
                <p className="mb-0 text-success">Fixed 0.05 </p>
                <p>{formatCurrency(calcTax)}</p>
              </div>
              <div className="d-flex justify-content-between mb-2 fs-6">
                <p className="mb-0">Shipping Fee: </p>
                <p>{formatCurrency(shippingFee)}</p>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-2 fs-6">
                <p className="mb-0">Total: </p>
                <p className="fw-bold">{formatCurrency(total)}</p>
              </div>
            </div>
          </Col>
          <Col md={6} lg={5}>
            <h1 className="fs-4">
              {next ? "Shipping info" : "Enter shipping detail"}
            </h1>
            <form onSubmit={handleSubmit(onSubmit)}>
              {!next ? (
                <>
                  <div className="mb-3 inputRegBox">
                    <input
                      type="text"
                      placeholder="Fullname"
                      id="fullname"
                      className="w-100 mb-0 inputReg"
                      autoFocus
                      {...register("fullname", registerOptions.fullname)}
                    />
                    {errors.fullname?.message && (
                      <p className="text-danger fs-6">
                        {errors.fullname.message}
                      </p>
                    )}
                  </div>
                  <div className="mb-3 inputRegBox">
                    <input
                      type="text"
                      placeholder="Address"
                      id="address"
                      className="w-100 mb-0 inputReg"
                      autoFocus
                      {...register(
                        "shippingAddress",
                        registerOptions.shippingAddress
                      )}
                    />
                    {errors.shippingAddress?.message && (
                      <p className="text-danger fs-6">
                        {errors.shippingAddress.message}
                      </p>
                    )}
                  </div>
                  <div className="mb-3 inputRegBox">
                    <input
                      type="text"
                      placeholder="Phone number"
                      id="phone"
                      className="w-100 mb-0 inputReg"
                      autoFocus
                      {...register("phone", registerOptions.phone)}
                    />
                    {errors.phone?.message && (
                      <p className="text-danger fs-6">{errors.phone.message}</p>
                    )}
                  </div>
                  <div className="mb-3 inputRegBox">
                    <input
                      type="text"
                      placeholder="State"
                      id="state"
                      className="w-100 mb-0 inputReg"
                      autoFocus
                      {...register("state", registerOptions.state)}
                    />
                    {errors.state?.message && (
                      <p className="text-danger fs-6">{errors.state.message}</p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <p className="mb-1 fs-5">{shippingDetails.fullname}</p>
                  <p className="mb-1 fs-5">{shippingDetails.shippingAddress}</p>
                  <p className="mb-1 fs-5">{shippingDetails.phone}</p>
                  <p className="mb-1 fs-5">{shippingDetails.state}</p>
                  <hr />
                  <h1 className="fs-5 mt-4">Select payment method</h1>
                  {paymentOptions.map((item, i) => (
                    <div className="form-check" key={i}>
                      <input
                        type="radio"
                        className="form-check-input"
                        name="paymentMethod"
                        id={i}
                        value={item.name}
                        defaultChecked={item.name === paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <label className="form-check-label" htmlFor={i}>
                        {item.name}
                      </label>
                    </div>
                  ))}
                </>
              )}
              <div className="d-flex justify-content-between align-items-center mt-3">
                {!next && (
                  <Button
                    className="mt-2 fw-medium"
                    type="submit"
                    variant={next ? "warning" : "dark"}
                  >
                    Continue
                  </Button>
                )}
                {next && (
                  <Button
                    className="mt-2 fw-medium"
                    type="submit"
                    variant={next ? "warning" : "dark"}
                    onClick={() => setNext(!next)}
                  >
                    Back
                  </Button>
                )}
                {next && (
                  <>
                    {paymentMethod === "Paypal" ? (
                      <Paypal total ={total} placeOrder={placeOrder}/>
                    ) : (
                      <Button
                        variant={next ? "success" : "warning"}
                        type="submit"
                        className="mt-2 fw-bold"
                        onClick={placeOrder}
                      >
                        {loading ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          "Place order"
                        )}
                      </Button>
                    )}
                  </>
                )}
              </div>
            </form>
          </Col>
        </Row>
      ) : (
        <h1 className="text-center fs-4">
          You have no orders yet. Please add a few items to your bag
        </h1>
      )}
    </PageLayout>
  );
}
