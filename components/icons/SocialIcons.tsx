export function FacebookIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13.5 9.2H15V6.6h-1.8c-2.1 0-3.4 1.3-3.4 3.5V11H8v2.6h1.8V21h2.7v-7.4h2.1l.4-2.6h-2.5v-.7c0-.7.3-1.1 1-1.1Z" />
    </svg>
  );
}

export function MapPinIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2C7.9 2 4.5 5.4 4.5 9.6c0 5.6 6.4 11.6 6.7 11.8.2.2.5.2.7 0 .3-.2 6.7-6.2 6.7-11.8C18.5 5.4 15.1 2 12 2Zm0 10.3a2.8 2.8 0 1 1 0-5.6 2.8 2.8 0 0 1 0 5.6Z" />
    </svg>
  );
}

export function PhoneIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M7.1 10.9c1.3 2.7 3.5 4.9 6.2 6.2l1.9-1.9c.3-.3.7-.4 1-.2.9.4 1.9.5 2.9.5.6 0 1 .5 1 1v2.9c0 .6-.4 1-1 1C9.7 20.4 3.6 14.3 3.6 5.9c0-.6.5-1 1-1h2.9c.6 0 1 .4 1 1 0 1 .2 2 .5 2.9.1.3.1.7-.2 1L7.1 11Z" />
    </svg>
  );
}
