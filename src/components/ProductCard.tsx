import { Button, Card, Stack } from "react-bootstrap";
import { ProductT } from "@/model/types/types";
import style from "./productcard.module.css";
import Link from "next/link";
import { MouseEvent, useState } from "react";
// import useUserStatus from "../hooks/useUserStatus";
import { baseUrl } from "@/app/lib/urls";
// import { addProductToList } from "../utils/addProductToList";
import ModalAlert from "../components/ModalAlert";

type ProductCardProps = {
  product: ProductT;
};

function ProductCard({ product }: ProductCardProps) {
  // const { token, setUser } = useUserStatus(); //!change for session
  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState("");

  const handleAddProductToList = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    //! Create this function or action in Lib
    // await addProductToList({
    //   productId: product._id,
    //   //token,
    //   baseUrl,
    //  // setUser,
    //   setShowAlert,
    //   setAlertText,
    // });
  };

  return (
    <>
      <Card
        className={`${style.zoom} ${style.card}`}
        style={{
          width: "18rem",
          boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
          textAlign: "center",
        }}
      >
        <Card.Img
          className={style.image}
          variant="top"
          src={product.images[0]}
        />
        <Card.Body className="d-flex flex-column">
          <Card.Title>{product.title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {product.price} €
          </Card.Subtitle>
          <Stack gap={3}>
            {/* Next.js Link */}
            <Link className="mb-2" href={`/products/${product._id}`}>
              Learn more
            </Link>{" "}
          </Stack>
          <Button
            className="mt-auto mx-auto"
            style={{ maxWidth: "130px" }}
            variant="warning"
            onClick={handleAddProductToList}
          >
            Add to list
          </Button>
        </Card.Body>
      </Card>
      <ModalAlert
        showAlert={showAlert}
        alertText={alertText}
        setShowAlert={setShowAlert}
      />
    </>
  );
}

export default ProductCard;
