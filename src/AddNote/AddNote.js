import React, { Component, } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import ApiContext from '../ApiContext'
import config from '../config'
import './AddNote.css'
import PropTypes from 'prop-types'

class AddNote extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      content: '',
      folderId: null
    }
  }

  static defaultProps = {
    history: {
      push: () => { }
    },
  }

  static contextType = ApiContext;

  handleTitleChange = e => {
    const { value } = e.target;
    this.setState({
      title: value
    });
  };

  handleContentChange = e => {
    const { value } = e.target;
    this.setState({
      content: value
    });
  };
  
  handleSubmit = e => {
    e.preventDefault();
    const newNote = {
      name: e.target['note-name'].value,
      content: e.target['note-content'].value,
      folderId: e.target['note-folder-id'].value,
      modified: new Date(),
    }
    fetch(`${config.API_ENDPOINT}/notes`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(newNote),
    })
    .then(res => {
      if (!res.ok)
        return res.json().then(e => Promise.reject(e))
        return res.json()
    })
    .then(note => {
      this.context.addNote(note)
      this.props.history.push(`/folder/${note.folderId}`)
    })
    .catch(error => {
      console.log(error);
    })
  }

  render() {
    const { folders=[] } = this.context
    const isEnabled = this.state.title.length > 0 && this.state.content.length >0;

    return (
      <section className='AddNote'>
        <h2>Create a Note</h2>
        <p>* is required</p>
        <NotefulForm onSubmit={this.handleSubmit}>
          <div className='field'>
            <label htmlFor='note-name-input'>
              Name *
            </label>
            <input type='text' id='note-name-input' name='note-name' value={this.state.title} onChange={this.handleTitleChange} />
          </div>
          <div className='field'>
            <label htmlFor='note-content-input'>
              Content *
            </label>
            <textarea id='note-content-input' name='note-content' value={this.state.content} onChange={this.handleContentChange}/>
          </div>
          <div className='field'>
            <label htmlFor='note-folder-select'>
              Folder *
            </label>
            <select id='note-folder-select' name='note-folder-id' >
              <option value={null}>...</option>
              {folders.map(folder =>
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              )}
            </select>
          </div>
          <div className='buttons'>
            <button type='submit' disabled={!isEnabled}>
              Add note
            </button>
          </div>
        </NotefulForm>
      </section>
    )
  }
}

AddNote.propTypes = {
  
}

export default AddNote;