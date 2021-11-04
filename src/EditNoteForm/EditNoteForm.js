import React, { Component } from  'react';
import PropTypes from 'prop-types';
import ApiContext from '../ApiContext';
import config from '../config'

const Required = () => (
  <span className='EditNote__required'>*</span>
)

class EditNoteForm extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.object,
    }),
    history: PropTypes.shape({
      push: PropTypes.func,
    }).isRequired,
  };

  static contextType = ApiContext;

  state = {
    error: null,
    id: '',
    name: '',
    content: '',
    folder_id: '',
  };

  handleChangeName = e => {
    this.setState({ name: e.target.value })
  };

  handleChangeContent = e => {
    this.setState({ content: e.target.value })
  };

  handleFolderChange = e => {
    const { value } = e.target;
    this.setState({
      folder_id: value
    });
  }

  handleSubmit = e => {
    e.preventDefault()
    const { noteId } = this.props.match.params
    const { id, name, content, folder_id } = this.state
    const newNote = { id, name, content, folder_id }
    const url = config.API_ENDPOINT + `/notes/${noteId}`;
    fetch(url, {
      method: 'PATCH',
      body: JSON.stringify(newNote),
      headers: {
        'content-type': 'application/json',
      },
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(error => Promise.reject(error))
      })
      .then(() => {
        this.resetFields(newNote)
        this.context.updateNote(newNote)
        this.props.history.push('/')
      })
      .catch(error => {
        console.error(error)
        this.setState({ error })
      })
  }

  resetFields = (newFields) => {
    this.setState({
      id: newFields.id || '',
      name: newFields.name || '',
      content: newFields.content || '',
      folder_id: newFields.folder_id || '',
    })
  }

  handleClickCancel = () => {
    this.props.history.push('/')
  };

  render() {
    const { error, name, content } = this.state;
    const { folders=[] } = this.context
    return (
      <section className='EditNote'>
        <h2>Edit note</h2>
        <form
          className='EditNote__form'
          onSubmit={this.handleSubmit}
        >
          <div className='EditNote__error' role='alert'>
            {error && <p>{error.message}</p>}
          </div>
          <input
            type='hidden'
            name='id'
          />
          <div>
            <label htmlFor='name'>
              Name
              {' '}
              <Required />
            </label>
            <input
              type='text'
              name='name'
              id='name'
              placeholder='Note Name'
              required
              value={name}
              onChange={this.handleChangeName}
            />
          </div>
          <div>
            <label htmlFor='content'>
              Content
            </label>
            <textarea
              name='content'
              id='content'
              value={content}
              onChange={this.handleChangeContent}
            />
          </div>
          <select id='note-folder-select' name='note-folder-id' onChange={this.handleFolderChange} >
              <option value={null}>...</option>
              {folders.map(folder =>
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              )}
            </select>
          <div className='EditBookmark__buttons'>
            <button type='button' onClick={this.handleClickCancel}>
              Cancel
            </button>
            {' '}
            <button type='submit'>
              Save
            </button>
          </div>
        </form>
      </section>
    );
  }
}

export default EditNoteForm;