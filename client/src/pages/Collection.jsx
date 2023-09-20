import { Link, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Row, Col, Image } from "react-bootstrap";
import useFetchData from "../hooks/fetchData";
import { getCategories } from "../config/api";
import { PageLayout, Headings } from "../components";
import Loader from "../utils/Loader";

export default function Collection() {
  const { data, error, loading } = useFetchData(getCategories);
  const location = useLocation();
  console.log(location);

  useEffect(() => {
    document.title = "Collections";
  });

  return (
    <>
      {location.pathname === "/collections" ? (
        <PageLayout>
          <Headings title="Collections" />
          {error && <p className="fs-5">{error.message}</p>}
          {loading ? (
            <Loader />
          ) : (
            <Row className="gy-3">
              {data.map((category) => (
                <Col key={category._id} md={4}>
                  <Link
                    to={`/collections/${category.name}`}
                    className="collection"
                  >
                    <Image
                      src={category.image}
                      alt={category.name}
                      title={category.name}
                      className="img-fluid"
                    />
                    <p
                      className="fw-bold text-black py-3 px-2 
          bg-secondary-subtle"
                    >
                      {category.name}
                    </p>
                  </Link>
                </Col>
              ))}
            </Row>
          )}
        </PageLayout>
      ) : (
        <Outlet />
      )}
    </>
  );
}
