import React from "react";

function CartID() {
  // Function to generate a random string with the desired length
  const generateRandomString = () => {
    const length = 30; // Desired length of the random string
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; // Characters to choose from
    let randomString = "";

    for (let i = 0; i < length; i++) {
      // Generate a random index to select a character from the 'characters' string
      const randomIndex = Math.floor(Math.random() * characters.length);
      // Append the selected character to the 'randomString'
      randomString += characters.charAt(randomIndex);
    }

    try {
      // Store the generated 'randomString' in localStorage for later use
      localStorage.setItem("cart_id", randomString);
    } catch (error) {
      console.error("Error storing cart_id in localStorage:", error);
    }

    return randomString;
  };

  try {
    // Function to check if the cart_id exists in localStorage
    const existingCartId = localStorage.getItem("cart_id");

    if (!existingCartId) {
      // Cart ID doesn't exist in localStorage, generate and add it
      return generateRandomString();
    }

    // Return the existing cart_id
    return existingCartId;
  } catch (error) {
    console.error("Error accessing localStorage:", error);
    // If localStorage is not available, generate a new cart ID
    return generateRandomString();
  }
}

export default CartID;
