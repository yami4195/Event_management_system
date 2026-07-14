import "./LoadingSpinner.css";

const LoadingSpinner = ({ size = "md", text = "" }) => {
  return (
    <div className="spinner-wrapper" id="loading-spinner">
      <div className={`spinner spinner--${size}`}>
        <div className="spinner__ring" />
      </div>
      {text && <p className="spinner__text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
