import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {Root, Error} from "../components";
import {
  Home,
  Collection,
  Categories,
  ProductDetails,
  Cart,
  Checkout,
  Account,
  Orders,
  OrderId,
  SavedItem,
  Profile,
  ShopOrders,
  ManageProduct,
  CreateProduct,
  Search,
} from "../pages";
import ProtectedRoutes from "./ProtectedRoutes";

export default function Routespath() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      errorElement: <Error/>,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/collections",
          element: <Collection />,
          children: [
            {
              path: ":collectionsName",
              element: <Categories />,
            },
            {
              path: ":collections/:slug",
              element: <ProductDetails />,
            },
          ],
        },

        {
          path: "cart",
          element: <Cart />,
        },
        {
          path: "checkout",
          element: <Checkout />,
        },
        {
          path: "search",
          element: <Search />,
        },
        {
          path: "account",
          element: (
            <ProtectedRoutes>
              <Account />
            </ProtectedRoutes>
          ),
          children: [
            {
              path: ":username/orders",
              element: <Orders />,
              children: [
                {
                  path: ":orderid",
                  element: <OrderId />,
                },
              ],
            },
            {
              path: ":username/saveditems",
              element: <SavedItem />,
            },
            {
              path: "user-profile/:username",
              element: <Profile />,
            },
            {
              path: "allorders",
              element: <ShopOrders />,
            },
            {
              path: "manage-product",
              element: <ManageProduct />,
            },
            {
              path: "add-new-product",
              element: <CreateProduct />,
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}
