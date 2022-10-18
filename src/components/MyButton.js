function MyButton(props) {
  const { text } = props;
  return (
    <button
      type="button"
      className="Mybutton fs-5"
    >
      {text}
    </button>
  );
}

export default MyButton;
