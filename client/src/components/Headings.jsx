export default function Headings({ title, text }) {
  return (
    <div className="py-3">
      <h1 className="fw-bold fs-1 text-capitalize">
        <p className="fs-6">{text}</p>
        {title}
      </h1>
    </div>
  );
}
