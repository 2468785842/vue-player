function secondToMinute(second: number): string {

  const transformInt: (num: number) => string = num => {
    let temp: string = String(num);
    const index: number = temp.indexOf('.');

    if (index > 0)
      temp = temp.substring(0, index);

    //以下两行为了美观
    while (temp.length < 2) {
      temp = "0" + temp;
    }

    return temp;
  };

  const m: string = transformInt(second / 60);//minute
  const s: string = transformInt(second % 60);//second

  return `${m}:${s}`;
}


/**
 * 计算值的百分比 
 * @return 0 ~ 100
 */
function computedPercent(currentNum: number, maxNum: number): number {
  return currentNum * 100 / maxNum;
}

export default {
  secondToMinute,
  computedPercent
};