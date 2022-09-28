import { Blocks } from "react-loader-spinner";

function LoadingBox() {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <Blocks
        visible={true}
        height="100"
        width="100"
        ariaLabel="blocks-loading"
        wrapperStyle={{}}
        wrapperClass="blocks-wrapper"
      />
    </div>
  );
}

export default LoadingBox;
