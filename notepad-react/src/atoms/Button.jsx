export default function Button(props) {
  return (
    <button className={props.className} type={props.type}>
      {props.text}
    </button>
  );
}
