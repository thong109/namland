/**
 * Format diện tích theo đơn vị phù hợp:
 * - Nếu < 10.000 m² → hiển thị m²
 * - Nếu >= 10.000 m² → chuyển sang ha
 * @param m2 - diện tích (mét vuông)
 * @param decimals - số chữ số thập phân khi hiển thị ha
 * @returns string ví dụ: "850 m²" hoặc "1.25 ha"
 */
export function formatArea(m2: number, decimals: number = 2): string {
  if (isNaN(m2) || m2 <= 0) return '0 m²';

  if (m2 < 10_000) {
    return `${Number(m2.toFixed(0)).toLocaleString()} m²`;
  } else {
    const ha = m2 / 10_000;
    return `${ha.toFixed(decimals)} ha`;
  }
}