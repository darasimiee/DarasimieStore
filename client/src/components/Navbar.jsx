import { Dropdown, Image } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import useFetchData from "../hooks/fetchData";
import { getCategories } from "../config/api";
import Sidebar from "./Sidebar";
import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import Account from "./Account";
import { useStore } from "../config/store";
import ShoppingBag from "./ShoppingBag";


export default function Navbar() {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState(null);
  const navigate = useNavigate();
  const { data } = useFetchData(getCategories);
  const { currentUser, logOut} = useStore();
  console.log("nav", data);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery) {
      navigate(`search/?q=${searchQuery}`);
    }
  };

  return (
    <nav className="py-2 px-3 shadow fixed-top w-qoo bg-white">
      <div className="layout-container">
        <div className="d-flex align-items-center">
          {!showSearch && (
            <>
              <Sidebar />
              <NavLink to="/" className="fs-3 text-black fw-bold mt-1 me-4">
                SHOP
              </NavLink>

              <Dropdown className="flex-grow-1 d-none d-lg-block">
                <Dropdown.Toggle
                  variant="none"
                  id="dropdown-basic"
                  size="sm"
                  className="text-black fw-bold fs-5"
                >
                  COLLECTIONS
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {data.map((category) => (
                    <Dropdown.Item
                      key={category._id}
                      as={NavLink}
                      to={`/collections/${category.name}`}
                      className="fs-5"
                    >
                      {category.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              <div className="d-flex align-items-center gap-4 ms-auto ">
                <BsSearch
                  style={{ cursor: "pointer" }}
                  size="24px"
                  onClick={() => setShowSearch(!showSearch)}
                />
                <ShoppingBag/>

                {currentUser ? (
                  <Dropdown>
                    <Dropdown.Toggle variant="none" id="dropdown-basic">
                      <Image
                        src={currentUser?.user.profileImg}
                        alt={currentUser?.user.username}
                        roundedCircle
                        style={{
                          width: "40px",
                          height: "40px",
                          objectFit: "cover",
                        }}
                      />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.ItemText className="'text-capitalize fw-bold">
                        Hi, {currentUser?.user?.username}
                      </Dropdown.ItemText>
                      <Dropdown.Item
                        as={NavLink}
                        to={`account/user-profile/${currentUser?.user?.username}`}
                      >
                        Profile
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={NavLink}
                        to={`account/${currentUser?.user?.username}/orders`}
                      >
                        Orders
                      </Dropdown.Item>

                      <Dropdown.Item
                        as={NavLink}
                        to={`account/${currentUser?.user?.username}/saveditems`}
                      >
                       Wishlist
                      </Dropdown.Item>
                      <Dropdown.Item onClick={logOut}>Logout</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                ) : (
                  <Account />
                )}
              </div>
            </>
          )}
          {showSearch && (
            <form
              className="position-relative ms-auto searchBox"
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                placeholder="Search for furnitures, beauty and more..."
                className="position-absolute top-50 start-50 translate-middle search"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <AiOutlineClose
                style={{ cursor: "pointer" }}
                className="position-absolute top-50 end-0 translate-middle"
                onClick={() => {
                  setShowSearch(!showSearch);
                  setSearchQuery("");
                }}
              />
            </form>
          )}
        </div>
      </div>
    </nav>
  );
}
