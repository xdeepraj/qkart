import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";

import React from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 *
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 *
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */
export const generateCartItemsFrom = (cartData, productsData) => {
  if (!cartData || !productsData) return [];
  return cartData
    .map((ele) => {
      const product = productsData.find(
        (product) => product._id === ele.productId
      );
      if (product) return { ...product, qty: ele.qty };
      return null;
    })
    .filter((item) => item !== null);
};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items = []) => {
  return items.reduce((total, item) => {
    return total + item.qty * item.cost;
  }, 0);
};

/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 *
 * @param {Number} value
 *    Current quantity of product in cart
 *
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 *
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 *
 *
 */
const ItemQuantity = ({ value, handleAdd, handleDelete, isReadOnly }) => {
  return (
    <Stack direction="row" alignItems="center" justifyContent="flex-start">
      {!isReadOnly && (
        <IconButton size="small" color="primary" onClick={handleDelete}>
          <RemoveOutlined />
        </IconButton>
      )}
      {isReadOnly && (
        <Box padding="0.5rem" data-testid="item-qty">
          <p>Qty:</p>
        </Box>
      )}
      <Box padding="0.5rem" data-testid="item-qty">
        {value}
      </Box>
      {!isReadOnly && (
        <IconButton size="small" color="primary" onClick={handleAdd}>
          <AddOutlined />
        </IconButton>
      )}
    </Stack>
  );
};

function getTotalItems(items) {
  return (
    <div>
      <Box fontWeight="800">Order details</Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <p>Products</p>
        <p>{items.length}</p>
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <p>Subtotal</p>
        <p>${getTotalCartValue(items)}</p>
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <p>Shipping charges</p>
        <p>$0</p>
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <p style={{ fontWeight: 800 }}>Total</p>
        <p>${getTotalCartValue(items)}</p>
      </Box>
    </div>
  );
}

/**
 * Component to display the Cart view
 *
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 *
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 *
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 *
 *
 */
const Cart = ({ products, items = [], handleQuantity, isReadOnly = false }) => {
  const history = useHistory();

  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box className="cart">
        {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}

        {items.map((ele) => (
          <Box
            display="flex"
            alignItems="flex-start"
            padding="1rem"
            key={ele._id}
          >
            <Box className="image-container">
              <img src={ele.image} alt={ele.name} width="30px" height="30px" />
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              height="6rem"
              paddingX="1rem"
            >
              <div>{ele.name}</div>

              <Box
                display="flex"
                justifyContent="flex-start"
                alignItems="center"
              >
                <ItemQuantity
                  value={ele.qty}
                  handleAdd={() => handleQuantity(ele._id, "add")}
                  handleDelete={() => handleQuantity(ele._id, "delete")}
                  isReadOnly={isReadOnly}
                />

                <Box padding="0.5rem" fontWeight="700">
                  ${ele.cost}
                </Box>
              </Box>
            </Box>
          </Box>
        ))}

        <Box>
          <Box
            padding="1rem"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box color="#3C3C3C" alignSelf="center">
              Order total
            </Box>
            <Box
              color="#3C3C3C"
              fontWeight="700"
              fontSize="1.5rem"
              alignSelf="center"
              data-testid="cart-total"
            >
              ${getTotalCartValue(items)}
            </Box>
          </Box>
          {!isReadOnly && (
            <Box
              display="flex"
              justifyContent="flex-end"
              className="cart-footer"
            >
              <Button
                color="primary"
                variant="contained"
                startIcon={<ShoppingCart />}
                className="checkout-btn"
                onClick={() => history.push("/checkout")}
              >
                Checkout
              </Button>
            </Box>
          )}
        </Box>
      </Box>
      {isReadOnly && (
        <Box className="cart" padding="1.5rem 0.5rem">
          {getTotalItems(items)}
        </Box>
      )}
    </>
  );
};

export default Cart;
