function secondToMinute(second: number): string {
  let transformInt: (num: number) => string = num => {
    let temp = String(num);
    temp = temp.substring(0, temp.indexOf('.'));
    //以下两行为了美观
    while (temp.length < 2) {
      temp = "0" + temp;
    }
    return temp;
  };
  let m: string = transformInt(second / 60);//minute
  let s: string = transformInt(second % 60);//second
  return `${m}:${s}`;
}

export default {
  secondToMinute
};