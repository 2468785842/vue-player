import BeanUtils from '@utils/BeanUtils';

@BeanUtils.Bean('a')(['张三'])
class Test1 {

  name: string;
  constructor(name: string) {
    this.name = name;
  }

}

it('test Bean decorator', () => {
  const bean = BeanUtils.getBean('a');
  console.log(JSON.stringify(bean));
});