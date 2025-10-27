export default function Input(props) {
  return (
    <input
      type={props.type}
      placeholder={props.placeholder}
      name={props.name}
      accept={props.accept}
      className={props.className}
      value={props.value}
      onChange={props.onChange}
      autoFocus={props.autoFocus}
    ></input>
  );
}
