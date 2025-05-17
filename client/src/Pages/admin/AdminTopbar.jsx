import { useEffect } from "react";

const AdminTopbar = () => {
  useEffect(() => {
    console.log("🟡 AdminTopbar rendered");
  }, []);

  return (
    <div style={{ backgroundColor: "yellow", padding: "30px", textAlign: "center" }}>
      <h1>🔧 AdminTopbar Component</h1>
    </div>
  );
};

export default AdminTopbar;
