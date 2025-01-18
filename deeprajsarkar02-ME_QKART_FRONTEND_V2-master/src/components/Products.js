import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  Stack,
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState, useRef } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard";
import Cart from "./Cart";
import "./Products.css";

import { generateCartItemsFrom } from "./Cart";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";


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

const Products = () => {
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */

  const [products, setProducts] = useState([]); //for product item
  const [loading, setLoading] = useState(false);
  const debounceTimeout = useRef(null);
  const [loggedIn, setLoggedIn] = useState(false);

  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  const [carts, setCarts] = useState([]); //for carts item
  const [cartItems, setCartItems] = useState([]); //for carts item with all data

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    performAPICall();
    setLoggedIn(Boolean(username && token));
    fetchCart();
  }, []);

  const performAPICall = async () => {
    setLoading(true);
    const url = `${config.endpoint}/products`;

    try {
      const response = await axios.get(url);
      setProducts(response.data);
    } catch (error) {
      enqueueSnackbar("Failed to fetch products. Please try again later.", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    setLoading(true);
    let url = `${config.endpoint}/products/search?value=${text}`;
    try {
      const response = await axios.get(url);
      setProducts(response.data);
    } catch (error) {
      if (error.response) {
        setProducts([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    const value = event.target.value;

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      performSearch(value);
    }, 500);
  };

  const fetchCart = async () => {
    let url = `${config.endpoint}/cart`;
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCarts(response.data);
    } catch (error) {}
  };

  useEffect(() => {
    const items = generateCartItemsFrom(carts, products);
    setCartItems(items);
  }, [carts, products]);

  function isItemInCart(productId) {
    return carts.find((item) => item.productId === productId);
  }

  const addToCart = async (productId, exp) => {
    if (productId && exp) {
      const product = cartItems.find((ele) => ele._id === productId);
      const expression = exp === "add" ? product.qty + 1 : product.qty - 1;

      if (!product) return;
      try {
        let url = `${config.endpoint}/cart`;
        const response = await axios.post(
          url,
          {
            productId: product._id,
            qty: expression,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCarts(response.data);
      } catch (error) {
        enqueueSnackbar("Failed to update quantity. Please try again.", {
          variant: "error",
        });
      }
    } else {
      if (!loggedIn) {
        enqueueSnackbar("Login to add an item to the Cart.", {
          variant: "warning",
        });
        return;
      }

      const existingItem = isItemInCart(productId);

      if (!existingItem) {
        try {
          let url = `${config.endpoint}/cart`;
          const response = await axios.post(
            url,
            {
              productId: productId,
              qty: 1,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          enqueueSnackbar("Product is added successfully to the cart.", {
            variant: "success",
          });
          setCarts(response.data);
        } catch (error) {
          enqueueSnackbar("Failed to fetch data. Please try again.", {
            variant: "error",
          });
        }
      } else {
        enqueueSnackbar(
          "Item already in cart. Use the cart sidebar to update quantity or remove item.",
          {
            variant: "warning",
          }
        );
      }
    }
  };

  return (
    <div>
      <Header hasHiddenAuthButtons={true}>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField
          className="search-desktop"
          size="small"
          fullWidth
          InputProps={{
            className: "search",
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          onChange={(event) => debounceSearch(event, debounceTimeout)}
        />
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(event) => debounceSearch(event, debounceTimeout)}
      />
      <Grid container>
        <Grid item className="product-grid" md={loggedIn ? 9 : 12} xs={12}>
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>

          <Grid
            container
            className="products-container"
            spacing={2}
            sx={{ px: 1 }}
          >
            {loading ? (
              <Stack direction="column" className="loading">
                <CircularProgress />
                <p>Loading Products</p>
              </Stack>
            ) : !loading && products.length === 0 ? (
              <Stack direction="column" className="loading">
                <SentimentDissatisfied />
                <p>No products found</p>
              </Stack>
            ) : (
              products.map((product) => (
                <Grid item xs={6} md={3} key={product._id}>
                  <ProductCard product={product} handleAddToCart={addToCart} />
                </Grid>
              ))
            )}
          </Grid>
        </Grid>
        {loggedIn && (
          <Grid item md={3} xs={12} className="product-cart">
            <Cart
              products={products}
              items={cartItems}
              handleQuantity={addToCart}
            />
          </Grid>
        )}
      </Grid>
      <Footer />
    </div>
  );
};

export default Products;
