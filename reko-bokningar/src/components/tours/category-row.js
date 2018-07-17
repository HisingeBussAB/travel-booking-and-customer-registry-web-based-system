import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import faSave from '@fortawesome/fontawesome-free-solid/faSave'
import faSquare from '@fortawesome/fontawesome-free-regular/faSquare'
import faCheckSquare from '@fortawesome/fontawesome-free-regular/faCheckSquare'
import faTrashAlt from '@fortawesome/fontawesome-free-regular/faTrashAlt'
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'
import {getItem, saveItem} from '../../actions'

class CategoriesRow extends Component {
  /* NOTICE
  this.props.id
  recives -1 for new item
  output for new item must be id: 'new'
  */

  constructor (props) {
    super(props)
    const {category = ''} = this.props
    this.state = {
      updatingSave  : false,
      updatingActive: false,
      deleting      : false,
      category      : category
    }
  }

  componentWillReceiveProps (nextProps) {
    const {id = 'new', category = 'new', isActive = true} = this.props
    if (nextProps.id !== id) {
      // for some reason id changed, component state needs reset.
      this.setState({
        category      : nextProps.category,
        updatingSave  : false,
        updatingActive: false,
        deleting      : false
      })
    }
    // cancel loaders on changes recived
    if (nextProps.category !== category) {
      this.setState({updatingSave: false})
    }
    if (nextProps.isActive !== isActive) {
      this.setState({updatingActive: false})
    }
  }

  handleCategoryChange = (val) => {
    this.setState({category: val})
  }

  saveCategory = async (e) => {
    e.preventDefault()
    const {saveItem, isNew = false, isActive, id = 'new', remove = () => {}, index = null, submitToggle} = this.props
    const {category} = this.state
    submitToggle(true)
    const action = isNew ? 'new' : 'save'
    const data = {
      category  : category,
      active    : isActive,
      categoryid: isNew ? 'new' : id,
      task      : 'save'
    }

    if (await saveItem('categories', data, action)) {
      remove(index)
      submitToggle(false)
    } else {
      submitToggle(false)
    }
  }

  toggleActive = async (e, toggle) => {
    e.preventDefault()
    const {category} = this.state
    const {saveItem, isActive, id = 'new', submitToggle} = this.props
    submitToggle(true)
    const data = {
      category  : category,
      active    : isActive,
      categoryid: id,
      task      : 'activetoggle'
    }

    if (await saveItem('categories', data, 'save')) {
      submitToggle(false)
    } else {
      submitToggle(false)
    }
  }

  doDelete = async (e) => {
    e.preventDefault()
    const {category} = this.state
    const {saveItem, isNew = false, isActive, id = 'new', submitToggle, index = null, remove = () => {}} = this.props
    submitToggle(true)
    if (!isNew) {
      const data = {
        category  : category,
        active    : !isActive,
        categoryid: id,
        task      : 'delete'
      }

      if (await saveItem('categories', data, 'delete')) {
        submitToggle(false)
      } else {
        submitToggle(false)
      }
    } else {
      remove(index)
      submitToggle(false)
    }
  }

  render () {
    const {category: propsCategory = 'new', isActive: propsActive = false, isNew} = this.props
    const {
      category: stateCategory = 'new',
      updatingSave = false,
      updatingActive = false,
      deleting = false
    } = this.state
    return (
      <tr>
        <td className="align-middle pr-3 py-2 w-50">
          <input value={stateCategory} onChange={(e) => this.handleCategoryChange(e.target.value)} placeholder="Kategorinamn" type="text" className="rounded w-100" maxLength="35" style={{minWidth: '200px'}} />
        </td>
        <td className="align-middle px-3 py-2 text-center">
          {(((stateCategory === '' || stateCategory) !== undefined && stateCategory !== propsCategory)) && !updatingSave &&
            <span title="Spara ändring i kategorin" className="primary-color custom-scale"><FontAwesomeIcon icon={faSave} size="2x" onClick={(e) => this.saveCategory(e)} /></span>}
          {updatingSave &&
            <span title="Sparar ändring i kategorin..." className="primary-color"><FontAwesomeIcon icon={faSpinner} size="2x" pulse /></span> }
        </td>
        <td className="align-middle px-3 py-2 text-center">
          {updatingActive &&
            <span title="Sparar aktiv status..." className="primary-color"><FontAwesomeIcon icon={faSpinner} size="2x" pulse /></span> }
          {!updatingActive && propsActive && !isNew &&
            <span title="Inaktivera denna kategori" className="primary-color custom-scale"><FontAwesomeIcon icon={faCheckSquare} size="2x" onClick={(e) => this.toggleActive(e, false)} /></span> }
          {!updatingActive && !propsActive && !isNew &&
            <span title="Aktivera denna kategori" className="primary-color custom-scale"><FontAwesomeIcon icon={faSquare} onClick={(e) => this.toggleActive(e, true)} size="2x" /></span> }
          {!updatingActive && isNew &&
            <span title="Spara kategorin först" className="text-secondary custom-scale"><FontAwesomeIcon icon={faCheckSquare} size="2x" onClick={null} /></span> }

        </td>
        <td className="align-middle pl-3 py-2 text-center">
          {!deleting &&
          <span title="Ta bord denna kategori permanent" className="danger-color custom-scale"><FontAwesomeIcon icon={faTrashAlt} onClick={(e) => this.doDelete(e)} size="2x" /></span>}
          {deleting &&
            <span title="Inaktivera denna kategori" className="danger-color"><FontAwesomeIcon icon={faSpinner} size="2x" pulse /></span>}
        </td>
      </tr>
    )
  }
}

CategoriesRow.propTypes = {
  category    : PropTypes.string,
  id          : PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isActive    : PropTypes.bool,
  isNew       : PropTypes.bool,
  submitToggle: PropTypes.func,
  getItem     : PropTypes.func,
  saveItem    : PropTypes.func,
  index       : PropTypes.number,
  remove      : PropTypes.func
}

const mapDispatchToProps = dispatch => bindActionCreators({
  getItem,
  saveItem
}, dispatch)

export default connect(null, mapDispatchToProps)(CategoriesRow)
