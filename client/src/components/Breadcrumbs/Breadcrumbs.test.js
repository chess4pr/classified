import React from 'react';
import { shallow } from 'enzyme';
import Breadcrumbs from './Breadcrumbs';

describe('<Breadcrumbs />', () => {
  test('renders', () => {
    const wrapper = shallow(<Breadcrumbs />);
    expect(wrapper).toMatchSnapshot();
  });
});
