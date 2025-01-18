import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card className="card" sx={{ my:2 }}>
      <CardMedia
        component="img"
        alt={product.name}
        image={product.image}
      />
      <CardContent>
        <Typography gutterBottom component="div">
          {product.name}
        </Typography>
        <Typography gutterBottom component="div">
          <strong>${product.cost}</strong>
        </Typography>
        <Rating value={product.rating} readOnly />
      </CardContent>

      <CardActions>
        <Button
          className="card-button"
          variant="contained"
          color="primary"
          startIcon={<AddShoppingCartOutlined />}
          onClick={() => handleAddToCart(product._id)}
          fullWidth
        >
          ADD TO CART
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
