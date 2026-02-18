import logoJson from "../../../../../figmafiles/Logo-Default.json";

export function Logo() {
  const logo = logoJson.uogLogo;

  if (!logo?.pngUrl) {
    return <div>Logo missing</div>;
  }

  return (
    <img
      src={logo.pngUrl}
      alt="Logo"
      style={{
        height: "40px",
        width: "auto",
        objectFit: "contain",
      }}
    />
  );
}
