import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";

export default function PreOrderProduct({ data }) {
  const filterPreorderProducts = data.filter(
    (product) => product.condition === "Preorder"
  );
  console.log("Preorder:", filterPreorderProducts);

  return (
    <div className="mb-2">
      <div>
        <h1 className="fs-3 text-uppercase fw-bold text-center py-0">
          Preorder
        </h1>
        <h1 className=" fs-5 text-black-50 text-center">
          <Link className="text-black-50 fw-bold" to={"/collections"}>
            VIEW ALL
          </Link>
        </h1>
        <div className="d-lg-flex gap-2 focus-content overflow-y-hidden">
        {filterPreorderProducts.slice(0, 4).map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            
          />
        ))}
      </div>
      </div>

      

     
    </div>
  );
}
