/**
 * 实现单例模式的工具
 */
const beanContainer = new Map();

type BeanReturn = (key: string) => (argumentList?: ArrayLike<any>) => ClassDecorator;

const Bean: BeanReturn = value => (argumentList = []) => target => {
  beanContainer.set(value, Reflect.construct(target, argumentList));
};

function getBean<T>(key: string): T {
  return beanContainer.get(key);
}

const BeanUtils = {
  Bean,
  getBean
};

export default BeanUtils;