
function dateFormat(fmt: string, date: Date) {
  let ret;
  const opt: any = {
    "Y+": date.getFullYear().toString(),        // 年
    "m+": (date.getMonth() + 1).toString(),     // 月
    "d+": date.getDate().toString(),            // 日
    "H+": date.getHours().toString(),           // 时
    "M+": date.getMinutes().toString(),         // 分
    "S+": date.getSeconds().toString()          // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (const k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")));
    }
  }
  return fmt;
}

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

  return `${transformInt(second / 60)}:${transformInt(second % 60)}`;
}


/**
 * 计算值的百分比 
 * @return 0 ~ 100
 */
function computedPercent(currentNum: number, maxNum: number): number {
  return currentNum * 100 / maxNum;
}

/**
 * 将数字转换成中文表达
 * @param num 数字
 * @param split 截取到某一位, 'undefined'保存到最大的那位, '个'全部保存
 * @example transformNumberToC(111001, '千'); return 11万1千,
 *          transformNumberToC(111001); return 11万1千001
 * 
 */
function transformNumberToC(num: number, split?: '个' | '千' | '万' | '亿'): string {

  let result: string[] = [];
  const sNum = String(num);
  const len = sNum.length;
  let lastIndex;

  for (let i = len - 1; i >= 0; i--) {

    if (i === len - 3 && sNum.substr(i, 3) === '000') {
      result = [];
    } else if (i < len - 3) {

      if (i === len - 4 && sNum.charAt(i) !== '0') {
        result.unshift(sNum.charAt(i) + '千');
        lastIndex = i + 1;
      } else if (i === len - 5 && sNum.substr(Math.max(0, i - 4), 3) !== '000') {
        result.unshift(sNum.charAt(i) + '万');
        lastIndex = i + 1;
      } else if (i === len - 9 && sNum.charAt(i) !== '0') {
        result.unshift(sNum.charAt(i) + '亿');
        lastIndex = i + 1;
      } else {
        result.unshift(sNum.charAt(i));
      }

    } else {
      result.unshift(sNum.charAt(i));
    }
  }

  if (lastIndex && !split) {
    return result.join('').substring(0, lastIndex + 1);
  } else if (split) {
    const splitIndex = result.join('').indexOf(split);
    if (splitIndex !== -1) {
      return result.join('').substring(0, splitIndex + 1);
    }
  }

  return result.join('');
}

export {
  secondToMinute,
  computedPercent,
  transformNumberToC,
  dateFormat
};