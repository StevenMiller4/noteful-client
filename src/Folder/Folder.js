import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ApiContext from '../ApiContext'
import config from '../config'
import './Folder.css'
import CircleButton from '../CircleButton/CircleButton'
import { countNotesForFolder } from '../notes-helpers'

class Folder extends React.Component {
    static defaultProps = {
        onDeleteFolder: () => {},
    }

    static contextType = ApiContext;

    handleClickDelete = e => {
        e.preventDefault()
        const folder_id = this.props.id

        fetch(`${config.API_ENDPOINT}/folders/${folder_id}`, {
            method: 'DELETE',
            headers:  {
                'content-type': 'application/json'
            },
        })
        .then(() => {
            this.context.deleteFolder(folder_id)
            this.props.onDeleteFolder(folder_id)
        })
        .catch(error => {
            console.error({ error })
        })
    }

    render() {
        const { name, id, notes=[] } = this.props
        return (
            <div className='Folder'>
                <h2 className='Folder__title'>
                    <NavLink 
                        className='Folder__folder-link'
                        to={`/folder/${id}`}
                    >
                        <span className='Folder__num-notes'>
                            {countNotesForFolder(notes, id)}
                        </span>
                            {name}
                    </NavLink>
                </h2>
                <br />
                <div className='Folder__folder-container'>
                    <button
                        className='Folder__delete'
                        type='button'
                        id={this.props.id}
                        onClick={this.handleClickDelete}
                    >
                        <FontAwesomeIcon icon='trash-alt' />
                        {' '}
                    </button>
                    <CircleButton
                        tag={Link}
                        to={`/folder/${id}`}
                        type='button'
                        className='Folder__edit-folder-button'
                    >
                        <FontAwesomeIcon icon='edit' />
                        <br />
                    </CircleButton>
                </div>
            </div>
        )

    }

}

export default Folder;