import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import { useContext } from "react";
import { Store } from "../Store";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { API_URL } from "../utils";

const Product = (props) => {
  const { product } = props;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;

  const addToCartHandler = async (item) => {
    ctxDispatch({ type: "CART_ADD_ITEM_FAIL", payload: "" });

    const existItem = cart.cartItems?.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;

    const { data } = await axios.get(`${API_URL}api/products/${item._id}`);

    if (data.countInStock < quantity) {
      window.alert("Sorry! Product is out of stock.");
      return;
    }

    if (
      cart.cartItems.length > 0 &&
      data?.seller?._id !== cart.cartItems[0]?.seller?._id
    ) {
      ctxDispatch({
        type: "CART_ADD_ITEM_FAIL",
        payload: `Can't Add To Cart ${data.name}. Buy only from ${cart.cartItems[0].seller.seller.name} in this order`,
      });
      return;
    }

    ctxDispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <>
      <div
        key={product?.slug}
        className="group relative border border-slate-900/6 p-0 sm:p-6"
      >
        <div className="aspect-h-1 aspect-w-1 overflow-hidden sm:rounded-lg bg-gray-200 group-hover:opacity-75">
          <img
            src={product?.image}
            alt={product?.name}
            className="h-full w-full object-contain object-center"
          />
        </div>
        <div className="sm:py-6 py-2 text-center">
          <h3 className="text-sm font-medium text-gray-900">
            <Link to={`/product/${product?.slug}`}>
              {/* <span aria-hidden="true" className="absolute inset-0" /> */}
              {product?.name}
            </Link>
          </h3>
          <div className="sm:mt-3 mt-1 flex flex-col items-center">
            <p className="sr-only">{product?.rating} out of 5 stars</p>
            <div className="flex items-center">
              <Rating
                rating={product?.rating}
                numReviews={product?.numReviews}
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              {product?.numReviews} reviews
            </p>
          </div>
          <p className="sm:mt-3 mt-1 text-base font-medium text-gray-900">
            ${product?.price}
          </p>
        </div>
        <div className="w-full text-center">
          <button
            onClick={
              product?.countInStock === 0
                ? null
                : () => addToCartHandler(product)
            }
            className={`${
              product?.countInStock === 0
                ? "cursor-not-allowed"
                : "cursor-pointer"
            }  relative flex items-center justify-center sm:rounded-md sm:border border-transparent bg-gray-100 px-3 py-2 text-sm sm:w-max w-full mx-auto font-medium text-gray-900 hover:bg-gray-200`}
          >
            {product?.countInStock === 0 ? (
              "Out of stock"
            ) : (
              <>
                Add to cart<span className="sr-only">, {product?.name}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </>

    // <Card className="product" key={product?.slug}>
    //   <Link to={`/product/${product?.slug}`}>
    //     <img
    //       src={product?.image}
    //       className="card-img-top"
    //       alt={product?.name}
    //     />
    //   </Link>
    //   <Card.Body>
    //     <Link to={`/product/${product?.slug}`}>
    //       <Card.Title>{product?.name}</Card.Title>
    //     </Link>
    //     <Rating rating={product?.rating} numReviews={product?.numReviews} />
    //     <Row className="my-2">
    //       <Col>
    //         <Card.Text>${product?.price}</Card.Text>
    //       </Col>
    //       <Col>
    //         <Link to={product ? `/seller/${product?.seller?._id}` : "#"}>
    //           {product?.seller?.name}
    //         </Link>
    //       </Col>
    //     </Row>
    //     {product.countInStock === 0 ? (
    //       <Button variant="light" disabled>
    //         Out of stock
    //       </Button>
    //     ) : (
    //       <Button onClick={() => addToCartHandler(product)}>Add to cart</Button>
    //     )}
    //   </Card.Body>
    // </Card>
  );
};

export default Product;
