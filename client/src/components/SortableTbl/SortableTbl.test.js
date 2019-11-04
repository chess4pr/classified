import React from 'react';
import { shallow } from 'enzyme';
import SortableTbl from './SortableTbl';

describe('<SortableTbl />', () => {
  test('renders', () => {
    const wrapper = shallow(<SortableTbl />);
    expect(wrapper).toMatchSnapshot();
  });
});
