import React from 'react';
import { shallow } from 'enzyme';
import Ads from './Ads';

describe('<Ads />', () => {
  test('renders', () => {
    const wrapper = shallow(<Ads />);
    expect(wrapper).toMatchSnapshot();
  });
});
