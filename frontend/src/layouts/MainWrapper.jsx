import { useEffect, useState } from "react";
import { setUser } from "../utils/auth";

const MainWrapper = ({ children }) => {
  // Initialize the 'loading' state variable and set its initial value to 'true'
  const [loading, setLoading] = useState(true);

  // Define a useEffect hook to handle side effects after component mounting
  useEffect(() => {
    // Define an asynchronous function 'handler' with timeout
    const handler = async () => {
      // Set the 'loading' state to 'true' to indicate the component is loading
      setLoading(true);

      // Create a timeout promise to prevent hanging indefinitely
      const timeoutPromise = new Promise((resolve) => {
        setTimeout(() => resolve(), 3000); // 3 second timeout
      });

      // Race between setUser and timeout
      try {
        await Promise.race([setUser(), timeoutPromise]);
      } catch (error) {
        // Silently handle errors - don't block page load
        console.error("Auth check error:", error);
      } finally {
        // Always show content after timeout or completion
        setLoading(false);
      }
    };

    // Call the 'handler' function immediately after the component is mounted
    handler();
  }, []);

  // Show loading spinner instead of blank page, then render children
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #000",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        ></div>
        <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
      </div>
    );
  }

  return <>{children}</>;
};

export default MainWrapper;
