import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CircleButton from '../CircleButton/CircleButton'
import ApiContext from '../ApiContext'
import { countNotesForFolder } from '../notes-helpers'
import './NoteListNav.css'
import config from '../config'

export default class NoteListNav extends React.Component {
  static defaultProps ={
    history: {
      push: () => { }
    },
  }

  static contextType = ApiContext;

  // implement a refresh page in order to clear any associated notes with the deleted folder
  refreshPage() {
    window.location.reload(false);
  }

  handleClickDelete = e => {
    e.preventDefault()
    const folder_id = Number(this.props.match.params.folder_id)

    fetch(`${config.API_ENDPOINT}/folders/${folder_id}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json'
      },
    })
    .then(() => {
      this.context.deleteFolder(folder_id)
      this.props.history.push('/')
      this.refreshPage()
    })
    .catch(error => {
      console.error({ error })
    })
  }

  render() {
    const { folders=[], notes=[] } = this.context
    return (
      <div className='NoteListNav'>
        <ul className='NoteListNav__list'>
          {folders.map(folder =>
            <li key={folder.id}>
              <NavLink
                className='NoteListNav__folder-link'
                to={`/folder/${folder.id}`}
              >
                <span className='NoteListNav__num-notes'>
                  {countNotesForFolder(notes, folder.id)}
                </span>
                {folder.name}
              </NavLink>
              <br />
              <button
                className='Note__delete'
                type='button'
                onClick={this.handleClickDelete}
              >
                <FontAwesomeIcon icon='trash-alt' />
                {' '}
              </button>
              <div className='NoteListMain__button-container'>
                <CircleButton
                  tag={Link}
                  to={`/folders/${folder.id}`}
                  type='button'
                  className='NoteListNav__edit-folder-button'
                >
                  <FontAwesomeIcon icon='edit' />
                  <br />
                </CircleButton>
              </div>
            </li>
          )}
        </ul>
        <div className='NoteListNav__button-wrapper'>
          <CircleButton
            tag={Link}
            to='/add-folder'
            type='button'
            className='NoteListNav__add-folder-button'
          >
            <FontAwesomeIcon icon='plus' />
            <br />
            Folder
          </CircleButton>
        </div>
      </div>
    )
  }
}