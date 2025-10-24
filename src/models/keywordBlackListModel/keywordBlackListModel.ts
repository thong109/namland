export class keywordBlackListModel {
  id?: string;
  value?: string;

  public static assign(obj) {
    if (!obj) return undefined;

    const newObj = Object.assign(new keywordBlackListModel(), obj);

    return newObj;
  }

  public static assigns<T>(objs) {
    const results: any[] = [];
    objs.forEach((item) => results.push(this.assign(item)));

    return results;
  }
}
