export default function Input(props) {
  return (
    <input
      type={props.type}
      placeholder={props.placeholder}
      name={props.name}
      className={props.className}
      onChange={props.onChange}
    ></input>
  );
}
