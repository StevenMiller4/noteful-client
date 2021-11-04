import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ApiContext from '../ApiContext'
import config from '../config'
import './EditFolderForm.css'

class EditFolderForm extends Component {
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
    };

    handleNameChange = e => {
        this.setState({ name: e.target.value })
    }

    handleSubmit = e => {
        e.preventDefault()
        const { folder_id } = this.props.match.params
        const { id, name } = this.state
        const newFolder = { id, name }
        const url = config.API_ENDPOINT + `/folders/${folder_id}`;
        fetch(url, {
            method: 'PATCH',
            body: JSON.stringify(newFolder),
            headers: {
                'content-type': 'application/json',
            },
        })
        .then(res => {
            console.log(res)
            if (!res.ok)
                return res.json().then(error => Promise.reject(error))
        })
        .then(() => {
            console.log(newFolder)
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
        const { error, name } = this.state
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
                        <label htmlFor='title'>
                            Name
                            {' '}
                        </label>
                        <input
                            type='text'
                            name='name'
                            id='name'
                            placeholder='Folder name'
                            required
                            value={name}
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