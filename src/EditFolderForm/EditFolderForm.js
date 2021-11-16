import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ApiContext from '../ApiContext'
import config from '../config'
import './EditFolderForm.css'

class EditFolderForm extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
          name: '',
          id: '',
          error: null,
        }
    }
    
    static propTypes = {
        match: PropTypes.shape({
            params: PropTypes.object,
        }),
        history: PropTypes.shape({
            push: PropTypes.func,
        }).isRequired,
    };

    static contextType = ApiContext;

    handleNameChange = e => {
        this.setState({ name: e.target.value })
    }

    handleSubmit = e => {
        e.preventDefault()
        const { folder_id } = this.props.match.params
        const newFolder = {
            name: e.target['name'].value,
            id: Number(folder_id),
        }
        const url = config.API_ENDPOINT + `/folders/${folder_id}`;
        fetch(url, {
            method: 'PATCH',
            body: JSON.stringify(newFolder),
            headers: {
                'content-type': 'application/json',
            },
        })
        .then(res => {
            if (!res.ok)
                return res.json().then(error => Promise.reject(error))
        })
        .then(() => {
            this.resetFields(newFolder)
            this.context.updateFolder(newFolder)
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
        })
    }

    handleClickCancel = () => {
        this.props.history.push('/')
    }

    render() {
        const { error } = this.state
        return (
            <section className='EditFolder'>
                <h2>Edit Folder</h2>
                <form
                    className='EditFolder__form'
                    onSubmit={this.handleSubmit}
                >
                    <div className='EditFolder__error' role='alert'>
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
                        </label>
                        <input
                            type='text'
                            name='name'
                            id='name'
                            placeholder='Folder name'
                            required
                            value={this.state.name}
                            onChange={this.handleNameChange}
                        />
                    </div>
                    <div className='EditFolder__buttons'>
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

export default EditFolderForm;