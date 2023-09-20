export const initialState = {
  product: null,
  errorMessage: null,
  loading: false,
};

export const productReducer = (state, action) => {
  console.log('reducer', action);
  switch (action.type) {
    case "PRODUCT_REQUEST":
      return { ...state, loading: true };

    case "GET_PRODUCT_DETAIL_SUCCESS":
      return { ...state, product: action.payload };

    case "LIKE_PRODUCT":
      return { ...state, product: action.payload };

    case "DISLIKE_PRODUCT":
      return { ...state, product: action.payload };

    case "END_PRODUCT_REQUEST":
      return { ...state, loading: false };

    case "PRODUCT_ERROR":
      return { ...state, errorMessage: action.payload };

    default:
      throw new Error();
  }
};
