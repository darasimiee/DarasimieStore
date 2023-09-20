import { BiMenu, BiPowerOff } from "react-icons/bi";
import { useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import useFetchData from "../hooks/fetchData";
import { getCategories } from "../config/api";
import { NavLink } from "react-router-dom";
import { useStore } from "../config/store";
import Loader from "../utils/Loader";

export default function Sidebar() {
  const [show, setShow] = useState(false);
  const { data, error, loading } = useFetchData(getCategories);
  console.log("Data", data);
  const { currentUser, logOut, links, adminLinks } = useStore();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <div>
      <BiMenu
        onClick={handleShow}
        style={{ cursor: "pointer" }}
        size="24px"
        className="d-lg-none me-2"
      />

      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <NavLink to="/" className="fs-2 fw-bold text-black"></NavLink>SHOP N
            BUY
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div>
            <h1 className="mb-2 fs-3 fw-bold">Collections</h1>
            {error && <p className="fs-5">failed to fetch collections</p>}
            {loading ? (
              <Loader />
            ) : (
              <>
                {data.map((category) => (
                  <div key={category._id} className="mb-3 fs-4">
                    <NavLink
                      to={`/collections/${category.name}`}
                      className={({ isActive }) =>
                        isActive
                          ? "text-success fw-bold fs-5"
                          : "text-black fw-medium"
                      }
                      onClick={handleClose}
                    >
                      {category.name}
                    </NavLink>
                  </div>
                ))}
              </>
            )}
          </div>
          {currentUser && (
            <>
              <hr />
              <h1 className="fs-3 fw-bold">Account</h1>
              {links.map((item, i) => (
                <div key={i} className="mb-3">
                  <NavLink
                    to={`account/${item.path}`}
                    className={({ isActive }) =>
                      isActive
                        ? "text-success fw-bold fs-5"
                        : "text-black fw-medium "
                    }
                    onClick={handleClose}
                  >
                    {item.name}
                  </NavLink>
                </div>
              ))}
              {currentUser?.user?.isAdmin === true && (
                <>
                  {adminLinks.map((item, i) => (
                    <div key={i} className="mb-3">
                      <NavLink
                        to={`account/${item.path}`}
                        className={({ isActive }) =>
                          isActive
                            ? "text-success fw-bold fs-5 "
                            : "text-black fw-medium "
                        }
                        onClick={handleClose}
                      >
                        {item.name}
                      </NavLink>
                    </div>
                  ))}
                </>
              )}
              <hr />
              <div className="d-flex align-items-center" onClick={logOut}>
                <BiPowerOff className="me-2 " size="24px" />
                <span className="fw-medium fs-5">Logout</span>
              </div>
            </>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}
