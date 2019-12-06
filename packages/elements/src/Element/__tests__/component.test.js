import { shallow, mount, render } from 'enzyme'
import Component from '..'
import Content from '../../helpers/Content'

describe(Component.displayName, () => {
  it('Component renders correctly', async () => {
    const tree = shallow(<Component />)

    expect(tree).toMatchSnapshot()
  })

  it('Receives tag prop renders valid HTML DOM element', async () => {
    const tag = 'section'
    const tree = mountWithTheme(<Component tag={tag} />)

    expect(tree.html()).toContain(tag)
  })

  describe('Renders correctly empty HTML elements', () => {
    it('Receives empty tag prop and renders valid element', async () => {
      const tag = 'input'
      const tree = mountWithTheme(<Component tag={tag} />)

      expect(tree.html()).toContain(tag)
    })

    it('Receives label and does not render children', async () => {
      const tag = 'input'
      const label = 'This is a label'
      const mount = mountWithTheme(<Component tag={tag} label={label} />)
      const shallow = shallowWithTheme(<Component tag={tag} label={label} />)

      expect(mount.html()).toContain(tag)
      expect(mount.html()).not.toContain(label)
      expect(shallow.props().children).not.toEqual(label)
      expect(shallow.props().children).toEqual(undefined)
    })

    it('Receives children and does not render children', async () => {
      const tag = 'input'
      const label = 'This is a label'
      const mount = mountWithTheme(<Component tag={tag}>{label}</Component>)
      const shallow = shallowWithTheme(<Component tag={tag}>{label}</Component>)

      expect(mount.html()).toContain(tag)
      expect(mount.html()).not.toContain(label)
      expect(shallow.props().children).not.toEqual(label)
      expect(shallow.props().children).toEqual(undefined)
    })
  })

  describe('Renders correctly children', () => {
    it('Receives label prop and render as children', async () => {
      const label = 'This is a label'
      const tree = shallow(<Component label={label} />)

      expect(tree.text()).toEqual(label)
    })
    it('Receives children prop and render as children', async () => {
      const label = 'This is a label'
      const tree = shallow(<Component>{label}</Component>)

      expect(tree.text()).toEqual(label)
    })

    it('Receives children and label prop and children will have priority', async () => {
      const label = 'This is a label'
      const children = 'This is a children'
      const tree = shallow(<Component label={label}>{children}</Component>)

      expect(tree.text()).toEqual(children)
      expect(tree.text()).not.toEqual(label)
    })
  })

  describe('Render correctly before / after', () => {
    it('beforeContent element renders correctly & receives all props', async () => {
      const props = {
        beforeContent: 'This is a content',
        beforeContentCss: `font-size: 20px`,
        beforeContentDirection: 'inline',
        beforeContentAlignX: 'right',
        beforeContentAlignY: 'top'
      }

      const tree = shallow(<Component {...props} />)
      const content = tree
        .find(Content)
        .first()
        .props()

      expect(content.children).toEqual(props.beforeContent)
      expect(content.children).toEqual(props.beforeContent)
      expect(content.extendCss).toEqual(props.beforeContentCss)
      expect(content.contentDirection).toEqual(props.beforeContentDirection)
      expect(content.alignX).toEqual(props.beforeContentAlignX)
      expect(content.alignY).toEqual(props.beforeContentAlignY)
    })

    it('afterContent element renders correctly & receives all props', async () => {
      const props = {
        afterContent: 'This is a content',
        afterContentCss: `font-size: 20px`,
        afterContentDirection: 'inline',
        afterContentAlignX: 'right',
        afterContentAlignY: 'top'
      }

      const tree = shallow(<Component {...props} />)
      const content = tree
        .find(Content)
        .last()
        .props()

      expect(content.children).toEqual(props.afterContent)
      expect(content.extendCss).toEqual(props.afterContentCss)
      expect(content.contentDirection).toEqual(props.afterContentDirection)
      expect(content.alignX).toEqual(props.afterContentAlignX)
      expect(content.alignY).toEqual(props.afterContentAlignY)
    })

    it('Renders beforeContent, content & afterContent element', async () => {
      const beforeContent = 'This is a beforeContent'
      const afterContent = 'This is a afterContent'
      const label = 'This is a content'
      const tree = shallow(
        <Component
          beforeContent={beforeContent}
          afterContent={afterContent}
          label={label}
        />
      )
      expect(
        tree
          .find(Content)
          .first()
          .props().children
      ).toEqual(beforeContent)

      expect(
        tree
          .find(Content)
          .at(1)
          .props().children
      ).toEqual(label)

      expect(
        tree
          .find(Content)
          .last()
          .props().children
      ).toEqual(afterContent)
    })
  })

  describe('Wrapper has correct aligning prop', () => {
    it('use contentDirection - inline', async () => {
      const direction = 'inline'
      const tree = shallow(<Component contentDirection={direction} />)
      const wrapper = tree.props().contentDirection

      expect(wrapper).toEqual(direction)
      expect(wrapper).not.toEqual('rows')
    })

    it('use contentDirection - rows', async () => {
      const direction = 'rows'
      const tree = shallow(<Component contentDirection={direction} />)
      const wrapper = tree.props().contentDirection

      expect(wrapper).toEqual(direction)
      expect(wrapper).not.toEqual('inline')
    })

    it('use vertical prop', async () => {
      const tree = shallow(<Component vertical />)
      const wrapper = tree.props().contentDirection

      expect(wrapper).toEqual('rows')
      expect(wrapper).not.toEqual('inline')
    })

    it('use vertical prop as an object', async () => {
      const vertical = { xs: false, sm: true, md: true }
      const tree = shallow(<Component vertical={vertical} />)
      const wrapper = tree.props().contentDirection

      expect(wrapper).toHaveProperty('xs')
      expect(wrapper).toHaveProperty('sm')
      expect(wrapper).toHaveProperty('md')
      expect(wrapper).not.toHaveProperty('lg')

      expect(wrapper).toEqual({ xs: 'inline', sm: 'rows', md: 'rows' })
      expect(wrapper).not.toEqual('inline')
      expect(wrapper).not.toEqual('rows')
    })

    it('prop alignX takes precendence over contentAlignX with before / after', async () => {
      const tree = shallow(
        <Component alignX="center" contentAlignX="right" beforeContent="content" />
      )
      const wrapper = tree.props().alignX

      expect(wrapper).toEqual('center')
      expect(wrapper).not.toEqual('right')
    })

    it('prop contentAlignX takes precendence over alignX without before / after', async () => {
      const tree = shallow(<Component alignX="center" contentAlignX="right" />)
      const wrapper = tree.props().alignX

      expect(wrapper).toEqual('right')
      expect(wrapper).not.toEqual('center')
    })

    it('use alignX - default', async () => {
      const tree = shallow(<Component />)
      const wrapper = tree.props().alignX

      expect(wrapper).toEqual('left')
      expect(wrapper).not.toEqual('center')
      expect(wrapper).not.toEqual('right')
    })

    it('use alignX - left', async () => {
      const alignX = 'left'
      const tree = shallow(<Component contentAlignX={alignX} />)
      const wrapper = tree.props().alignX

      expect(wrapper).toEqual(alignX)
      expect(wrapper).not.toEqual('center')
      expect(wrapper).not.toEqual('right')
    })

    it('use alignX - right', async () => {
      const alignX = 'right'
      const tree = shallow(<Component contentAlignX={alignX} />)
      const wrapper = tree.props().alignX

      expect(wrapper).toEqual(alignX)
      expect(wrapper).not.toEqual('center')
      expect(wrapper).not.toEqual('left')
    })

    it('prop alignX takes precendence over contentAlignX with before / after', async () => {
      const tree = shallow(
        <Component alignX="center" contentAlignX="right" beforeContent="content" />
      )
      const wrapper = tree.props().alignX

      expect(wrapper).toEqual('center')
      expect(wrapper).not.toEqual('right')
    })

    it('prop contentAlignY takes precendence over alignY without before / after', async () => {
      const tree = shallow(<Component alignY="top" contentAlignY="bottom" />)
      const wrapper = tree.props().alignY

      expect(wrapper).toEqual('bottom')
      expect(wrapper).not.toEqual('top')
    })

    it('use alignY - default', async () => {
      const tree = shallow(<Component />)
      const wrapper = tree.props().alignY

      expect(wrapper).toEqual('center')
      expect(wrapper).not.toEqual('left')
      expect(wrapper).not.toEqual('right')
    })

    it('use alignY - top', async () => {
      const alignY = 'top'
      const tree = shallow(<Component contentAlignY={alignY} />)
      const wrapper = tree.props().alignY

      expect(wrapper).toEqual(alignY)
      expect(wrapper).not.toEqual('center')
      expect(wrapper).not.toEqual('bottom')
    })

    it('use alignY - bottom', async () => {
      const alignY = 'bottom'
      const tree = shallow(<Component contentAlignY={alignY} />)
      const wrapper = tree.props().alignY

      expect(wrapper).toEqual(alignY)
      expect(wrapper).not.toEqual('center')
      expect(wrapper).not.toEqual('top')
    })
  })
})
