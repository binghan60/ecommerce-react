import { Helmet } from "react-helmet-async";
function Dashboard() {
  return (
    <>
      <Helmet>
        <title className="text-center">管理後臺</title>
      </Helmet>
      <h3>dashboard</h3>
    </>
  );
}

export default Dashboard;
