import React from 'react';
import { shallow } from 'enzyme';
import MyAds from './MyAds';

describe('<MyAds />', () => {
  test('renders', () => {
    const wrapper = shallow(<MyAds />);
    expect(wrapper).toMatchSnapshot();
  });
});
