export default class NumberUtil {
  static numberWithCommas(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  static lamTronSo = (number: number) => {
    var lamTron = Math.round(number * 100) / 100; // Làm tròn đến 3 chữ số thập phân
    if (lamTron % 1 === 0) {
      return Math.round(lamTron)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        .replace(/\./g, ','); // Trả về số nguyên nếu không có dư
    } else {
      return lamTron
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        .replace(/\./g, ','); // Trả về số thập phân nếu có dư
    }
  };
  static formatNumberToTrieuTy = (value: number) => {
    if (value >= 1000000000) {
      return NumberUtil.lamTronSo(value / 1000000000) + ' tỷ';
    } else if (value >= 1000000) {
      return NumberUtil.lamTronSo(value / 1000000) + ' triệu';
    } else if (value >= 1000) {
      return NumberUtil.lamTronSo(value / 1000) + ' nghìn';
    } else {
      return value.toString();
    }
  };
}
