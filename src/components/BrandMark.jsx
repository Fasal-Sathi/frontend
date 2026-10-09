export default function BrandMark({ compact = false }) {
  return (
    <div className={`flex items-center gap-3 ${compact ? "" : "min-w-0"} align-middle`}>
      <img
        src="/fasal-sathi.jpeg"
        alt="FasalSathi logo"
        className="h-16 w-auto object-contain shrink-0 self-center -translate-y-2"
      />
      <img
        src="/logo.jpeg"
        alt="National emblem"
        className="h-16 w-auto object-contain shrink-0 self-center"
      />
      <div className="brand-copy flex flex-col justify-center leading-tight self-center">
        <div className="ministry-name">MINISTRY OF AGRICULTURE AND</div>
        <div className="ministry-name ministry-name-second">FARMERS WELFARE</div>
        <div className="gov-name">Government of India</div>
      </div>
    </div>
  );
}
