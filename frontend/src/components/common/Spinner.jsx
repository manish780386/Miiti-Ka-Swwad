export default function Spinner({ size = 40 }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div
        style={{ width: size, height: size }}
        className="border-4 border-spice-200 border-t-spice-600 rounded-full animate-spin"
      />
    </div>
  );
}