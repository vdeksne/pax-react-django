import { useEffect, useState } from "react";
import useAxios from "../../utils/useAxios";
import { Navigate } from "react-router-dom";
import { isLoggedIn } from "./auth";

const Private = () => {
  const [res, setRes] = useState("");
  const [posRes, setPostRes] = useState("");
  const api = useAxios();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("user/test/");
        setRes(response.data.response);
      } catch (error) {
        setPostRes(error.response.data);
      }
    };
    fetchData();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("user/test/", {
        text: e.target[0].value,
      });
      setPostRes(response.data.response);
    } catch (error) {
      setPostRes(error.response.data);
    }
  };
  return (
    <section>
      <h1>Private</h1>
      <p>{res}</p>
      <form method="POST" onSubmit={handleSubmit}>
        <input type="text" placeholder="Enter Text" />
        <button type="submit">Submit</button>
      </form>
      {posRes && <p>{posRes}</p>}
    </section>
  );
};

export default function PrivateRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" />;
}
