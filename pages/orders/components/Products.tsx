import Image from "next/image";
import { ProductType } from "../../../src/types/types";
import styles from "./Products.module.css";

const createImagePath = (imagePath: string) => `/images/${imagePath}`;

export const Products = ({ products }: { products: ProductType[] }) => {
    return (
        <div className={styles["products-container"]}>
            <h4>Products</h4>
            {products.map((product, index) => (
                <>
                    <div key={product.id} className={styles.product}>
                        <p className={styles["product-quantity"]}>{`x ${product.quantity}`}</p>
                        <Image
                            src={createImagePath(product.image)}
                            alt={product.name}
                            width={80}
                            height={80}
                        />
                        <div className={styles["product-details"]}>
                            <span>{product.name}</span>
                            <span>{`Price: ${product.quantity} x ${product.price}€`} </span>
                        </div>

                    </div>
                    {index < products.length - 1 && <div className={styles.divider} />}
                </>
            ))}
        </div>
    );
}