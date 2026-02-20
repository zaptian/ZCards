export function mmToPx(mm,dpi=300) {
  if (mm==null) return null;
  return Math.round((mm*dpi)/25.4);
}
export function pxToMm(px,dpi=300) {
  if (px == null) return null;
  return (px*25.4)/dpi;
}
