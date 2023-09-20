import useFetchData from "../../../hooks/fetchData";
import { deleteProduct, getAllProducts } from "../../../config/api";
import { Link } from "react-router-dom";
import { Button, Image, Table } from "react-bootstrap";
import { formatCurrency } from "../../../utils/formatCurrency";
import { useStore } from "../../../config/store";
import toast from "react-hot-toast";
import Loader from "../../../utils/Loader";
import { useEffect } from "react";

export default function ManageProduct() {
  const { currentUser } = useStore();
  const { error, data, loading, setData } = useFetchData(getAllProducts);

  useEffect(() => {
    document.title = "Manage products";
  }, []);

  const handleDelete = async (productId) => {
    try {
      await deleteProduct(productId, currentUser?.access_token);
      toast.success("Product deleted successfully");
      setData(data.filter((product) => product._id !== productId));
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  error && <p className="mt-5 fs-5">{error.message}</p>;
  return (
    <div>
      <h1 className="fs-5 fw-bold mb-4">All products</h1>
      {loading ? (
        <Loader />
      ) : (
        <Table striped bordered hover variant="light" responsive>
          <thead>
            <tr>
              <th className="fw-medium">#</th>
              <th className="fw-medium">Image</th>
              <th className="fw-medium">Title</th>
              <th className="fw-medium">Price</th>
              <th className="fw-medium">Delete</th>
            </tr>
          </thead>
          {data.map((product, i) => (
            <tbody key={product._id}>
              <tr>
                <td>{i}</td>
                <td>
                  <Link to={`/collections/${product.category}/${product.slug}`}>
                    <Image
                      src={product.images?.[0]}
                      alt={product.title}
                      loading="lazy"
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "contain",
                      }}
                    />
                  </Link>
                </td>
                <td>
                  <Link
                    to={`/collections/${product.category}/${product.slug}`}
                    className="text-black"
                  >
                    {product.title}
                  </Link>
                </td>
                <td>{formatCurrency(product.price)}</td>
                <td>
                  <Button
                    variant="danger"
                    className="rounded-0 fw-medium"
                    onClick={() => handleDelete(product._id)}
                  >
                    DELETE
                  </Button>
                </td>
              </tr>
            </tbody>
          ))}
        </Table>
      )}
    </div>
  );
}