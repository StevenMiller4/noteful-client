import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import NoteListNav from '../NoteListNav/NoteListNav'
import NotePageNav from '../NotePageNav/NotePageNav'
import NoteListMain from '../NoteListMain/NoteListMain'
import NotePageMain from '../NotePageMain/NotePageMain'
import AddFolder from '../AddFolder/AddFolder'
import AddNote from '../AddNote/AddNote'
import EditFolderForm from '../EditFolderForm/EditFolderForm'
import EditNoteForm from '../EditNoteForm/EditNoteForm'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import ApiContext from '../ApiContext'
import config from '../config'
import './App.css'

class App extends Component {
  state = {
    notes: [],
    folders: [],
  };

  componentDidMount() {
    Promise.all([
      fetch(`${config.API_ENDPOINT}/notes`),
      fetch(`${config.API_ENDPOINT}/folders`)
    ])
      .then(([notesRes, foldersRes]) => {

        if (!notesRes.ok)
          return notesRes.json().then(e => Promise.reject(e))
        if (!foldersRes.ok)
          return foldersRes.json().then(e => Promise.reject(e))

        return Promise.all([
          notesRes.json(),
          foldersRes.json(),
        ])
      })
      .then(([notes, folders]) => {
        this.setState({ notes, folders })
      })
      .catch(error => {
        console.error({ error })
      })
  }

  handleAddFolder = folder => {
    this.setState({
      folders: [
        ...this.state.folders,
        folder
      ]
    })
  }

  handleAddNote = note => {
    this.setState({
      notes: [
        ...this.state.notes,
        note
      ]
    })
  }
  
  handleDeleteFolder = folder_id => {
    this.setState({
      folders: this.state.folders.filter(folder => folder.id !== Number(folder_id))
    })
  }

  handleDeleteNote = noteId => {
    this.setState({
      notes: this.state.notes.filter(note => note.id !== noteId)
    })
  }

  renderNavRoutes() {
    return (
      <>
        <ErrorBoundary>
          {['/', '/folder/:folder_id'].map(path =>
            <Route
              exact
              key={path}
              path={path}
              component={NoteListNav}
            />
          )}
          <Route
            path='/note/:noteId'
            component={NotePageNav}
          />
          <Route
            path='/add-folder'
            component={NotePageNav}
          />
          <Route
            path='/add-note'
            component={NotePageNav}
          />
          <Route
            path='/note/:noteId'
            component={EditNoteForm}
          />
        </ErrorBoundary>
      </>
    )
  }

  renderMainRoutes() {
    return (
      <>
        {['/', '/folder/:folder_id'].map(path =>
          <Route
            exact
            key={path}
            path={path}
            component={NoteListMain}
          />
        )}
        <Route
          path='/note/:noteId'
          component={NotePageMain}
        />
        <ErrorBoundary>
          <Route
            path='/add-folder'
            component={AddFolder}
          />
        </ErrorBoundary>
        <ErrorBoundary>
          <Route
            path='/add-note'
            component={AddNote}
          />
        </ErrorBoundary>
        <Route
              path='/folder/:folder_id'
              component={EditFolderForm}
        />
      </>
    )
  }

  updateFolder = updatedFolder => {
    this.setState({
      folders: this.state.folders.map(folder =>
        (folder.id !== updatedFolder.id) ? folder : updatedFolder
      )
    })
  };

  updateNote = updatedNote => {
    this.setState({
      notes: this.state.notes.map(note => 
        (note.id !== updatedNote.id) ? note : updatedNote
      )
    })
  };

  render() {
    const value = {
      notes: this.state.notes,
      folders: this.state.folders,
      addFolder: this.handleAddFolder,
      addNote: this.handleAddNote,
      deleteFolder: this.handleDeleteFolder,
      deleteNote: this.handleDeleteNote,
      updateFolder: this.updateFolder,
      updateNote: this.updateNote,
    }
    return (
      <ApiContext.Provider value={value}>
        <div className='App'>
          <nav className='App__nav'>
            {this.renderNavRoutes()}
          </nav>
          <header className='App__header'>
            <h1>
              <Link to='/'>Noteful</Link>
              {' '}
              <FontAwesomeIcon icon='check-double' />
            </h1>
          </header>
          <main className='App__main'>
            {this.renderMainRoutes()}
          </main>
        </div>
      </ApiContext.Provider>
    )
  }
}

export default App