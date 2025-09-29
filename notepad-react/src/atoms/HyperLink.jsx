export default function Link(props) {
  return (
    <a className={props.className} Link={props.Link}>
      {props.text}
    </a>
  );
}
