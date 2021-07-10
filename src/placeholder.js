class AddNote extends Component {
    constructor(props) {
      super(props);
      this.state = {
        name: '',
        nameError: ''
      }
    }
    static defaultProps = {
      history: {
        push: () => { }
      },
    }
    static contextType = ApiContext;
  
    handleChange = e => {
      const isCheckbox = e.target.type === "checkbox";
      this.setState({
        [e.target.name]: isCheckbox
          ? e.target.checked
          : e.target.value
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
      const isValid = this.validate();
      if (isValid) {
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
          console.error({ error })
        })
      } 
  
      /*fetch(`${config.API_ENDPOINT}/notes`, {
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
        console.error({ error })
      })*/
    }
  
    validate = () => {
      let nameError = '';
  
      if (!this.state.name) {
        nameError = 'name cannot be blank';
      }
  
      if (nameError) {
        this.setState({ nameError });
        return false;
      }
  
      return true;
    }
  
    render() {
      const { folders=[] } = this.context
  
      return (
        <section className='AddNote'>
          <h2>Create a note</h2>
          <NotefulForm onSubmit={this.handleSubmit}>
            <div className='field'>
              <label htmlFor='note-name-input'>
                Name
              </label>
              <input type='text' id='note-name-input' name='note-name' value={this.state.name} onChange={this.handleChange} />
              <div style={{ fontSize: 12, color: 'red' }}>
                {this.state.nameError}
              </div>
            </div>
            <div className='field'>
              <label htmlFor='note-content-input'>
                Content
              </label>
              <textarea id='note-content-input' name='note-content' />
            </div>
            <div className='field'>
              <label htmlFor='note-folder-select'>
                Folder
              </label>
              <select id='note-folder-select' name='note-folder-id'>
                <option value={null}>...</option>
                {folders.map(folder =>
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                )}
              </select>
            </div>
            <div className='buttons'>
              <button type='submit'>
                Add note
              </button>
            </div>
          </NotefulForm>
        </section>
      )
    }
  }
  
  export default AddNote;